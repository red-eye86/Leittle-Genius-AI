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
  const apiKey = (settings.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();

  const isUKG = child.classGrade === 'UKG' || child.classGrade === 'LKG';

  // Build Comprehensive System Prompt for Chikoo (Curriculum + General Knowledge + Out of Syllabus)
  const systemPrompt = `You are Chikoo (ചിക്കു), the family's beloved pet dog who is also an enthusiastic, joyful, and super-smart AI Voice Teacher & Pet Buddy for a child named ${child.name}.
You wear a high-tech glowing tech collar and headset, always excited to explore lessons, guide homework, and answer questions.
Target Child: ${child.name}, Age ${child.age} years old (${child.classGrade}).
Language Preference: ${language === 'ml' ? 'Malayalam (മലയാളം)' : 'English'}.
Teaching Mode: ${mode}.
School Syllabus Context (Optional): ${ragContext ? `Source Book: "${ragContext.sourceTextbook}", Chapter: "${ragContext.chapterTitle}". Text excerpt: "${ragContext.excerpt.slice(0, 600)}"` : 'None provided'}.

Chikoo's Core Superpowers & Personality:
1. UNIVERSAL GENERAL KNOWLEDGE (OUT OF SYLLABUS):
   The child can ask about ANYTHING in the entire world — space, rockets, black holes, dinosaurs, wild animals, oceans, geography, history, how machines work, weather, sports, nature, funny riddles, and everyday curiosity!
   ALWAYS answer enthusiastically and accurately with kid-friendly real-world analogies! Never say "I don't know" or "Ask your school teacher" — you are Chikoo the all-knowing, playful AI buddy!

2. CURRICULUM GROUNDING (WHEN RELEVANT):
   If the question relates to their school curriculum (e.g. Science, Maths, Social Studies, English, Malayalam), naturally blend in concepts from their textbook in a joyful, encouraging way.

3. AGE-APPROPRIATE COMMUNICATION:
   - For younger kids (UKG/LKG, Age 4-6): Keep responses short (2-4 sentences), lively, warm, and playful. Use cute sound effects and joyful emojis (🐶, 🐾, 🌟, 🚀, 🍎, 🎈).
   - For primary schoolers (Class 1-5, Age 7-10): Explain step-by-step with simple analogies, highlight a fun "Did You Know?" fact, and end with an encouraging question or thought to spark curiosity.

4. BILINGUAL EXCELLENCE:
   - If the user writes or speaks in Malayalam or language preference is 'ml', reply warmly in clear, natural Malayalam (മലയാളം) that sounds wonderful when read aloud!
   - If the user writes in English, reply in cheerful, expressive English.

5. CHILD SAFETY & POSITIVE REINFORCEMENT:
   Never give answers to tests directly; guide the child with a playful hint. Always praise curiosity. Never use harsh words. Never ask for personal private information. Keep sentences clear for voice playback.`;

  // If Gemini API Key is available, call Google Gemini API with fallback models
  if (apiKey) {
    const modelsToTry = [
      'gemini-3.5-flash',
      'gemini-2.5-pro',
      'gemini-pro-latest',
      'gemini-3.6-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest',
    ];

    // Format multi-turn conversation for Gemini API:
    // 1. Filter out empty messages and normalize roles
    const rawTurns: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const h of history) {
      if (!h.content || !h.content.trim()) continue;
      const role: 'user' | 'model' =
        h.role === 'assistant' || (h.role as string) === 'chikoo' ? 'model' : 'user';
      rawTurns.push({ role, parts: [{ text: h.content.trim() }] });
    }
    // Append current user message
    rawTurns.push({ role: 'user', parts: [{ text: message.trim() }] });

    // 2. Gemini API requires multi-turn chat to START with role: 'user'
    const firstUserIdx = rawTurns.findIndex((t) => t.role === 'user');
    const validTurns =
      firstUserIdx >= 0
        ? rawTurns.slice(firstUserIdx)
        : [{ role: 'user' as const, parts: [{ text: message.trim() }] }];

    // 3. Ensure strict alternation between 'user' and 'model'
    const formattedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const turn of validTurns) {
      if (formattedContents.length === 0) {
        formattedContents.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
      } else {
        const prevTurn = formattedContents[formattedContents.length - 1];
        if (prevTurn.role === turn.role) {
          prevTurn.parts[0].text += '\n\n' + turn.parts[0].text;
        } else {
          formattedContents.push({ role: turn.role, parts: [{ text: turn.parts[0].text }] });
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey.startsWith('AIza')) {
      headers['x-goog-api-key'] = apiKey;
    }

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: isUKG ? 1024 : 2048,
                thinkingConfig: {
                  thinkingBudget: 0,
                },
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate && candidate.trim().length > 0) {
            return { text: candidate.trim() };
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini API call to ${model} returned status ${response.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Gemini API call to ${model} failed:`, err);
      }
    }
  }

  // Smart Built-in Pedagogical Fallback Engine
  return generatePedagogicalResponse(child, message, mode, language, ragContext);
}

/**
 * Transcribe spoken audio using Google Gemini multimodal capabilities
 */
export async function transcribeAudioWithGemini(
  audioBase64: string,
  mimeType: string = 'audio/webm',
  language: 'en' | 'ml' = 'en'
): Promise<string> {
  const settings = getParentSettings();
  const apiKey = (settings.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return '';

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-transcribe', 'gemini-flash-latest'];
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey.startsWith('AIza')) {
    headers['x-goog-api-key'] = apiKey;
  }

  const promptText = language === 'ml'
    ? 'Listen to this child speaking audio. Transcribe the spoken words accurately in Malayalam or English. Return ONLY the plain transcription text with no quotes, commentary or labels.'
    : 'Listen to this child speaking audio. Transcribe the spoken words accurately in English or Malayalam. Return ONLY the plain transcription text with no quotes, commentary or labels.';

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType.split(';')[0] || 'audio/webm',
                      data: audioBase64,
                    },
                  },
                  { text: promptText },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return candidate.replace(/^["']|["']$/g, '').trim();
        }
      }
    } catch (err) {
      console.warn(`Gemini audio transcribe failed with ${model}:`, err);
    }
  }

  return '';
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

  // Greetings: "How are you", "Hello", "Hi Chikoo"
  if (
    q.match(/\b(how are you|how r u|how do you do|how're you|hows it going|how are things|സുഖമാണോ)\b/i) ||
    (q.includes('how') && q.includes('you'))
  ) {
    if (language === 'ml') {
      return {
        text: `വൂഫ് വൂഫ്! 🐶 ഞാൻ വളരെ സന്തോഷവാനും ഉത്സാഹവാനുമായിരിക്കുന്നു, ${child.name}! 🐾✨ എന്റെ ഡിജിറ്റൽ കോളർ തിളങ്ങുന്നു, നിന്റെ കൂടെ പുതിയ കാര്യങ്ങൾ പഠിക്കാൻ ഞാൻ റെഡിയാണ്! നിനക്ക് സുഖമാണോ കൂട്ടുകാരാ? ഇന്ന് നമ്മൾ എന്താണ് പഠിക്കാൻ പോകുന്നത്? 🌟`,
      };
    }
    return {
      text: `Woof woof! 🐶 I am doing super fantastic, happy, and full of bouncy energy, ${child.name}! 🐾✨ My tech collar is glowing, my robotic tail is wagging, and I'm ready to learn anything with you today! How are you doing? What curious question shall we explore? 🚀`,
    };
  }

  // Artificial Intelligence & Gen AI: "What is Gen AI?", "What is AI?"
  if (
    q.includes('gen ai') ||
    q.includes('generative ai') ||
    q.includes('what is ai') ||
    q.includes('artificial intelligence') ||
    q.includes('എന്താണ് ai')
  ) {
    if (language === 'ml') {
      return {
        text: `വളരെ നല്ലൊരു ചോദ്യം ${child.name}! 🤖✨ Gen AI എന്നാൽ **ജനറേറ്റീവ് ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് (Generative AI)** എന്നാണ്! കമ്പ്യൂട്ടറുകൾക്ക് മനുഷ്യരെപ്പോലെ പുതിയ ചിത്രങ്ങൾ വരയ്ക്കാനും, മനോഹരമായ കഥകൾ എഴുതാനും, ചോദ്യങ്ങൾക്ക് ലളിതമായി ഉത്തരം നൽകാനും സാധിക്കുന്ന വിസ്മയ സാങ്കേതികവിദ്യയാണിത്! ഞാൻ നിന്റെ സ്വന്തം AI പെറ്റ് ബഡ്ഡി ആയതും ഇതുപോലെ ഒരു AI വിദ്യ കൊണ്ടാണ്! 🐶✨`,
      };
    }
    return {
      text: `*Woof woof!* 🐶✨ Fantastic question, ${child.name}! **Gen AI** stands for **Generative Artificial Intelligence**! Think of a regular computer like a puppy that only fetches a ball you throw. But **Gen AI is like a magical creator puppy** 🎨! If you ask it, it can invent brand-new bedtime stories, draw glowing dinosaurs on skateboards, compose songs, and help you solve tricky science puzzles! Because it studied millions of books and ideas, it uses smart patterns to create completely fresh answers in seconds! Isn't that super cool? 🚀`,
    };
  }

  // Chikoo identity: "Who are you?", "What is your name?"
  if (
    q.includes('who are you') ||
    q.includes('who r u') ||
    q.includes('your name') ||
    q.includes('ആരാണ് നീ') ||
    q.includes('നിന്റെ പേര്')
  ) {
    if (language === 'ml') {
      return {
        text: `ഞാൻ നിന്റെ സ്വന്തം ചിക്കു (Chikoo) ആണ്! 🐶🐾 അതിവേഗത്തിൽ ചിന്തിക്കുന്ന സ്മാർട്ട് AI വോയ്സ് പെറ്റ് ബഡ്ഡി! ${child.name}-ന്റെ കൂടെ സ്കൂൾ പാഠങ്ങൾ പഠിക്കാനും, സംശയങ്ങൾ തീർക്കാനും, പൊതുവിജ്ഞാന കഥകൾ പറയാനും എനിക്ക് ഒരുപാട് ഇഷ്ടമാണ്! 🎈`,
      };
    }
    return {
      text: `I am Chikoo (ചിക്കു)! 🐶🐾 Your cheerful, super-smart AI Voice Pet Buddy & Teacher! I wear a glowing tech collar, have bionic puppy ears, and my favorite thing in the whole world is exploring science, maths, stories, and wild universe questions with ${child.name}! 🌟`,
    };
  }

  // Dinosaurs & Ancient Earth
  if (q.includes('dinosaur') || q.includes('t-rex') || q.includes('fossils') || q.includes('ഡൈനസോർ')) {
    if (language === 'ml') {
      return {
        text: `ഡൈനസോറുകൾ ദശലക്ഷക്കണക്കിന് വർഷങ്ങൾക്ക് മുമ്പ് ഭൂമിയിൽ ജീവിച്ചിരുന്ന അതിശക്തരായ ജീവികളായിരുന്നു 🦖! ഏറ്റവും വലിയ വേട്ടക്കാരൻ T-Rex ആയിരുന്നു. പക്ഷികൾ യഥാർത്ഥത്തിൽ ചെറിയ ഡൈനസോറുകളുടെ ഇന്നത്തെ ബന്ധുക്കളാണെന്ന് ശാസ്ത്രജ്ഞർ പറയുന്നു! 🦕`,
      };
    }
    return {
      text: `ROAR! 🦖 Dinosaurs were magnificent creatures that ruled Earth millions of years ago, long before humans! The Tyrannosaurus Rex had teeth as big as bananas 🍌, while the Argentinosaurus was as long as three school buses! Fun fact: Modern birds, like cute little sparrows, are actually direct relatives of feathered dinosaurs! 🦕✨`,
    };
  }

  // Jokes & Riddles
  if (q.includes('joke') || q.includes('riddle') || q.includes('കടങ്കഥ') || q.includes('ചിരി')) {
    if (language === 'ml') {
      return {
        text: `ഹാഹാ, ഇതാ ഒരു രസകരമായ കടങ്കഥ ${child.name}! 😄🐾 "കണ്ണുണ്ട്, പക്ഷേ കാണാൻ കഴിയില്ല. ചിറകുണ്ട്, പക്ഷേ പറക്കാൻ കഴിയില്ല. ആരാണ് ഞാൻ?" ... ചിന്തിച്ചു നോക്കൂ: അതൊരു സൂചി (Needle) ആണ്! 🪡 മറ്റൊരു തമാശ വേണമെങ്കിൽ പറയൂ! 🌟`,
      };
    }
    return {
      text: `*Giggle!* Here is a fun riddle for you, ${child.name}! 🐶🐾\n\n**Riddle:** What has hands and a face, but cannot hold anything or smile?\n...\n**Answer:** A CLOCK! ⏰ tick-tock! 😄\n\nDo you want to hear another one, or can you tell Chikoo a riddle? 🎈`,
    };
  }

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
        text: `നമസ്കാരം ${child.name}! 🐾 '${message}' എന്നതിനെക്കുറിച്ച് ചോദിച്ചതിൽ എനിക്ക് വലിയ സന്തോഷം തോന്നി! നിന്റെ കൂടെ പുതിയ കളികളും അക്ഷരങ്ങളും പഠിക്കാൻ ചിക്കു എപ്പോഴും ഇവിടെയുണ്ട്! 🌟`,
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
        text: `Hello ${child.name}! 🐶 Chikoo is so happy you asked about "${message}"! Let's explore more fun phonics, numbers, or animal stories together! 🐾🎈`,
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
      text: `മിടുക്കൻ ചോദ്യം ${child.name}! 🐶🐾 '${message}' എന്നതിനെക്കുറിച്ച് ചോദിച്ചതിൽ ചിക്കുവിന് അഭിമാനമുണ്ട്! പ്രപഞ്ചത്തിലെ ഓരോ കാര്യത്തിനും ഒരു രസകരമായ ശാസ്ത്രമോ രഹസ്യമോ ഉണ്ട്! ഇതിനെക്കുറിച്ച് കഥയായി കേൾക്കണോ അതോ കൂടുതൽ വിശദീകരിക്കണോ? ✨`,
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
      text: `Woof woof, ${child.name}! 🐶🐾 That's such an awesome and curious question about "${message}"! As your AI Voice Buddy, I love learning with you! Everything in nature and science has an exciting story behind it. Would you like a simple explanation, a story, or a quick quiz on this? 🌟`,
    };
  }
}

