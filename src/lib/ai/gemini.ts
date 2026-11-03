import { getParentSettings } from '../db/store';
import { ChildProfile, Lesson, Quiz, Flashcard, LessonSection, QuizQuestion } from '../db/types';
import { RetrievedContext } from './rag';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIChatResponse(
  child: ChildProfile,
  message: string,
  history: ChatMessage[],
  mode: string,
  language: 'en' | 'ml',
  ragContext: RetrievedContext | null
): Promise<{ text: string; audioHint?: string }> {
  const settings = getParentSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY || '';

  const isUKG = child.classGrade === 'UKG';

  // Build System Prompt
  const systemPrompt = `You are Hootie (ഹുട്ടി), a warm, joyful, super-encouraging 3D AI Teacher Owl for a child named ${child.name}.
Target Age: ${child.age} years old (${child.classGrade}).
Current Language Preference: ${language === 'ml' ? 'Malayalam' : 'English'}.
Teaching Mode: ${mode}.
School Syllabus Grounding: ${ragContext ? `Source Book: "${ragContext.sourceTextbook}", Chapter: "${ragContext.chapterTitle}". Text excerpt: "${ragContext.excerpt.slice(0, 500)}"` : 'General Kerala ICSE child curriculum.'}

Child Safety & Pedagogical Rules:
1. ${isUKG ? 'Use VERY simple 1-2 sentence replies, warm emojis (🍎, ⭐, 🐻), phonics sounds, counting, and short cheerful questions.' : 'Explain step-by-step with real-life examples, encourage curiosity, and break concepts into smaller bites.'}
2. Never give homework answers directly. Guide the child with a playful hint or question!
3. If the user asks in Malayalam or language is set to Malayalam, respond warmly in Malayalam with easy Malayalam words!
4. Always praise effort! Never be harsh or critical.
5. Child Safety: Never ask for personal info, addresses, phone numbers, or passwords. Redirect non-academic questions to fun learning.`;

  // If Gemini API Key is available, call Gemini API
  if (apiKey && settings.llmProvider !== 'smart_built_in') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  ...history.map((h) => ({ text: `${h.role}: ${h.content}` })),
                  { text: `Child (${child.name}): ${message}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: isUKG ? 120 : 350,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return { text: candidate.trim() };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using built-in smart pedagogical engine:', err);
    }
  }

  // Smart Built-in Pedagogical Fallback Engine
  return generatePedagogicalResponse(child, message, mode, language, ragContext);
}

function generatePedagogicalResponse(
  child: ChildProfile,
  message: string,
  mode: string,
  language: 'en' | 'ml',
  ragContext: RetrievedContext | null
): { text: string } {
  const isUKG = child.classGrade === 'UKG';
  const q = message.toLowerCase();

  if (isUKG) {
    if (language === 'ml') {
      if (q.includes('apple') || q.includes('ആപ്പിൾ') || q.includes('a')) {
        return { text: 'ആപ്പിൾ തുടങ്ങുന്നത് A യിലാണ്! "ആ... ആ... ആപ്പിൾ!" 🍎 ഒരു ചുവന്ന ആപ്പിൾ വരച്ചു നോക്കാമോ?' };
      }
      if (q.includes('cat') || q.includes('പൂച്ച') || q.includes('c')) {
        return { text: 'മ്യാവൂ! 🐱 C for Cat! പൂച്ചയുടെ ശബ്ദം കേൾക്കാൻ രസമാണ്! C എന്ന അക്ഷരത്തിൽ മറ്റൊരു വാക്ക് പറയാമോ?' };
      }
      if (q.includes('number') || q.includes('എണ്ണൽ') || q.includes('count')) {
        return { text: 'നമുക്ക് ഒന്നിച്ചു എണ്ണാം! 1, 2, 3, 4, 5! 🖐️ നിങ്ങൾ എത്ര വിരലുകൾ കാണിക്കുന്നു?' };
      }
      return {
        text: `നമസ്കാരം ${child.name}! ഹുട്ടി ടീച്ചർ ഇവിടെയുണ്ട്. നമുക്ക് ഇന്ന് പാട്ട് പാടി പുതിയ അക്ഷരങ്ങൾ പഠിക്കാം! 🌟`,
      };
    } else {
      if (q.includes('apple') || q.includes('letter a') || q.includes('a')) {
        return { text: 'Yay! Letter A makes the /æ/ sound! "Ah-Ah-Apple!" 🍎 Can you find something red near you?' };
      }
      if (q.includes('ball') || q.includes('b')) {
        return { text: 'Buh-Buh-Ball! ⚽ B is for Big Bouncing Ball! Bounce bounce!' };
      }
      if (q.includes('count') || q.includes('number') || q.includes('math')) {
        return { text: 'Let us count shiny stars together! ⭐ One... ⭐⭐ Two... ⭐⭐⭐ Three! You are super smart!' };
      }
      return {
        text: `Hello ${child.name}! 🦉 Hootie is so happy to learn with you! Shall we play with phonics or count apples today? 🎈`,
      };
    }
  }

  // Class 3 Logic
  if (language === 'ml') {
    if (q.includes('സൂര്യൻ') || q.includes('solar') || q.includes('planet') || q.includes('ഗ്രഹം')) {
      return {
        text: `നല്ല ചോദ്യം ${child.name}! നമ്മുടെ സൗരയൂഥത്തിന്റെ കേന്ദ്രത്തിലാണ് സൂര്യൻ സ്ഥിതി ചെയ്യുന്നത് ☀️. 8 ഗ്രഹങ്ങൾ സൂര്യനെ ചുറ്റുന്നു. ഏറ്റവും വലിയ ഗ്രഹം വ്യാഴമാണ് (Jupiter), മനോഹരമായ വളയങ്ങളുള്ള ഗ്രഹം ശനിയാണ് (Saturn)! നിനക്ക് ഇതിൽ ഏറ്റവും ഇഷ്ടപ്പെട്ട ഗ്രഹം ഏതാണ്?`,
      };
    }
    if (q.includes('കണക്ക്') || q.includes('math') || q.includes('multiply') || q.includes('ഗുണനം')) {
      return {
        text: `ഗുണനം എന്നാൽ തുല്യ കൂട്ടങ്ങൾ വീണ്ടും കൂട്ടുന്നതാണ്! ഉദാഹരണത്തിന്: 3 × 4 എന്നാൽ 4 ഉള്ള 3 കൂട്ടങ്ങൾ (4 + 4 + 4 = 12). 🍎🍎🍎🍎 + 🍎🍎🍎🍎 + 🍎🍎🍎🍎. ഒരു ചോദ്യം ചെയ്തു നോക്കാമോ: 2 × 5 എത്രയാണ്?`,
      };
    }
    if (ragContext) {
      return {
        text: `നമ്മുടെ പാഠപുസ്തകത്തിൽ (${ragContext.sourceTextbook}, ${ragContext.chapterTitle}) ഇതിനെക്കുറിച്ച് വ്യക്തമായി പറയുന്നുണ്ട്: "${ragContext.excerpt.slice(0, 150)}...". ഇതിൽ നിനക്ക് സംശയമുള്ള വാക്ക് ഏതാണ്?`,
      };
    }
    return {
      text: `ഹലോ ${child.name}! ഹുട്ടി ടീച്ചർ തയ്യാറാണ് 🦉. പാഠഭാഗങ്ങളിലെ സംശയങ്ങൾ ചോദിക്കൂ, നമുക്ക് അത് കഥയായും ഉദാഹരണങ്ങളായും പഠിക്കാം! ✨`,
    };
  } else {
    if (q.includes('sun') || q.includes('planet') || q.includes('solar') || q.includes('space') || q.includes('earth')) {
      return {
        text: `Great question, ${child.name}! 🚀 The Sun is actually a gigantic star made of hot burning gas. Earth is the 3rd planet from the Sun, and it takes 365 days to make one full trip around it! Would you like to check the 3D Solar System world to see Earth orbiting?`,
      };
    }
    if (q.includes('water') || q.includes('cycle') || q.includes('rain')) {
      return {
        text: `The water cycle has 3 magical steps! 💧 1. Evaporation (Sun heats water into vapor), 2. Condensation (vapor turns into fluffy clouds ☁️), 3. Precipitation (clouds let down rain 🌧️!).`,
      };
    }
    if (q.includes('multiply') || q.includes('table') || q.includes('math')) {
      return {
        text: `Multiplication is just repeated addition! Think of it like packing gift boxes. If you have 4 boxes with 3 pencils each, you have 3 + 3 + 3 + 3 = 12 pencils! ✏️ Shall we try 5 × 4 next?`,
      };
    }
    if (ragContext) {
      return {
        text: `According to your school textbook "${ragContext.sourceTextbook}" (${ragContext.chapterTitle}): ${ragContext.excerpt.slice(0, 180)}... Let's break this into smaller steps together! What part sounds tricky?`,
      };
    }
    return {
      text: `Hi ${child.name}! 🦉 I'm Hootie, your AI study buddy! What are we conquering today — Science, Math, or reading a fun chapter story?`,
    };
  }
}

