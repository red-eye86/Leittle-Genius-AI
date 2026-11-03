export interface CartoonCharacter {
  id: 'father' | 'mother' | 'eadrick' | 'faidan';
  name: string;
  malayalamName: string;
  role: string;
  malayalamRole: string;
  avatarUrl: string;
  voicePitch: number;
  voiceRate: number;
  badgeColor: string;
  borderColor: string;
  tagline: string;
}

export const FAMILY_CHARACTERS: Record<string, CartoonCharacter> = {
  father: {
    id: 'father',
    name: 'Papa Manoj',
    malayalamName: 'പപ്പ മനോജ്',
    role: 'Loving Father & Guide',
    malayalamRole: 'സ്നേഹനിധിയായ അച്ഛൻ',
    avatarUrl: '/characters/father_manoj.jpg',
    voicePitch: 0.9,
    voiceRate: 0.95,
    badgeColor: 'bg-blue-600 text-white',
    borderColor: 'border-blue-500',
    tagline: 'Always ready to explain the world with a warm smile! 👨‍💼',
  },
  mother: {
    id: 'mother',
    name: 'Mummy Tessy',
    malayalamName: 'മമ്മി ടെസ്സി',
    role: 'Caring Mother & Teacher',
    malayalamRole: 'സ്നേഹനിധിയായ അമ്മ',
    avatarUrl: '/characters/mother_tessy.jpg',
    voicePitch: 1.25,
    voiceRate: 0.95,
    badgeColor: 'bg-rose-500 text-white',
    borderColor: 'border-rose-400',
    tagline: 'Makes learning joyful, tasty, and full of love! 👩‍🏫',
  },
  eadrick: {
    id: 'eadrick',
    name: 'Big Brother Eadrick',
    malayalamName: 'ചേട്ടൻ ഏദ്രിക്',
    role: 'Elder Brother (Class 4, Age 9)',
    malayalamRole: 'മൂത്ത സഹോദരൻ (നാലാം ക്ലാസ്)',
    avatarUrl: '/characters/brother_eadrick.jpg',
    voicePitch: 1.15,
    voiceRate: 1.0,
    badgeColor: 'bg-amber-500 text-slate-900',
    borderColor: 'border-amber-400',
    tagline: 'Naruto fan, champion in science & always helping Faidan! ⚡',
  },
  faidan: {
    id: 'faidan',
    name: 'Little Faidan',
    malayalamName: 'കൊച്ചു ഫൈദാൻ',
    role: 'Younger Brother (UKG, Age 5)',
    malayalamRole: 'ഇളയ സഹോദരൻ (UKG)',
    avatarUrl: '/characters/faidan.jpg',
    voicePitch: 1.45,
    voiceRate: 0.92,
    badgeColor: 'bg-emerald-500 text-white',
    borderColor: 'border-emerald-400',
    tagline: 'Super curious explorer in UKG Div A who loves cartoons! 🌟',
  },
};

export type SceneBackdrop =
  | 'living_room'
  | 'garden'
  | 'kitchen'
  | 'classroom'
  | 'park'
  | 'space'
  | 'nature';

export interface CartoonDialogue {
  speakerId: 'father' | 'mother' | 'eadrick' | 'faidan';
  englishText: string;
  malayalamText: string;
  emotion: 'happy' | 'excited' | 'thinking' | 'explaining' | 'celebrating';
  actionPrompt?: string;
}

export interface CartoonScene {
  sceneNumber: number;
  title: string;
  malayalamTitle: string;
  backdrop: SceneBackdrop;
  visualStageEmoji: string;
  dialogues: CartoonDialogue[];
  keyConceptPopup?: {
    english: string;
    malayalam: string;
  };
}

export interface CartoonEpisode {
  chapterId: string;
  title: string;
  malayalamTitle: string;
  subjectTitle: string;
  bannerGradient: string;
  scenes: CartoonScene[];
}

