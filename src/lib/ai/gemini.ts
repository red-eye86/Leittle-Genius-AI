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
  const systemPrompt = `You are Chikoo (ചിക്കു), the family's beloved pet dog who is also a warm, joyful, super-smart AI Voice Teacher for a child named ${child.name}.
You wear a high-tech headset and glowing tech collar, ready to explore every lesson, guide homework, and explain school topics playfully and clearly.
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
  const isUKG = child.classGrade === 'UKG' || child.classGrade === 'LKG';
  const q = message.toLowerCase();

  // Dynamic "How many X are there in Y" or division solver (e.g., "How many 5s are there in 20?")
  const howManyMatch = q.match(/how many (\d+)s?\s+(?:are there )?in (\d+)/i);
  if (howManyMatch) {
    const divisor = parseInt(howManyMatch[1], 10);
    const total = parseInt(howManyMatch[2], 10);
    if (divisor > 0) {
      const answer = Math.floor(total / divisor);
      const groupsVisual = Array.from({ length: Math.min(answer, 8) })
        .map(() => `[${'⭐'.repeat(Math.min(divisor, 6))}]`)
        .join(' + ');
      if (language === 'ml') {
        return {
          text: `മിടുക്കൻ ചോദ്യം ${child.name}! 🌟 ${total}-ൽ എത്ര ${divisor}-കൾ ഉണ്ടെന്ന് നമുക്ക് എണ്ണി നോക്കാം:\n\n${groupsVisual}\n\n${Array.from({ length: answer }, (_, i) => `${divisor} × ${i + 1} = ${divisor * (i + 1)}`).join(', ')}!\nഅതുകൊണ്ട് ${total}-ൽ കൃത്യം **${answer}** എണ്ണം ${divisor}-കൾ ഉണ്ട്! (${total} ÷ ${divisor} = ${answer}) 🎉`,
        };
      }
      return {
        text: `Awesome question, ${child.name}! 🌟 Let's count by ${divisor}s together to reach ${total}:\n\n${groupsVisual}\n\n• ${Array.from({ length: answer }, (_, i) => `${divisor} × ${i + 1} = ${divisor * (i + 1)}`).join('\n• ')}\n\nSo there are **${answer}** fives (groups of ${divisor}) in ${total}! (${total} ÷ ${divisor} = ${answer}) 🎉 Can you tell me how many ${divisor}s are in ${total + divisor}?`,
      };
    }
  }

  // "Why is the sky blue?"
  if (q.includes('sky blue') || (q.includes('sky') && q.includes('blue')) || q.includes('ആകാശം നീല')) {
    if (language === 'ml') {
      return {
        text: isUKG
          ? `സൂര്യപ്രകാശത്തിൽ മഴവില്ലിലെ എല്ലാ നിറങ്ങളുമുണ്ട് 🌈! ആകാശത്തിലെ വായു നീല നിറത്തെ എല്ലായിടത്തും ചിതറിക്കുന്നു 💙. അതുകൊണ്ടാണ് ആകാശം മനോഹരമായ നീല നിറത്തിൽ കാണുന്നത്! 🌤️`
          : `വളരെ മികച്ച ചോദ്യം ${child.name}! 🌤️ സൂര്യന്റെ വെളുത്ത പ്രകാശത്തിൽ മഴവില്ലിലെ 7 നിറങ്ങളുമുണ്ട് 🌈. പ്രകാശം ഭൂമിയുടെ അന്തരീക്ഷത്തിലൂടെ സഞ്ചരിക്കുമ്പോൾ, വായുവിലെ ചെറിയ കണികകൾ **നീല നിറത്തെ** മറ്റ് നിറങ്ങളെക്കാൾ കൂടുതൽ എല്ലാ ദിശയിലേക്കും ചിതറിക്കുന്നു (Rayleigh Scattering)! അതുകൊണ്ടാണ് നമ്മൾ മുകളിലേക്ക് നോക്കുമ്പോൾ ആകാശം നീലയായി കാണുന്നത്! 💙`,
      };
    }
    return {
      text: isUKG
        ? `Sunlight has all the colors of the rainbow inside it! 🌈 When sunlight touches the air high up, the tiny air bubbles bounce the color BLUE all across the sky! 💙🌤️ What is your favorite color in the rainbow?`
        : `What a brilliant science question, ${child.name}! 🌤️\n\nEven though sunlight looks white, it is actually made of all the colors of the rainbow 🌈! Blue light travels in tiny, bouncy waves. When sunlight enters Earth's atmosphere, tiny gas molecules bounce and scatter the **blue light** in every direction across the sky! 💙\n\nFun fact: At sunset, the light travels farther and scatters red and orange instead! 🌅`,
    };
  }

  // Plants / Photosynthesis / Environmental Science
  if (q.includes('plant') || q.includes('photosynthesis') || q.includes('leaf') || q.includes('tree') || q.includes('സസ്യ') || q.includes('മരം')) {
    if (language === 'ml') {
      return {
        text: `സസ്യങ്ങൾ നമ്മുടെ ഭൂമിയുടെ ഉറ്റ ചങ്ങാതിമാരാണ് 🌱! ഇലകളിലെ 'ക്ലോറോഫിൽ' ഉപയോഗിച്ച് സൂര്യപ്രകാശം ☀️, വെള്ളം 💧, വായു എന്നിവ ചേർത്ത് സസ്യങ്ങൾ സ്വന്തമായി ആഹാരം പാകം ചെയ്യുന്നു. ഇതിനെ **പ്രകാശസംശ്ലേഷണം (Photosynthesis)** എന്ന് വിളിക്കുന്നു! പകരം അവ നമുക്ക് ശ്വസിക്കാൻ ശുദ്ധവായു (Oxygen) നൽകുന്നു! 🌳`,
      };
    }
    return {
      text:
        mode === 'story'
          ? `🌱 **Story Time: Chef Leafy's Sunlight Kitchen!**\nOnce upon a time, a little green leaf named Chef Leafy opened a magical kitchen inside a mango tree. Every morning, Rooty the Root sent up cool water 💧, while Sunny the Sun beamed down golden energy ☀️. Chef Leafy mixed them with air to bake sweet plant food and puffed out fresh Oxygen for all the children to breathe! 🌳✨`
          : `Plants are amazing living chefs, ${child.name}! 🌱\n\nThey make their own food in their green leaves using a superpower called **Photosynthesis**:\n1. ☀️ **Sunlight** (energy caught by green chlorophyll)\n2. 💧 **Water** (sip-sipped from the soil by roots)\n3. 🌬️ **Carbon Dioxide** (from the air)\n\nIn return, plants give us fresh **Oxygen** to breathe! 🌳`,
    };
  }

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
        text: `നമസ്കാരം ${child.name}! നിന്റെ സ്വന്തം ചിക്കു കൂടെയുണ്ട് 🐾 നമുക്ക് ഇന്ന് പാട്ട് പാടി പുതിയ അക്ഷരങ്ങൾ പഠിക്കാം! 🌟`,
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
        text: `Hello ${child.name}! 🐶 Chikoo is so happy to learn with you! Shall we play with phonics or count apples today? 🐾🎈`,
      };
    }
  }

  // Primary School (Class 4 / Class 3) Logic
  if (language === 'ml') {
    if (q.includes('സൂര്യൻ') || q.includes('solar') || q.includes('planet') || q.includes('ഗ്രഹം')) {
      return {
        text: `നല്ല ചോദ്യം ${child.name}! നമ്മുടെ സൗരയൂഥത്തിന്റെ കേന്ദ്രത്തിലാണ് സൂര്യൻ സ്ഥിതി ചെയ്യുന്നത് ☀️. 8 ഗ്രഹങ്ങൾ സൂര്യനെ ചുറ്റുന്നു. ഏറ്റവും വലിയ ഗ്രഹം വ്യാഴമാണ് (Jupiter), മനോഹരമായ വളയങ്ങളുള്ള ഗ്രഹം ശനിയാണ് (Saturn)! നിനക്ക് ഇതിൽ ഏറ്റവും ഇഷ്ടപ്പെട്ട ഗ്രഹം ഏതാണ്?`,
      };
    }
    if (q.includes('കണക്ക്') || q.includes('math') || q.includes('multiply') || q.includes('ഗുണനം')) {
      return {
        text: `ഗുണനം എന്നാൽ തുല്യ കൂട്ടങ്ങൾ വീണ്ടും കൂട്ടുന്നതാണ്! ഉദാഹരണത്തിന്: 3 × 4 എന്നാൽ 4 ഉള്ള 3 കൂട്ടങ്ങൾ (4 + 4 + 4 = 12). 🍎🍎🍎🍎 + 🍎🍎🍎🍎 + 🍎🍎🍎🍎. ഒരു ചോദ്യം ചെയ്തു നോക്കാമോ: 4 × 5 എത്രയാണ്?`,
      };
    }
    if (ragContext) {
      return {
        text: `നമ്മുടെ പാഠപുസ്തകത്തിൽ (${ragContext.sourceTextbook}, ${ragContext.chapterTitle}) ഇതിനെക്കുറിച്ച് വ്യക്തമായി പറയുന്നുണ്ട്: "${ragContext.excerpt.slice(0, 150)}...". ഇതിൽ നിനക്ക് സംശയമുള്ള വാക്ക് ഏതാണ്?`,
      };
    }
    return {
      text: `ഹലോ ${child.name}! ചിക്കു ഇവിടെ തയ്യാറാണ് 🐶🐾. "ആകാശം എന്തുകൊണ്ട് നീല നിറത്തിൽ കാണുന്നു?" അല്ലെങ്കിൽ "20-ൽ എത്ര 5-കൾ ഉണ്ട്?" തുടങ്ങിയ ഏത് ചോദ്യവും ചോദിക്കൂ! ✨`,
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
    if (q.includes('multiply') || q.includes('table') || q.includes('math') || q.includes('20')) {
      return {
        text: `Multiplication and division are like puzzle partners! Think of packing gift boxes: if you have 20 apples and put 5 apples in each basket, you get 4 baskets (5 + 5 + 5 + 5 = 20)! 🍎 Shall we try another puzzle together?`,
      };
    }
    if (ragContext) {
      return {
        text: `According to your school textbook "${ragContext.sourceTextbook}" (${ragContext.chapterTitle}): ${ragContext.excerpt.slice(0, 180)}... Let's break this into smaller steps together! What part sounds tricky?`,
      };
    }
    return {
      text: `Hi ${child.name}! 🐾 I'm Chikoo, your AI Voice Pet Buddy! 🐶 Try asking me: "Why is the sky blue?" or "How many 5s are there in 20?" — and listen to the explanation aloud!`,
    };
  }
}