export const PRESET_CARTOON_EPISODES: Record<string, CartoonEpisode> = {
  // =========================================================================
  // 1. GENERAL AWARENESS (KG2 GA) — CH 1: SENSE ORGANS
  // =========================================================================
  'chap-ukg-evs-1': {
    chapterId: 'chap-ukg-evs-1',
    title: 'The Great Cookie Mystery & Our 5 Senses!',
    malayalamTitle: 'ബിസ്ക്കറ്റ് രഹസ്യവും നമ്മുടെ 5 പഞ്ചേന്ദ്രിയങ്ങളും!',
    subjectTitle: 'General Awareness (KG2 GA) — Chapter 1',
    bannerGradient: 'from-amber-400 via-orange-500 to-rose-500',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Mummy’s Kitchen Surprise',
        malayalamTitle: 'മമ്മിയുടെ അടുക്കളയിലെ സർപ്രൈസ്',
        backdrop: 'kitchen',
        visualStageEmoji: '🍪👃💨✨',
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Sniff sniff! Mmm... Mummy Tessy, what is that heavenly sweet smell coming from the oven?',
            malayalamText: 'മമ്മി ടെസ്സി! നല്ലൊരു മധുര മണം അടുക്കളയിൽ നിന്ന് വരുന്നുണ്ടല്ലോ! ഇതെന്താണ്?',
            emotion: 'excited',
            actionPrompt: 'Faidan follows the delicious aroma into the kitchen.',
          },
          {
            speakerId: 'mother',
            englishText: 'Haha, sharp nose, little Faidan! I just baked fresh warm choco-chip cookies for you and Eadrick!',
            malayalamText: 'ഹാഹാ, ഫൈദാന്റെ മൂക്ക് സൂപ്പറാണല്ലോ! ഞാൻ നിങ്ങൾക്കായി ചൂടുള്ള ചോക്കോ-ചിപ്പ് ബിസ്ക്കറ്റ് ഉണ്ടാക്കുകയായിരുന്നു!',
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy holds up a golden tray of warm cookies.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Ding-dong! I heard the oven bell ring all the way from my study room! My ears never miss cookie time!',
            malayalamText: 'ഞാൻ പഠനമുറിയിൽ വെച്ചുതന്നെ ഓവന്റെ ബെല്ല് ചെവികൊണ്ട് കേട്ടു! ചേട്ടന്റെ ചെവി ബെല്ല് കൃത്യമായി കേൾക്കും!',
            emotion: 'excited',
            actionPrompt: 'Eadrick zooms into the kitchen with a happy jump.',
          },
        ],
        keyConceptPopup: {
          english: 'Nose smells 👃 and Ears hear 👂!',
          malayalam: 'മൂക്ക് കൊണ്ട് മണം അറിയുന്നു 👃, ചെവി കൊണ്ട് കേൾക്കുന്നു 👂!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Papa Manoj Explains the 5 Senses',
        malayalamTitle: 'പപ്പ മനോജ് 5 ഇന്ദ്രിയങ്ങളെ പറഞ്ഞുതരുന്നു',
        backdrop: 'living_room',
        visualStageEmoji: '👀👂👃👅🖐️',
        dialogues: [
          {
            speakerId: 'father',
            englishText: 'Look at my two little detectives! Did you know your body used your 5 Sense Organs just now?',
            malayalamText: 'എന്റെ രണ്ട് മിടുക്കന്മാരെ നോക്കൂ! ഇപ്പോൾ നിങ്ങളുടെ ശരീരം പഞ്ചേന്ദ്രിയങ്ങളെയാണ് ഉപയോഗിച്ചത് എന്ന് അറിയാമോ?',
            emotion: 'explaining',
            actionPrompt: 'Papa Manoj sits down with Faidan and Eadrick with a big smile.',
          },
          {
            speakerId: 'faidan',
            englishText: '5 Sense Organs, Papa? Tell me, tell me! Which ones?',
            malayalamText: '5 പഞ്ചേന്ദ്രിയങ്ങളോ പപ്പാ? ഏതൊക്കെയാണ്? എനിക്ക് പറഞ്ഞു തരൂ!',
            emotion: 'thinking',
            actionPrompt: 'Faidan points to his curious eyes.',
          },
          {
            speakerId: 'father',
            englishText: 'Eyes to SEE the round cookies 👀, Ears to HEAR the oven bell 👂, Nose to SMELL the aroma 👃!',
            malayalamText: 'കണ്ണുകൾ കൊണ്ട് ബിസ്ക്കറ്റ് കാണുന്നു 👀, ചെവികൊണ്ട് ബെല്ല് കേൾക്കുന്നു 👂, മൂക്കുകൊണ്ട് മണം അറിയുന്നു 👃!',
            emotion: 'explaining',
          },
          {
            speakerId: 'mother',
            englishText: 'And don’t forget: Skin on your hands to FEEL the warm plate 🖐️, and Tongue to TASTE the sweetness 👅!',
            malayalamText: 'കൈയിലെ ത്വക്ക് കൊണ്ട് ചൂട് തൊട്ടറിയുന്നു 🖐️, നാക്ക് കൊണ്ട് ബിസ്ക്കറ്റിന്റെ മധുരം രുചിച്ചറിയുന്നു 👅!',
            emotion: 'happy',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Eyes, Ears, Nose, Tongue, and Skin! The 5 superheroes of our body! Crunch crunch, delicious!',
            malayalamText: 'കണ്ണ്, ചെവി, മൂക്ക്, നാക്ക്, ത്വക്ക്! നമ്മുടെ ശരീരത്തിലെ 5 സൂപ്പർ ഹീറോകൾ! നല്ല സ്വാദ്!',
            emotion: 'celebrating',
            actionPrompt: 'The whole family enjoys the warm cookies together.',
          },
        ],
        keyConceptPopup: {
          english: 'Our 5 Senses: Eyes (See), Ears (Hear), Nose (Smell), Tongue (Taste), Skin (Touch)!',
          malayalam: '5 പഞ്ചേന്ദ്രിയങ്ങൾ: കണ്ണ് (കാഴ്ച), ചെവി (കേൾവി), മൂക്ക് (മണം), നാക്ക് (രുചി), ത്വക്ക് (സ്പർശനം)!',
        },
      },
    ],
  },

  // =========================================================================
  // 2. FUN WITH NUMBERS (KG2 MATH) — CH 4: ADDITION 5 + 2 = 7 (FROM COVER!)
  // =========================================================================
  'chap-ukg-math-4': {
    chapterId: 'chap-ukg-math-4',
    title: 'The Chalkboard Magic: 5 + 2 = 7!',
    malayalamTitle: 'ബോർഡിലെ മാന്ത്രിക കൂട്ടൽ: 5 + 2 = 7!',
    subjectTitle: 'Fun with Numbers (KG2 MATH) — Chapter 4',
    bannerGradient: 'from-sky-500 via-indigo-600 to-purple-600',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Apples from the Market',
        malayalamTitle: 'മാർക്കറ്റിൽ നിന്ന് കൊണ്ടുവന്ന ആപ്പിളുകൾ',
        backdrop: 'living_room',
        visualStageEmoji: '🍎🍎🍎🍎🍎 + 🍏🍏 = 7',
        dialogues: [
          {
            speakerId: 'father',
            englishText: 'Hello boys! Look what I brought from the fruit market — sweet juicy red apples!',
            malayalamText: 'മക്കളെ, നോക്കൂ പപ്പ മാർക്കറ്റിൽ നിന്ന് നല്ല ചുവന്ന ആപ്പിളുകൾ കൊണ്ടുവന്നിട്ടുണ്ട്!',
            emotion: 'happy',
            actionPrompt: 'Papa Manoj places a basket with 5 red apples on the table.',
          },
          {
            speakerId: 'faidan',
            englishText: 'Let me count them, Papa! One, Two, Three, Four, FIVE red apples! 1, 2, 3, 4, 5!',
            malayalamText: 'ഞാൻ എണ്ണാം പപ്പാ! ഒന്ന്, രണ്ട്, മൂന്ന്, നാല്, അഞ്ച്! 5 ചുവന്ന ആപ്പിളുകൾ!',
            emotion: 'excited',
            actionPrompt: 'Faidan points his tiny finger to each apple.',
          },
          {
            speakerId: 'mother',
            englishText: 'And look here, Faidan! Mummy has 2 fresh green apples from our garden tree. Let’s put them together!',
            malayalamText: 'ഇവിടെ നോക്കൂ ഫൈദാൻ, മമ്മിയുടെ കൈയിൽ നമ്മുടെ തോട്ടത്തിലെ 2 പച്ച ആപ്പിളുകൾ കൂടിയുണ്ട്!',
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy places 2 green apples beside the 5 red apples.',
          },
        ],
        keyConceptPopup: {
          english: 'Addition means PUTTING THINGS TOGETHER! Symbol is Plus (+).',
          malayalam: 'കൂട്ടൽ (+) എന്നാൽ വസ്തുക്കളെ ഒരുമിച്ച് ചേർത്തു വെയ്ക്കുക എന്നർത്ഥം!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Eadrick and Faidan Solve the Cover Equation',
        malayalamTitle: 'ഏദ്രിക്കും ഫൈദാനും 5 + 2 = 7 കണ്ടുപിടിക്കുന്നു',
        backdrop: 'classroom',
        visualStageEmoji: '🖐️ + ✌️ = 7 ⭐',
        dialogues: [
          {
            speakerId: 'eadrick',
            englishText: 'Hey Faidan, just like the girl writing on your Math book cover! Let’s add them on the chalkboard: 5 + 2!',
            malayalamText: 'ഫൈദാൻ, നിന്റെ മാത്സ് ബുക്കിന്റെ പുറംചട്ടയിലെ കുട്ടിയെപ്പോലെ നമുക്കിത് ചോക്കുകൊണ്ട് എഴുതാം: 5 + 2!',
            emotion: 'excited',
            actionPrompt: 'Eadrick picks up a piece of chalk and writes "5 + 2 = " on the board.',
          },
          {
            speakerId: 'faidan',
            englishText: 'We had 5 in our head... now let’s count 2 more! 6... and SEVEN! 5 + 2 = 7!',
            malayalamText: 'മനസ്സിൽ 5 ഉണ്ട്... ഇനി 2 വിരലുകൾ കൂടി എണ്ണാം: ആറ്... ഏഴ്! ആകെ 7!',
            emotion: 'celebrating',
            actionPrompt: 'Faidan jumps up and cheers with both hands in the air.',
          },
          {
            speakerId: 'father',
            englishText: 'Brilliant job, Faidan and Eadrick! 5 plus 2 equals 7! You are true Math Champions!',
            malayalamText: 'അടിപൊളി! 5 ഉം 2 ഉം കൂട്ടിയാൽ 7! നിങ്ങൾ രണ്ടുപേരും മിടുക്കന്മാരായ മാത്സ് ചാമ്പ്യന്മാരാണ്!',
            emotion: 'celebrating',
            actionPrompt: 'Papa Manoj and Mummy Tessy clap proudly.',
          },
        ],
        keyConceptPopup: {
          english: '5 + 2 = 7! 5 apples + 2 apples = 7 apples in total! 🍎',
          malayalam: '5 + 2 = 7! 5 ആപ്പിളും 2 ആപ്പിളും ചേരുമ്പോൾ ആകെ 7 ആപ്പിളുകൾ! 🍎',
        },
      },
    ],
  },

  // =========================================================================
  // 3. MALAYALAM CHANGATHI BOOK-B — CH 5: NATURE FRIENDS (FROM COVER!)
  // =========================================================================
  'chap-ukg-mal-5': {
    chapterId: 'chap-ukg-mal-5',
    title: 'ചങ്ങാതിയുടെ പൂന്തോട്ടത്തിലെ കൊച്ചു കൂട്ടുകാർ!',
    malayalamTitle: 'ചങ്ങാതിയുടെ പൂന്തോട്ടത്തിലെ കൊച്ചു കൂട്ടുകാർ!',
    subjectTitle: 'Malayalam — ചങ്ങാതി Book-B (Chapter 5)',
    bannerGradient: 'from-emerald-500 via-teal-600 to-green-700',
    scenes: [
      {
        sceneNumber: 1,
        title: 'The Backyard Garden Adventure',
        malayalamTitle: 'വീട്ടുതോട്ടത്തിലെ അത്ഭുതങ്ങൾ',
        backdrop: 'garden',
        visualStageEmoji: '🌺🦋🐝🍄🐌🐜',
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Look Mummy Tessy! A colorful dragonfly is hovering over the yellow flower! Just like my Changathi book cover!',
            malayalamText: 'മമ്മി ടെസ്സി നോക്കൂ! മഞ്ഞപ്പൂവിന് മുകളിൽ ഒരു തുമ്പി പാറിപ്പറക്കുന്നു! എന്റെ ചങ്ങാതി പുസ്തകത്തിന്റെ പുറംചട്ടയിലെ തുമ്പിയെപ്പോലെ!',
            emotion: 'excited',
            actionPrompt: 'Faidan points happily to a hovering dragonfly.',
          },
          {
            speakerId: 'mother',
            englishText: 'Yes, Faidan! In Malayalam we call it "തുമ്പി" (Thumbi)! And look under the big leaf — who is carrying a tiny shell house?',
            malayalamText: 'അതെ ഫൈദാൻ, അതിനെ മലയാളത്തിൽ "തുമ്പി" എന്ന് പറയും! ആ വലിയ ഇലയുടെ അടിയിൽ നോക്കൂ, പുറത്ത് കൊച്ചു കൂടുമായി ആരാണ് നടക്കുന്നത്?',
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy gently points to a tiny snail.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'That is a Snail! In Malayalam, it is called "ഒച്ച്" (Och)! And behind it, there is a cute red Mushroom house — "കൂൺ" (Koon)!',
            malayalamText: 'അതാണ് ഒച്ച് (Snail)! അതിന്റെ പുറകിൽ ചുമന്ന തൊപ്പിവെച്ച കൂൺ (Mushroom) വളർന്നു നിൽക്കുന്നുണ്ട്!',
            emotion: 'explaining',
            actionPrompt: 'Eadrick kneels down beside Faidan to inspect the snail.',
          },
        ],
        keyConceptPopup: {
          english: 'തുമ്പി = Dragonfly, ഒച്ച് = Snail, കൂൺ = Mushroom, പൂമ്പാറ്റ = Butterfly!',
          malayalam: 'തുമ്പി, ഒച്ച്, കൂൺ, പൂമ്പാറ്റ, തേനീച്ച — പ്രകൃതിയിലെ കൊച്ചു കൂട്ടുകാർ!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Papa Manoj and the Ants Working Together',
        malayalamTitle: 'പപ്പ മനോജും കൂട്ടത്തോടെ നടക്കുന്ന ഉറുമ്പുകളും',
        backdrop: 'garden',
        visualStageEmoji: '🐜🐜🐜🍯🌞',
        dialogues: [
          {
            speakerId: 'father',
            englishText: 'Come see here, boys! A long line of busy little black ants — "ഉറുമ്പ്" (Urumbu) carrying bread crumbs!',
            malayalamText: 'മക്കളെ ഇവിടെ നോക്കൂ! കുഞ്ഞു കറുത്ത ഉറുമ്പുകൾ (Ants) ഒന്നിച്ചുകൂടി ആഹാരം ചുമന്നുകൊണ്ടുപോകുന്നു!',
            emotion: 'happy',
            actionPrompt: 'Papa Manoj smiles and shows the neat line of marching ants.',
          },
          {
            speakerId: 'faidan',
            englishText: 'ഉ - ഉറുമ്പ് (Urumbu)! ഉറുമ്പുകൾ ഒന്നിച്ച് ജോലി ചെയ്യുന്നു, പപ്പാ!',
            malayalamText: 'ഉ - ഉറുമ്പ്! ഉറുമ്പുകൾ എല്ലാവരും കൂട്ടുകാരായി ഒന്നിച്ചാണ് ജോലി ചെയ്യുന്നത്!',
            emotion: 'excited',
          },
          {
            speakerId: 'mother',
            englishText: 'And buzzing above them is "തേനീച്ച" (Honeybee), drinking sweet nectar from the hibiscus flower!',
            malayalamText: 'അവർക്ക് മുകളിലൂടെ പൂന്തേൻ കുടിക്കാൻ തേനീച്ച (Honeybee) മൂളിയെത്തുന്നുണ്ട്!',
            emotion: 'happy',
          },
          {
            speakerId: 'eadrick',
            englishText: 'തുമ്പി, തേനീച്ച, ഒച്ച്, ഉറുമ്പ്, മണ്ണിര, പൂമ്പാറ്റ! Nature is full of best friends!',
            malayalamText: 'തുമ്പി, തേനീച്ച, ഒച്ച്, ഉറുമ്പ്, മണ്ണിര, പൂമ്പാറ്റ! പ്രകൃതി നിറയെ നമ്മുടെ ചങ്ങാതിമാരാണ്!',
            emotion: 'celebrating',
            actionPrompt: 'Faidan and Eadrick sing the Changathi rhyme together.',
          },
        ],
        keyConceptPopup: {
          english: 'Malayalam Friends: ഉറുമ്പ് (Ant), തേനീച്ച (Bee), മണ്ണിര (Earthworm), തുമ്പി (Dragonfly)!',
          malayalam: 'മലയാളം വാക്കുകൾ: ഉറുമ്പ്, തേനീച്ച, മണ്ണിര, തുമ്പി, പക്ഷിമൃഗാദികൾ!',
        },
      },
    ],
  },

  // =========================================================================
  // 4. ENGLISH READER (KG2 ENGLISH 2) — CH 2: SHORT VOWEL CVC WORDS
  // =========================================================================
  'chap-ukg-phonics-2': {
    chapterId: 'chap-ukg-phonics-2',
    title: 'The Cat on the Mat & The Magic CVC Word Game!',
    malayalamTitle: 'പൂച്ചയും പായയും — മൂന്നക്ഷര CVC വാക്കുകൾ!',
    subjectTitle: 'English Reader (KG2 ENGLISH 2) — Chapter 2',
    bannerGradient: 'from-pink-500 via-rose-500 to-purple-600',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Mummy Tessy’s Word Building Blocks',
        malayalamTitle: 'മമ്മി ടെസ്സിയുടെ അക്ഷരക്കട്ടകൾ',
        backdrop: 'classroom',
        visualStageEmoji: '🐱🧶🟫',
        dialogues: [
          {
            speakerId: 'mother',
            englishText: 'Faidan darling, let’s play the 3-letter magic word game! Listen to the letter sounds: /k/ ... /æ/ ... /t/!',
            malayalamText: 'ഫൈദാൻ മോനേ, നമുക്ക് മൂന്നക്ഷര വാക്ക് കളി കളിക്കാം! ശബ്ദങ്ങൾ ശ്രദ്ധിക്കൂ: /k/ ... /æ/ ... /t/!',
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy places three letter blocks C - A - T together.',
          },
          {
            speakerId: 'faidan',
            englishText: 'C - A - T... CAT! 🐱 Like a cute fluffy kitten sitting on the floor!',
            malayalamText: 'C - A - T... ക്യാറ്റ്! പൂച്ചക്കുഞ്ഞ്!',
            emotion: 'excited',
            actionPrompt: 'Faidan holds up the CAT card with a huge grin.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Now watch this, Faidan! If I change the "C" to "M"... /m/ /æ/ /t/... MAT! The Cat is on the Mat!',
            malayalamText: 'ഇനി നോക്കൂ ഫൈദാൻ! ആദ്യത്തെ "C" മാറ്റി "M" വെച്ചാൽ MAT ആകും! പായ! പൂച്ച പായയിൽ ഇരിക്കുന്നു!',
            emotion: 'explaining',
            actionPrompt: 'Eadrick slides the block M into place.',
          },
        ],
        keyConceptPopup: {
          english: 'C-A-T = Cat 🐱, M-A-T = Mat 🟫, B-A-T = Bat 🏏',
          malayalam: 'C-A-T = പൂച്ച, M-A-T = പായ, B-A-T = ബാറ്റ്!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Papa Manoj and the Sunny Bun',
        malayalamTitle: 'പപ്പ മനോജും സൂര്യനും ബണ്ണും',
        backdrop: 'garden',
        visualStageEmoji: '☀️🍞🐶',
        dialogues: [
          {
            speakerId: 'father',
            englishText: 'Look up at the golden sky, boys! What gives us warm light? S - U - N... SUN! ☀️',
            malayalamText: 'ആകാശത്തേക്ക് നോക്കൂ മക്കളെ! നമുക്ക് വെളിച്ചം നൽകുന്നത് S - U - N... SUN! സൂര്യൻ!',
            emotion: 'happy',
            actionPrompt: 'Papa Manoj points to the bright sun.',
          },
          {
            speakerId: 'faidan',
            englishText: 'SUN rhymes with BUN! B - U - N! And RUN! R - U - N! Let’s run to Papa!',
            malayalamText: 'SUN നൊപ്പം ചേരുന്ന വാക്കാണ് BUN (ബൺ), RUN (ഓടുക)! നമുക്ക് പപ്പയുടെ അടുത്തേക്ക് ഓടാം!',
            emotion: 'celebrating',
            actionPrompt: 'Faidan runs happily into Papa Manoj’s arms.',
          },
          {
            speakerId: 'mother',
            englishText: 'Wonderful reading, Faidan! Cat, Mat, Sun, Bun, Pin, Pen! You can read all 3-letter CVC words now!',
            malayalamText: 'മിടുക്കൻ ഫൈദാൻ! Cat, Mat, Sun, Bun, Pen തുടങ്ങിയ വാക്കുകൾ നീ ഇപ്പോൾ മനോഹരമായി വായിക്കുന്നു!',
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: 'Short vowel words: Cat, Pen, Pin, Pot, Sun! Blending sounds makes reading easy!',
          malayalam: 'മൂന്നക്ഷര വാക്കുകൾ: Cat, Pen, Pin, Pot, Sun! ശബ്ദങ്ങൾ കൂട്ടി വായിക്കാം!',
        },
      },
    ],
  },

  // =========================================================================
  // 5. ENGLISH LISTEN & SPEAK (KG2 2) — CH 1: GREETINGS & MAGIC WORDS
  // =========================================================================
  'chap-ukg-listen-1': {
    chapterId: 'chap-ukg-listen-1',
    title: 'Good Morning, Golden Words & Polite Manners!',
    malayalamTitle: 'ഗുഡ് മോണിംഗ്, സുവർണ്ണ വാക്കുകൾ, നല്ല ശീലങ്ങൾ!',
    subjectTitle: 'English Listen & Speak (KG2 2) — Chapter 1',
    bannerGradient: 'from-violet-500 via-purple-600 to-indigo-700',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Morning Greetings at the Breakfast Table',
        malayalamTitle: 'പ്രഭാത അഭിവാദനങ്ങൾ',
        backdrop: 'kitchen',
        visualStageEmoji: '🌅🥛🥞',
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Good morning, Papa Manoj! Good morning, Mummy Tessy!',
            malayalamText: 'ഗുഡ് മോണിംഗ് പപ്പാ! ഗുഡ് മോണിംഗ് മമ്മീ!',
            emotion: 'excited',
            actionPrompt: 'Faidan walks into the dining room with a bright smile.',
          },
          {
            speakerId: 'mother',
            englishText: 'Good morning, my sweet Faidan! How did you sleep? Did you have happy dreams?',
            malayalamText: 'ഗുഡ് മോണിംഗ് എന്റെ ഫൈദാൻ മോനേ! നന്നായി ഉറങ്ങിയോ?',
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy hugs Faidan and hands him a warm cup of milk.',
          },
          {
            speakerId: 'faidan',
            englishText: 'Mummy, PLEASE may I have a pancake? And THANK YOU for the warm milk!',
            malayalamText: 'മമ്മി, എനിക്ക് ഒരു പാൻകേക്ക് തരുമോ PLEASE? നല്ല പാലിന് നന്ദി THANK YOU!',
            emotion: 'happy',
          },
          {
            speakerId: 'father',
            englishText: 'That’s my polite boy! "Please" and "Thank You" are Golden Magic Words that make everyone happy!',
            malayalamText: 'അതാണ് എന്റെ മിടുക്കൻ! "Please", "Thank You" എന്നീ വാക്കുകൾ കേൾക്കുമ്പോൾ എല്ലാവർക്കും സന്തോഷം തോന്നും!',
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: 'Magic Words: Please, Thank You, Sorry, Excuse Me, Good Morning!',
          malayalam: 'മാന്ത്രിക വാക്കുകൾ: പ്ലീസ്, താങ്ക് യു, സോറി, എക്സ്ക്യൂസ് മീ, ഗുഡ് മോണിംഗ്!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Self-Introduction with Brother Eadrick',
        malayalamTitle: 'ചേട്ടൻ ഏദ്രിക്കിനൊപ്പം സ്വയം പരിചയപ്പെടുത്തൽ',
        backdrop: 'living_room',
        visualStageEmoji: '👦🧒🤝✨',
        dialogues: [
          {
            speakerId: 'eadrick',
            englishText: 'Faidan, imagine new friends come to our school! How will you introduce yourself in English?',
            malayalamText: 'ഫൈദാൻ, സ്കൂളിൽ പുതിയ കൂട്ടുകാർ വന്നാൽ നീ എങ്ങനെ ഇംഗ്ലീഷിൽ സ്വയം പരിചയപ്പെടുത്തും?',
            emotion: 'thinking',
            actionPrompt: 'Eadrick pretends to be a new friend offering a handshake.',
          },
          {
            speakerId: 'faidan',
            englishText: 'Hello! My name is Faidan Bryan M. I am 5 years old. I study in UKG Div A!',
            malayalamText: 'ഹലോ! എന്റെ പേര് ഫൈദാൻ ബ്രയാൻ എം. എനിക്ക് 5 വയസ്സ്. ഞാൻ UKG Div A യിലാണ് പഠിക്കുന്നത്!',
            emotion: 'excited',
            actionPrompt: 'Faidan stands tall with confidence and shakes Eadrick’s hand.',
          },
          {
            speakerId: 'father',
            englishText: 'Super clear voice, Faidan! Clear, polite, and confident. Everyone in school will love to be your friend!',
            malayalamText: 'വളരെ മനോഹരമായി പറഞ്ഞു ഫൈദാൻ! സ്കൂളിലെ എല്ലാവർക്കും നിന്നെ വലിയ ഇഷ്ടമാകും!',
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: '"Hello! My name is Faidan Bryan M. I study in UKG Div A."',
          malayalam: '"ഹലോ! എന്റെ പേര് ഫൈദാൻ ബ്രയാൻ എം. ഞാൻ UKG Div A യിലാണ് പഠിക്കുന്നത്."',
        },
      },
    ],
  },
};

/**
 * Universal Fallback Episode Generator
 * If a chapter does not have a static script above, this generates a warm,
 * chapter-tailored family cartoon episode starring Papa Manoj, Mummy Tessy,
 * Brother Eadrick, and Faidan!
 */
export function getOrCreateCartoonEpisode(
  chapterId: string,
  chapterTitle: string,
  chapterSummary: string,
  keyTerms: string[] = []
): CartoonEpisode {
  if (PRESET_CARTOON_EPISODES[chapterId]) {
    return PRESET_CARTOON_EPISODES[chapterId];
  }

  const termsString = keyTerms.slice(0, 4).join(', ') || 'cool concepts';

  return {
    chapterId,
    title: `Faidan & Eadrick Explore: ${chapterTitle}`,
    malayalamTitle: `ഫൈദാനും ഏദ്രിക്കും പഠിക്കുന്നു: ${chapterTitle}`,
    subjectTitle: chapterTitle,
    bannerGradient: 'from-blue-500 via-indigo-600 to-purple-600',
    scenes: [
      {
        sceneNumber: 1,
        title: 'Curious Questions with Mummy Tessy & Papa Manoj',
        malayalamTitle: 'സംശയങ്ങളും മറുപടികളും',
        backdrop: 'living_room',
        visualStageEmoji: '🤔💡📚✨',
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: `Papa Manoj, Mummy Tessy! Today our lesson is about ${chapterTitle}! Can you help me understand it?`,
            malayalamText: `പപ്പാ, മമ്മീ! ഇന്നത്തെ നമ്മുടെ പാഠം ${chapterTitle} ആണ്! എനിക്കിത് പറഞ്ഞുതരുമോ?`,
            emotion: 'thinking',
            actionPrompt: 'Faidan holds open his school book with big curious eyes.',
          },
          {
            speakerId: 'mother',
            englishText: `Of course, sweet Faidan! ${chapterSummary.slice(0, 120)}... It is all around us in daily life!`,
            malayalamText: `തീർച്ചയായും ഫൈദാൻ മോനേ! ${chapterTitle} നമ്മുടെ ചുറ്റുപാടുകളിൽ തന്നെയുള്ള കാര്യമാണ്!`,
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy smiles warmly and points to practical examples.',
          },
          {
            speakerId: 'father',
            englishText: `Remember key terms like ${termsString}! When we learn with pictures and real life, everything becomes easy!`,
            malayalamText: `${termsString} തുടങ്ങിയ പ്രധാന വാക്കുകൾ ഓർത്തു വെയ്ക്കൂ! കളിയിലൂടെ പഠിച്ചാൽ വളരെ എളുപ്പമാണ്!`,
            emotion: 'explaining',
            actionPrompt: 'Papa Manoj gives Faidan an encouraging high-five.',
          },
        ],
        keyConceptPopup: {
          english: `Key Concept: ${chapterTitle}`,
          malayalam: `പ്രധാന ആശയം: ${chapterTitle}`,
        },
      },
      {
        sceneNumber: 2,
        title: 'Big Brother Eadrick’s Super Explanation',
        malayalamTitle: 'ചേട്ടൻ ഏദ്രിക്കിന്റെ സൂപ്പർ വിവരണം',
        backdrop: 'classroom',
        visualStageEmoji: '🌟🚀🎯🏆',
        dialogues: [
          {
            speakerId: 'eadrick',
            englishText: `Hey Faidan, let me show you my secret trick! When I studied this in class, I imagined ${termsString} working together like a team!`,
            malayalamText: `ഫൈദാൻ, ഞാൻ നിനക്ക് ഒരു സൂത്രം പറഞ്ഞുതരാം! ഈ പാഠത്തിലെ ആശയങ്ങൾ ഒരു ടീമിനെപ്പോലെ ഒന്നിച്ചു പ്രവർത്തിക്കുകയാണെന്ന് ഓർക്കുക!`,
            emotion: 'excited',
            actionPrompt: 'Eadrick demonstrates the concept with joyful gestures.',
          },
          {
            speakerId: 'faidan',
            englishText: `Yay! Now I understand completely, brother Eadrick! Learning together as a family is so much fun!`,
            malayalamText: `യേയ്! ഇപ്പോൾ എനിക്ക് പൂർണ്ണമായും മനസ്സിലായി ചേട്ടാ! കുടുംബത്തോടൊപ്പം പഠിക്കുന്നത് എത്ര നല്ല രസമാണ്!`,
            emotion: 'celebrating',
            actionPrompt: 'Faidan claps enthusiastically.',
          },
          {
            speakerId: 'father',
            englishText: `That’s my champions! Papa Manoj and Mummy Tessy are so proud of both of you!`,
            malayalamText: `മിടുക്കന്മാർ! പപ്പയ്ക്കും മമ്മിക്കും നിങ്ങളെ രണ്ടുപേരെയും ഓർത്ത് വലിയ അഭിമാനമുണ്ട്!`,
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: `Great job mastering: ${chapterTitle}!`,
          malayalam: `${chapterTitle} പാഠം മനോഹരമായി പൂർത്തിയാക്കി!`,
        },
      },
    ],
  };
}
