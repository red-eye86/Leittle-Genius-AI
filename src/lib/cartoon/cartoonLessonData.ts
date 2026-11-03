export interface CartoonCharacter {
  id: 'father' | 'mother' | 'eadrick' | 'faidan' | 'grandmother';
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
  grandmother: {
    id: 'grandmother',
    name: 'Grandma Lilly Joseph',
    malayalamName: 'മുത്തശ്ശി ലില്ലി ജോസഫ്',
    role: 'Loving Grandmother & Storyteller',
    malayalamRole: 'സ്നേഹനിധിയായ മുത്തശ്ശി (അമ്മാച്ചി)',
    avatarUrl: '/characters/grandmother_lilly.jpg',
    voicePitch: 1.12,
    voiceRate: 0.88,
    badgeColor: 'bg-purple-700 text-white',
    borderColor: 'border-purple-500',
    tagline: 'Tells the sweetest bedtime stories, rhymes, and gives warm hugs! 👵❤️',
  },
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
    voicePitch: 1.5,
    voiceRate: 0.9,
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
  | 'nature'
  | 'jungle'
  | 'ocean'
  | 'farm'
  | 'city'
  | 'sky'
  | 'night'
  | 'market'
  | 'school'
  | 'museum';

export interface CartoonDialogue {
  /** Family member id (father, mother, eadrick, faidan, grandmother) or a guest character id from episode.cast */
  speakerId: string;
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
  /** Floating animated props drifting across the stage */
  props?: string[];
  dialogues: CartoonDialogue[];
  keyConceptPopup?: {
    english: string;
    malayalam: string;
  };
}

/** Unique per-episode guest star (animal / object / creature) */
export interface GuestCharacter {
  id: string;
  name: string;
  malayalamName: string;
  role: string;
  malayalamRole: string;
  emoji: string;
  /** Voice type key sent to the TTS engine (voice_creature, voice_giant, voice_bird, voice_robot, voice_wise) */
  voiceKey: string;
  voicePitch: number;
  voiceRate: number;
  bgGradient: string;
  badgeColor: string;
  borderColor: string;
  tagline: string;
}

export interface CartoonEpisode {
  chapterId: string;
  title: string;
  malayalamTitle: string;
  subjectTitle: string;
  bannerGradient: string;
  scenes: CartoonScene[];
  /** Unique guest stars of this episode */
  cast?: GuestCharacter[];
  themeEmoji?: string;
  worldName?: { en: string; ml: string };
  moral?: { en: string; ml: string };
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
    themeEmoji: '🍪👃',
    worldName: { en: 'Senses Wonderland', ml: 'പഞ്ചേന്ദ്രിയ ലോകം' },
    moral: { en: 'Our 5 senses help us explore and enjoy God’s beautiful world every day!', ml: 'നമ്മുടെ 5 പഞ്ചേന്ദ്രിയങ്ങളാണ് ലോകത്തെ അനുഭവിക്കാൻ സഹായിക്കുന്നത്!' },
    cast: [
      {
        id: 'crumbly_cookie',
        name: 'Crumbly the Choco Cookie',
        malayalamName: 'ക്രംബ്ലി ചോക്കോ ബിസ്ക്കറ്റ്',
        role: 'Warm & Fragrant Cookie Buddy',
        malayalamRole: 'നല്ല മണമുള്ള ചോക്കോ ബിസ്ക്കറ്റ്',
        emoji: '🍪',
        voiceKey: 'voice_creature',
        voicePitch: 1.35,
        voiceRate: 1.05,
        bgGradient: 'from-amber-400 to-yellow-600',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-500',
        tagline: 'Warm out of Mummy’s oven, ready to test your nose and tongue!',
      },
      {
        id: 'prof_hootie',
        name: 'Professor Hootie the Wise Owl',
        malayalamName: 'ഹുട്ടി ബുദ്ധിമാൻ മൂങ്ങ',
        role: 'Sense Detective & Guide',
        malayalamRole: 'ഇന്ദ്രിയ ഗവേഷക മൂങ്ങ',
        emoji: '🦉',
        voiceKey: 'voice_wise',
        voicePitch: 0.85,
        voiceRate: 0.95,
        bgGradient: 'from-purple-500 to-indigo-600',
        badgeColor: 'bg-purple-600 text-white',
        borderColor: 'border-purple-400',
        tagline: 'Hoo-hoo! I inspect everything with super sharp eyes and ears!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Mummy’s Kitchen Surprise & Crumbly Pops In!',
        malayalamTitle: 'മമ്മിയുടെ അടുക്കളയിലെ സർപ്രൈസ്',
        backdrop: 'kitchen',
        visualStageEmoji: '🍪👃💨✨',
        props: ['🍪', '👃', '✨', '🥛'],
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Sniff sniff! Mmm... Mummy Tessy, what is that heavenly sweet smell coming from the oven?',
            malayalamText: 'മമ്മി ടെസ്സി! നല്ലൊരു മധുര മണം അടുക്കളയിൽ നിന്ന് വരുന്നുണ്ടല്ലോ! ഇതെന്താണ്?',
            emotion: 'excited',
            actionPrompt: 'Faidan follows the delicious aroma into the kitchen.',
          },
          {
            speakerId: 'crumbly_cookie',
            englishText: 'Hooray! It is ME, Crumbly the warm Choco Cookie! Your nose smelled my sweet chocolate chips!',
            malayalamText: 'ഹൂറേ! ഇതെന്റെ മണമാണ്, ക്രംബ്ലി ചോക്കോ ബിസ്ക്കറ്റ്! നിങ്ങളുടെ മൂക്ക് എന്റെ മധുരമണം പിടിച്ചെടുത്തു!',
            emotion: 'excited',
            actionPrompt: 'Crumbly hops on the baking tray with a cheerful dance.',
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
        title: 'Papa Manoj & Professor Hootie Reveal the 5 Senses',
        malayalamTitle: 'പപ്പ മനോജും ഹുട്ടിയും 5 ഇന്ദ്രിയങ്ങളെ പറഞ്ഞുതരുന്നു',
        backdrop: 'living_room',
        visualStageEmoji: '👀👂👃👅🖐️',
        props: ['👀', '👂', '👅', '🖐️'],
        dialogues: [
          {
            speakerId: 'prof_hootie',
            englishText: 'Hoo-hoo! Children, did you notice? Your body just used all five of your superhero sense organs!',
            malayalamText: 'ഹൂ-ഹൂ! കുട്ടികളേ, നിങ്ങൾ ശ്രദ്ധിച്ചോ? നിങ്ങളുടെ ശരീരത്തിലെ 5 സൂപ്പർ ഹീറോ പഞ്ചേന്ദ്രിയങ്ങളും ഇപ്പോൾ പ്രവർത്തിച്ചു!',
            emotion: 'explaining',
            actionPrompt: 'Professor Hootie flaps his feathered wings and adjusts his glasses.',
          },
          {
            speakerId: 'father',
            englishText: 'Look at my little detectives! Eyes to SEE the round cookies 👀, Ears to HEAR the oven bell 👂, Nose to SMELL the aroma 👃!',
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
            speakerId: 'faidan',
            englishText: 'Crunch crunch! My tongue says this cookie is super sweet! 5 Senses are the best superheroes ever!',
            malayalamText: 'ക്രിസ്പി ബിസ്ക്കറ്റ് നല്ല മധുരം! 5 പഞ്ചേന്ദ്രിയങ്ങൾ നമ്മുടെ ശരീരത്തിലെ സൂപ്പർ ഹീറോകളാണ്!',
            emotion: 'celebrating',
            actionPrompt: 'Faidan bites into the warm cookie with pure delight.',
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
    themeEmoji: '🍎➕',
    worldName: { en: 'The Number Funfair', ml: 'സംഖ്യാ മേള' },
    moral: { en: 'Addition brings things together to make them bigger and happier!', ml: 'കൂട്ടൽ വസ്തുക്കളെ ഒന്നിച്ചു ചേർത്ത് വലുതാക്കുന്നു!' },
    cast: [
      {
        id: 'coco_parrot',
        name: 'Coco the Counting Parrot',
        malayalamName: 'കൊക്കോ സംഖ്യാ തത്ത',
        role: 'Funfair Number Guide',
        malayalamRole: 'കളിയിലൂടെ എണ്ണൽ പഠിപ്പിക്കുന്ന തത്ത',
        emoji: '🦜',
        voiceKey: 'voice_bird',
        voicePitch: 1.45,
        voiceRate: 1.1,
        bgGradient: 'from-emerald-400 to-teal-600',
        badgeColor: 'bg-emerald-600 text-white',
        borderColor: 'border-emerald-400',
        tagline: 'Squawk! Count with me: 1, 2, 3, 4, 5... Plus 2 makes SEVEN!',
      },
      {
        id: 'chalky_stick',
        name: 'Chalky the Magic Chalk',
        malayalamName: 'ചോക്കി മാന്ത്രിക ചോക്ക്',
        role: 'Board Writing Buddy',
        malayalamRole: 'ബോർഡിൽ വരയ്ക്കുന്ന കൂട്ടുകാരൻ',
        emoji: '🪄',
        voiceKey: 'voice_creature',
        voicePitch: 1.25,
        voiceRate: 1.0,
        bgGradient: 'from-amber-400 to-orange-500',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Watch me write glowing numbers right on the slate board!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Apples from the Market & Coco’s Arrival',
        malayalamTitle: 'മാർക്കറ്റിൽ നിന്ന് കൊണ്ടുവന്ന ആപ്പിളുകൾ',
        backdrop: 'living_room',
        visualStageEmoji: '🍎🍎🍎🍎🍎 + 🍏🍏 = 7',
        props: ['🍎', '🍏', '🦜', '🧺'],
        dialogues: [
          {
            speakerId: 'father',
            englishText: 'Hello boys! Look what I brought from the fruit market — sweet juicy red apples!',
            malayalamText: 'മക്കളെ, നോക്കൂ പപ്പ മാർക്കറ്റിൽ നിന്ന് നല്ല ചുവന്ന ആപ്പിളുകൾ കൊണ്ടുവന്നിട്ടുണ്ട്!',
            emotion: 'happy',
            actionPrompt: 'Papa Manoj places a basket with 5 red apples on the table.',
          },
          {
            speakerId: 'coco_parrot',
            englishText: 'Squawk squawk! Count them with me, Faidan! 1... 2... 3... 4... FIVE red apples in the basket!',
            malayalamText: 'കൊക്കോ! ഫൈദാൻ എന്നോടൊപ്പം എണ്ണൂ: ഒന്ന്, രണ്ട്, മൂന്ന്, നാല്, അഞ്ച്! 5 ചുവന്ന ആപ്പിളുകൾ!',
            emotion: 'excited',
            actionPrompt: 'Coco hops from apple to apple fluttering colorful feathers.',
          },
          {
            speakerId: 'faidan',
            englishText: 'Five red apples, Coco! And Mummy is bringing more from our garden!',
            malayalamText: 'അഞ്ച് ചുവന്ന ആപ്പിളുകൾ! മമ്മി തോട്ടത്തിൽ നിന്ന് കൂടുതൽ ആപ്പിളുകൾ കൊണ്ടുവരുന്നുണ്ട്!',
            emotion: 'excited',
          },
          {
            speakerId: 'mother',
            englishText: 'Here are 2 fresh green apples! Let’s add them together: 5 red apples PLUS 2 green apples!',
            malayalamText: 'ഇതാ 2 പച്ച ആപ്പിളുകൾ! നമുക്കിത് ഒരുമിച്ച് കൂട്ടാം: 5 ചുവന്ന ആപ്പിളും 2 പച്ച ആപ്പിളും!',
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
        title: 'Chalky & Eadrick Solve 5 + 2 = 7 on the Blackboard',
        malayalamTitle: 'ചോക്കിയും ഏദ്രിക്കും ബോർഡിൽ 5 + 2 = 7 എഴുതുന്നു',
        backdrop: 'classroom',
        visualStageEmoji: '🖐️ + ✌️ = 7 ⭐',
        props: ['🪄', '7️⃣', '⭐', '✨'],
        dialogues: [
          {
            speakerId: 'chalky_stick',
            englishText: 'Swish swish! Look at your math book cover! The girl wrote: 5 + 2 = 7! Let me write it on our board!',
            malayalamText: 'നിന്റെ മാത്സ് ബുക്കിന്റെ പുറംചട്ട കണ്ടോ? പെൺകുട്ടി എഴുതിയത് 5 + 2 = 7 എന്നാണ്! നമുക്കിത് ബോർഡിൽ എഴുതാം!',
            emotion: 'excited',
            actionPrompt: 'Chalky leaves a glowing sparkling white trail on the slate board.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Keep 5 in your head, Faidan! Now raise 2 fingers: six... SEVEN! 5 + 2 = 7!',
            malayalamText: 'മനസ്സിൽ 5 വെയ്ക്കൂ ഫൈദാൻ! ഇനി 2 വിരലുകൾ എണ്ണൂ: ആറ്... ഏഴ്! ആകെ 7!',
            emotion: 'explaining',
            actionPrompt: 'Eadrick demonstrates with his fingers with a bright smile.',
          },
          {
            speakerId: 'faidan',
            englishText: 'Yay! 5 apples plus 2 apples makes 7 apples! Addition is super fun with Coco and Chalky!',
            malayalamText: 'യേയ്! 5 ഉം 2 ഉം കൂട്ടിയാൽ 7! കൂട്ടൽ പഠിക്കാൻ എത്ര നല്ല രസമാണ്!',
            emotion: 'celebrating',
            actionPrompt: 'Faidan dances with joy alongside Papa Manoj and Mummy Tessy.',
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
    themeEmoji: '🌺🐌',
    worldName: { en: 'Changathi Garden Realm', ml: 'ചങ്ങാതി പൂന്തോട്ടം' },
    moral: { en: 'All little creatures in nature live in harmony as best friends!', ml: 'പ്രകൃതിയിലെ എല്ലാ കൊച്ചു ജീവികളും നമ്മുടെ നല്ല ചങ്ങാതിമാരാണ്!' },
    cast: [
      {
        id: 'thumbi',
        name: 'Thumbi the Dragonfly',
        malayalamName: 'പാറിപ്പറക്കുന്ന തുമ്പി',
        role: 'Flying Nature Friend',
        malayalamRole: 'ആകാശത്ത് പാറിപ്പറക്കുന്ന ചങ്ങാതി',
        emoji: '蜻蛉',
        voiceKey: 'voice_bird',
        voicePitch: 1.5,
        voiceRate: 1.1,
        bgGradient: 'from-sky-400 to-cyan-600',
        badgeColor: 'bg-sky-600 text-white',
        borderColor: 'border-sky-400',
        tagline: 'Hovering over flowers with shiny transparent wings! 🌸',
      },
      {
        id: 'och',
        name: 'Och the Gentle Snail',
        malayalamName: 'കൊച്ചു കൂടുള്ള ഒച്ച്',
        role: 'Slow & Steady Garden Friend',
        malayalamRole: 'കൂടുമായി മെല്ലെ നടക്കുന്ന ഒച്ച്',
        emoji: '🐌',
        voiceKey: 'voice_creature',
        voicePitch: 1.2,
        voiceRate: 0.85,
        bgGradient: 'from-amber-400 to-yellow-600',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Carrying my round shell house wherever I slide along the green leaves!',
      },
      {
        id: 'urumbu',
        name: 'Urumbu the Busy Worker Ant',
        malayalamName: 'ചുറുചുറുക്കുള്ള ഉറുമ്പ്',
        role: 'Hardworking Team Champion',
        malayalamRole: 'കൂട്ടമായി ജോലിചെയ്യുന്ന കൊച്ചു മിടുക്കൻ',
        emoji: '🐜',
        voiceKey: 'voice_creature',
        voicePitch: 1.4,
        voiceRate: 1.1,
        bgGradient: 'from-stone-600 to-slate-800',
        badgeColor: 'bg-slate-700 text-white',
        borderColor: 'border-slate-500',
        tagline: 'One, two, marching in line with sweet grains of sugar!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Meeting the Cover Characters in the Backyard',
        malayalamTitle: 'പുസ്തകത്തിലെ കൂട്ടുകാരെ തോട്ടത്തിൽ കണ്ടുമുട്ടുന്നു',
        backdrop: 'garden',
        visualStageEmoji: '🌺蜻蛉🐌🍄🐜',
        props: ['🌸', '🐌', '🍄', '🌿'],
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Look Mummy Tessy! The dragonfly from my Changathi book cover just landed on our hibiscus flower!',
            malayalamText: 'മമ്മി ടെസ്സി നോക്കൂ! എന്റെ ചങ്ങാതി പുസ്തകത്തിന്റെ പുറംചട്ടയിലെ തുമ്പി ചെമ്പരത്തിപ്പൂവിൽ വന്നിരിക്കുന്നു!',
            emotion: 'excited',
            actionPrompt: 'Faidan kneels down happily on the lush green grass.',
          },
          {
            speakerId: 'thumbi',
            englishText: 'Hello little Faidan! I am Thumbi! In Malayalam you say: തു - തുമ്പി (Thumbi)! Watch me hover in the air!',
            malayalamText: 'ഹലോ കൊച്ചു ഫൈദാൻ! ഞാനാണ് തുമ്പി! എന്റെ ചിറകുകൾ നോക്കൂ, ഞാൻ പൂന്തോട്ടത്തിൽ പാറിനടക്കുന്നു!',
            emotion: 'happy',
            actionPrompt: 'Thumbi performs a graceful mid-air spin.',
          },
          {
            speakerId: 'och',
            englishText: 'And look down here on the soft leaf! I am Och the snail — ഒ - ഒച്ച്! I carry my cute little home on my back!',
            malayalamText: 'ഇലയുടെ മുകളിലേക്ക് നോക്കൂ! ഞാനാണ് ഒച്ച്! ഒ - ഒച്ച്! ഞാൻ പുറത്ത് കൊച്ചു കൂടുമായാണ് നടക്കുന്നത്!',
            emotion: 'happy',
            actionPrompt: 'Och peeks out his cute tentacles from the spiral shell.',
          },
          {
            speakerId: 'grandmother',
            englishText: 'How sweet! In our Malayalam songs, we say: "തുമ്പീ തുമ്പീ വാ വാ, തുമ്പപ്പൂവിൽ തേനുണ്ടോ!" Nature is full of songs!',
            malayalamText: 'എത്ര മനോഹരം! "തുമ്പീ തുമ്പീ വാ വാ, തുമ്പപ്പൂവിൽ തേനുണ്ടോ!" എന്ന കുട്ടിപ്പാട്ട് ഓർമ്മയുണ്ടോ ഫൈദാൻ മോനേ?',
            emotion: 'celebrating',
            actionPrompt: 'Grandma Lilly claps and sings the classic rhyme warmly.',
          },
        ],
        keyConceptPopup: {
          english: 'തുമ്പി = Dragonfly, ഒച്ച് = Snail, കൂൺ = Mushroom, പൂമ്പാറ്റ = Butterfly!',
          malayalam: 'തുമ്പി, ഒച്ച്, കൂൺ, പൂമ്പാറ്റ, തേനീച്ച — പ്രകൃതിയിലെ കൊച്ചു കൂട്ടുകാർ!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Urumbu the Ant & Teamwork in Nature',
        malayalamTitle: 'ഉറുമ്പും ഒരുമയോടെയുള്ള ജോലിയും',
        backdrop: 'garden',
        visualStageEmoji: '🐜🐜🐜🍯🌞',
        props: ['🐜', '🍯', '🍂', '✨'],
        dialogues: [
          {
            speakerId: 'urumbu',
            englishText: 'March march! I am Urumbu — ഉ - ഉറുമ്പ്! All my ant brothers walk in a straight line to collect food together!',
            malayalamText: 'ഞാനാണ് ഉറുമ്പ്! ഉ - ഉറുമ്പ്! ഞങ്ങൾ കൂട്ടത്തോടെ ഒരു വരിയായി നടന്ന് ആഹാരം ശേഖരിക്കുന്നു!',
            emotion: 'excited',
            actionPrompt: 'Urumbu salutes with tiny antennae.',
          },
          {
            speakerId: 'father',
            englishText: 'Look at how disciplined Urumbu is! Just like our Changathi book teaches, nature teaches us unity and friendship!',
            malayalamText: 'ഉറുമ്പുകളുടെ അച്ചടക്കം നോക്കൂ! ചങ്ങാതി പുസ്തകം നമ്മെ പഠിപ്പിക്കുന്നതുപോലെ പ്രകൃതിയിൽ എല്ലാവരും സ്നേഹത്തോടെ ഒന്നിക്കുന്നു!',
            emotion: 'explaining',
          },
          {
            speakerId: 'eadrick',
            englishText: 'തുമ്പി (Dragonfly), ഒച്ച് (Snail), ഉറുമ്പ് (Ant), തേനീച്ച (Bee)! Faidan and I will protect all our garden friends!',
            malayalamText: 'തുമ്പി, ഒച്ച്, ഉറുമ്പ്, തേനീച്ച! ഞാനും ഫൈദാനും നമ്മുടെ പ്രകൃതിയിലെ എല്ലാ കൊച്ചു കൂട്ടുകാരെയും സ്നേഹിക്കും!',
            emotion: 'celebrating',
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
  // 4. ANIMALS, BABIES & HOMES (KG2 GA) — CH 5
  // =========================================================================
  'chap-ukg-evs-5': {
    chapterId: 'chap-ukg-evs-5',
    title: 'The Great Jungle Safari: Animals, Babies & Homes!',
    malayalamTitle: 'മൃഗങ്ങളും കുഞ്ഞുങ്ങളും അവരുടെ വീടുകളും!',
    subjectTitle: 'General Awareness (KG2 GA) — Chapter 5',
    bannerGradient: 'from-emerald-600 via-green-600 to-amber-700',
    themeEmoji: '🦁🌴',
    worldName: { en: 'Sunny Savanna Wildlife Park', ml: 'സാവന്ന വന്യജീവി സങ്കേതം' },
    moral: { en: 'Animals love their babies and homes just like our human family loves each other!', ml: 'മൃഗങ്ങളും അവരുടെ കുഞ്ഞുങ്ങളെയും വീടുകളെയും നമ്മളെപ്പോലെ സ്നേഹിക്കുന്നു!' },
    cast: [
      {
        id: 'leo_cub',
        name: 'Leo the Lion Cub',
        malayalamName: 'സിംഹക്കുട്ടി ലിയോ',
        role: 'Savanna Explorer',
        malayalamRole: 'കാട്ടിലെ രാജകുമാരൻ സിംഹക്കുട്ടി',
        emoji: '🦁',
        voiceKey: 'voice_creature',
        voicePitch: 1.3,
        voiceRate: 1.05,
        bgGradient: 'from-amber-400 to-orange-600',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Roar! I am Leo the Cub, living in a cozy rock Den with my Lion parents!',
      },
      {
        id: 'penny_hen',
        name: 'Penny Hen & Chicks',
        malayalamName: 'കോഴിയമ്മ പെന്നി',
        role: 'Farm Co-op Mother',
        malayalamRole: 'കൂട്ടിൽ കുഞ്ഞുങ്ങളെ പോറ്റുന്ന കോഴിയമ്മ',
        emoji: '🐔',
        voiceKey: 'voice_bird',
        voicePitch: 1.4,
        voiceRate: 1.05,
        bgGradient: 'from-rose-400 to-red-600',
        badgeColor: 'bg-rose-600 text-white',
        borderColor: 'border-rose-400',
        tagline: 'Cluck cluck! My baby is a Chick, and our safe warm house is a Coop!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Meeting Leo the Cub in the Golden Den',
        malayalamTitle: 'ഗുഹയിലെ സിംഹക്കുട്ടിയെ കാണുന്നു',
        backdrop: 'jungle',
        visualStageEmoji: '🦁🐾🌴☀️',
        props: ['🦁', '🌴', '🐾', '👑'],
        dialogues: [
          {
            speakerId: 'faidan',
            englishText: 'Papa Manoj, look! A golden furry kitten is peeking out from the rocky cave!',
            malayalamText: 'പപ്പാ നോക്കൂ! ഗുഹയുടെ ഉള്ളിൽ നിന്ന് ഒരു സ്വർണ്ണ രോമമുള്ള പൂച്ചക്കുഞ്ഞ് നോക്കുന്നു!',
            emotion: 'excited',
            actionPrompt: 'Faidan points with wide amazed eyes.',
          },
          {
            speakerId: 'leo_cub',
            englishText: 'Roar! I am not a kitten, little Faidan! I am Leo the Lion CUB! A baby lion is called a Cub!',
            malayalamText: 'റോർ! ഞാൻ പൂച്ചക്കുഞ്ഞല്ല, സിംഹക്കുട്ടിയാണ് (Cub)! എന്റെ വീടാണ് ഗുഹ (Den)!',
            emotion: 'excited',
            actionPrompt: 'Leo shakes his golden fluffy mane proudly.',
          },
          {
            speakerId: 'father',
            englishText: 'That’s right, Leo! Lions live in a DEN, Dogs live in a KENNEL, and Cows live in a SHED!',
            malayalamText: 'അതെ ലിയോ! സിംഹത്തിന്റെ വീടാണ് Den (ഗുഹ), പട്ടിയുടെ വീടാണ് Kennel, പശുവിന്റെ വീടാണ് Shed!',
            emotion: 'explaining',
          },
          {
            speakerId: 'mother',
            englishText: 'And baby animals have special names! Dog has a Puppy, Cat has a Kitten, and Cow has a Calf!',
            malayalamText: 'നായയുടെ കുഞ്ഞ് Puppy, പൂച്ചയുടെ കുഞ്ഞ് Kitten, പശുവിന്റെ കുഞ്ഞ് Calf!',
            emotion: 'happy',
          },
        ],
        keyConceptPopup: {
          english: 'Lion -> Cub (Den) | Dog -> Puppy (Kennel) | Cow -> Calf (Shed)!',
          malayalam: 'സിംഹം -> കുട്ടി (ഗുഹ) | പട്ടി -> നായ്ക്കുട്ടി | പശു -> കിടാാവ്!',
        },
      },
      {
        sceneNumber: 2,
        title: 'Penny Hen’s Cozy Coop and Bird Nests',
        malayalamTitle: 'പെന്നി കോഴിയുടെ കൂടും പക്ഷിക്കൂടുകളും',
        backdrop: 'farm',
        visualStageEmoji: '🐔🐣🌾🏡',
        props: ['🐔', '🐣', '🌾', '🥚'],
        dialogues: [
          {
            speakerId: 'penny_hen',
            englishText: 'Cluck cluck! Cheep cheep! Look at my sweet fluffy yellow Chicks! We sleep together in our warm COOP!',
            malayalamText: 'ക്ലക്ക് ക്ലക്ക്! നോക്കൂ എന്റെ കുഞ്ഞുങ്ങൾ Chicks (കോഴിക്കുഞ്ഞുങ്ങൾ)! ഞങ്ങൾ ഉറങ്ങുന്നത് Coop (കൂട്) ലാണ്!',
            emotion: 'happy',
            actionPrompt: 'Penny gathers three chirping chicks under her warm wings.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Birds build NESTS in tall green trees, and Honeybees build a HEXAGONAL HIVE! Every animal has a home!',
            malayalamText: 'പക്ഷികൾ മരത്തിൽ കൂടുണ്ടാക്കുന്നു (Nest), തേനീച്ചകൾ തേൻകൂടുണ്ടാക്കുന്നു (Hive)! എല്ലാവർക്കും സുരക്ഷിതമായ വീടുണ്ട്!',
            emotion: 'explaining',
          },
          {
            speakerId: 'faidan',
            englishText: 'Just like we have our happy home with Papa Manoj, Mummy Tessy, Grandma Lilly, and Brother Eadrick!',
            malayalamText: 'നമുക്ക് നമ്മുടെ മനോഹരമായ വീടുള്ളതുപോലെ മൃഗങ്ങൾക്കും സുരക്ഷിതമായ വീടുകളുണ്ട്!',
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: 'Hen -> Chick (Coop) | Bird -> Nest | Horse -> Stable | Bee -> Hive!',
          malayalam: 'കോഴി -> കുഞ്ഞ് (കൂട്) | പക്ഷി -> കൂട് | കുതിര -> ലായം | തേനീച്ച -> തേൻകൂട്!',
        },
      },
    ],
  },

  // =========================================================================
  // 5. MEANS OF TRANSPORT & VEHICLES (KG2 GA) — CH 7
  // =========================================================================
  'chap-ukg-evs-7': {
    chapterId: 'chap-ukg-evs-7',
    title: 'Zoom, Chug & Sail: The Magic Vehicles Adventure!',
    malayalamTitle: 'വാഹനങ്ങളും ഗതാഗത മാർഗ്ഗങ്ങളും!',
    subjectTitle: 'General Awareness (KG2 GA) — Chapter 7',
    bannerGradient: 'from-sky-500 via-blue-600 to-indigo-700',
    themeEmoji: '✈️🚂',
    worldName: { en: 'Grand Metro Transport World', ml: 'യാത്രാ നഗരം' },
    moral: { en: 'Vehicles connect people across land, water, and air — always follow traffic safety rules!', ml: 'കര, ജലം, ആകാശം എന്നീ വഴികളിലൂടെയുള്ള യാത്രകൾ എപ്പോഴും ട്രാഫിക് നിയമങ്ങൾ പാലിച്ചു വേണം!' },
    cast: [
      {
        id: 'zoomy_jet',
        name: 'Zoomy the Jet Plane',
        malayalamName: 'സൂപ്പർ വിമാനം സൂമി',
        role: 'Sky Transport Champion',
        malayalamRole: 'ആകാശത്തെ വേഗതയേറിയ ജെറ്റ് വിമാനം',
        emoji: '✈️',
        voiceKey: 'voice_creature',
        voicePitch: 1.35,
        voiceRate: 1.1,
        bgGradient: 'from-sky-400 to-blue-600',
        badgeColor: 'bg-sky-600 text-white',
        borderColor: 'border-sky-400',
        tagline: 'Whoooosh! I zoom above white puffy clouds from country to country!',
      },
      {
        id: 'chuggy_train',
        name: 'Chuggy the Steam Train',
        malayalamName: 'ചൂളംവിളി ട്രെയിൻ ചുഗ്ഗി',
        role: 'Land Track Champion',
        malayalamRole: 'റെയിൽ പാളത്തിലൂടെ ഓടുന്ന ട്രെയിൻ',
        emoji: '🚂',
        voiceKey: 'voice_giant',
        voicePitch: 0.75,
        voiceRate: 0.95,
        bgGradient: 'from-amber-600 to-red-700',
        badgeColor: 'bg-red-700 text-white',
        borderColor: 'border-red-500',
        tagline: 'Choo-choo! Chug-chug! Running on steel rails carrying hundreds of happy travelers!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Land, Water & Air: The 3 Travel Highways',
        malayalamTitle: 'കര, ജലം, ആകാശം: മൂന്ന് യാത്രാ വഴികൾ',
        backdrop: 'sky',
        visualStageEmoji: '🚗🚢✈️🚦',
        props: ['✈️', '🚗', '🚢', '🚦'],
        dialogues: [
          {
            speakerId: 'zoomy_jet',
            englishText: 'Whooosh! Greetings from up in the sky, Faidan and Eadrick! I am Zoomy the Airplane — AIR TRANSPORT!',
            malayalamText: 'ആകാശത്തുനിന്ന് സ്വാഗതം! ഞാനാണ് സൂമി വിമാനം! ആകാശ മാർഗ്ഗത്തിലൂടെയുള്ള അതിവേഗ യാത്ര!',
            emotion: 'excited',
            actionPrompt: 'Zoomy glides gracefully across a vivid blue sky.',
          },
          {
            speakerId: 'father',
            englishText: 'Vehicles travel in 3 ways: On LAND like cars and buses, on WATER like ships and boats, and in the AIR like planes and helicopters!',
            malayalamText: '3 യാത്രാ മാർഗ്ഗങ്ങൾ: കരയിലൂടെ (ബസ്, കാർ), വെള്ളത്തിലൂടെ (കപ്പൽ, ബോട്ട്), ആകാശത്തിലൂടെ (വിമാനം, ഹെലികോപ്റ്റർ)!',
            emotion: 'explaining',
          },
          {
            speakerId: 'chuggy_train',
            englishText: 'Choo choo! Chuggy the Train on the railway tracks! Look at the Traffic Light: Red says STOP, Yellow says WAIT, Green says GO!',
            malayalamText: 'ചൂ-ചൂ! ട്രാഫിക് സിഗ്നൽ ശ്രദ്ധിക്കൂ: ചുവപ്പ് എന്നാൽ STOP, മഞ്ഞ എന്നാൽ WAIT, പച്ച എന്നാൽ GO!',
            emotion: 'celebrating',
            actionPrompt: 'Chuggy puffs playful steam clouds that turn into traffic colors.',
          },
          {
            speakerId: 'mother',
            englishText: 'Always cross the road only on the ZEBRA CROSSING, holding Papa’s or Mummy’s hand safely!',
            malayalamText: 'റോഡ് മുറിച്ചുകടക്കുമ്പോൾ എപ്പോഴും സീബ്ര ലൈനിലൂടെ മുതിർന്നവരുടെ കൈപിടിച്ച് നടക്കുക!',
            emotion: 'happy',
          },
        ],
        keyConceptPopup: {
          english: '3 Modes: Land, Water, Air! Red = Stop, Yellow = Wait, Green = Go!',
          malayalam: 'കര, ജലം, ആകാശം! ചുവപ്പ് = നിൽക്കുക, മഞ്ഞ = കാക്കുക, പച്ച = പോകുക!',
        },
      },
    ],
  },

  // =========================================================================
  // 6. CLASS 4 SCIENCE — CH 2: TEETH & DIGESTIVE SYSTEM
  // =========================================================================
  'chap-c4-sci-2': {
    chapterId: 'chap-c4-sci-2',
    title: 'The Secret Journey: My Teeth & The Digestive Factory!',
    malayalamTitle: 'പല്ലുകളും അത്ഭുതകരമായ ദഹന വ്യവസ്ഥയും!',
    subjectTitle: 'ICSE Oxford Science (Class 4) — Chapter 2',
    bannerGradient: 'from-teal-500 via-emerald-600 to-cyan-700',
    themeEmoji: '🦷🍎',
    worldName: { en: 'The Human Body Bio-Lab', ml: 'ശരീര ശാസ്ത്ര ലബോറട്ടറി' },
    moral: { en: 'Chew your food properly and brush twice a day to protect your precious enamel!', ml: 'ഭക്ഷണം നന്നായി ചവച്ചരച്ച് കഴിക്കുക, ദിവസവും രണ്ടുനേരം പല്ല് തേയ്ക്കുക!' },
    cast: [
      {
        id: 'dr_molar',
        name: 'Dr. Molar the Tooth Hero',
        malayalamName: 'ഡോക്ടർ മോലാർ പല്ല്',
        role: 'Chief Enamel Defender',
        malayalamRole: 'പല്ലുകളുടെ സംരക്ഷകൻ ഡോക്ടർ മോലാർ',
        emoji: '🦷',
        voiceKey: 'voice_creature',
        voicePitch: 1.25,
        voiceRate: 1.0,
        bgGradient: 'from-cyan-400 to-blue-600',
        badgeColor: 'bg-cyan-600 text-white',
        borderColor: 'border-cyan-400',
        tagline: 'Sparkling with hard Enamel! Incisors bite, Canines tear, and Molars grind food fine!',
      },
      {
        id: 'peppy_pepsin',
        name: 'Peppy the Stomach Enzyme',
        malayalamName: 'പെപ്പി ദഹന എൻസൈം',
        role: 'Nutrient Absorption Guide',
        malayalamRole: 'ദഹനത്തിന് സഹായിക്കുന്ന കൂട്ടുകാരൻ',
        emoji: '🧪',
        voiceKey: 'voice_creature',
        voicePitch: 1.35,
        voiceRate: 1.05,
        bgGradient: 'from-amber-400 to-orange-500',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Churning food in the stomach acid to release vitamins and energy!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The 4 Kinds of Teeth in Dr. Molar’s Clinic',
        malayalamTitle: '4 തരം പല്ലുകൾ: കട്ടിംഗ്, ടിയറിംഗ്, ഗ്രൈൻഡിംഗ്',
        backdrop: 'classroom',
        visualStageEmoji: '🦷🔬🍎😁',
        props: ['🦷', '🍎', '🔬', '✨'],
        dialogues: [
          {
            speakerId: 'eadrick',
            englishText: 'Papa Manoj, in my Class 4 Science book, it says an adult has 32 permanent teeth! How do they all work?',
            malayalamText: 'പപ്പാ, നാലാം ക്ലാസ്സിലെ സയൻസ് പാഠത്തിൽ പറയുന്നു മുതിർന്നവർക്ക് 32 സ്ഥിരദന്തങ്ങൾ ഉണ്ടെന്ന്! അവ എങ്ങനെ പ്രവർത്തിക്കുന്നു?',
            emotion: 'thinking',
            actionPrompt: 'Eadrick examines a tooth model with his magnifying glass.',
          },
          {
            speakerId: 'dr_molar',
            englishText: 'Smile big, Eadrick! We work as a specialized team! 8 Incisors for BITING, 4 Canines for TEARING, and 12 Molars for GRINDING!',
            malayalamText: 'ചിരിക്കൂ ഏദ്രിക്! ഞങ്ങൾ ഒരു ടീമാണ്! Incisors കടിച്ചു മുറിക്കുന്നു, Canines ചീന്തുന്നു, Molars ചവച്ചരയ്ക്കുന്നു!',
            emotion: 'excited',
            actionPrompt: 'Dr. Molar sparkles with clean white enamel.',
          },
          {
            speakerId: 'faidan',
            englishText: 'I have 20 milk teeth right now! Dr. Molar, do I need to brush every day?',
            malayalamText: 'എനിക്ക് ഇപ്പോൾ 20 പാൽപല്ലുകൾ ഉണ്ട്! ഞാൻ ദിവസവും രണ്ടുനേരം പല്ല് തേയ്ക്കണോ?',
            emotion: 'excited',
          },
          {
            speakerId: 'mother',
            englishText: 'Twice every single day, Faidan! Brush morning and night with fluoride paste to protect your hard enamel from plaque bacteria!',
            malayalamText: 'തീർച്ചയായും ഫൈദാൻ! രാവിലെയും രാത്രിയിലും പല്ല് തേച്ച് ഇനാമൽ സംരക്ഷിക്കണം!',
            emotion: 'happy',
          },
        ],
        keyConceptPopup: {
          english: '4 Teeth Types: Incisors (Bite), Canines (Tear), Premolars & Molars (Grind & Chew)!',
          malayalam: '4 തരം പല്ലുകൾ: ഇൻസിസേഴ്സ്, കനൈനുകൾ, പ്രീമോളാറുകൾ, മോളാറുകൾ!',
        },
      },
    ],
  },

  // =========================================================================
  // 7. CLASS 4 SCIENCE — CH 7: OUR SOLAR SYSTEM & EARTH
  // =========================================================================
  'chap-c4-sci-7': {
    chapterId: 'chap-c4-sci-7',
    title: 'Cosmic Voyage: The Solar System & Mother Earth!',
    malayalamTitle: 'സൗരയൂഥ യാത്രയും നമ്മുടെ ഭൂമിയും!',
    subjectTitle: 'ICSE Oxford Science (Class 4) — Chapter 7',
    bannerGradient: 'from-indigo-800 via-purple-700 to-slate-900',
    themeEmoji: '☀️🚀',
    worldName: { en: 'The Milky Way Cosmic Arena', ml: 'ആകാശഗംഗ സൗരയൂഥം' },
    moral: { en: 'Earth is our only precious blue home with air and liquid water — let us protect her always!', ml: 'ഭൂമിയാണ് ജീവനുള്ള നമ്മുടെ ഒരേയൊരു മാതൃഗ്രഹം — ഭൂമിയെ സംരക്ഷിക്കുക!' },
    cast: [
      {
        id: 'sunny_sun',
        name: 'Sunny the Giant Star',
        malayalamName: 'സൂര്യരാജൻ',
        role: 'Center of the Solar System',
        malayalamRole: 'സൗരയൂഥത്തിന്റെ കേന്ദ്രമായ നക്ഷത്രം',
        emoji: '☀️',
        voiceKey: 'voice_giant',
        voicePitch: 0.7,
        voiceRate: 0.95,
        bgGradient: 'from-amber-400 to-yellow-600',
        badgeColor: 'bg-amber-600 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Radiating golden light and gravity that holds all 8 planets in their elliptical orbits!',
      },
      {
        id: 'rocky_rover',
        name: 'Rocky the Mars Rover',
        malayalamName: 'റോക്കി ബഹിരാകാശ റോവർ',
        role: 'Robotic Space Explorer',
        malayalamRole: 'റോബോട്ടിക് ഗ്രഹ പര്യവേക്ഷകൻ',
        emoji: '🤖',
        voiceKey: 'voice_robot',
        voicePitch: 1.05,
        voiceRate: 1.0,
        bgGradient: 'from-red-500 to-slate-800',
        badgeColor: 'bg-red-600 text-white',
        borderColor: 'border-red-400',
        tagline: 'Beep boop! Scanning planetary craters, red sand dunes, and moons across deep space!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'The 8 Planets Orbiting King Sun',
        malayalamTitle: 'സൂര്യനെ വലംവെക്കുന്ന 8 ഗ്രഹങ്ങൾ',
        backdrop: 'space',
        visualStageEmoji: '☀️🪐🌍🚀',
        props: ['☀️', '🪐', '🌍', '🚀'],
        dialogues: [
          {
            speakerId: 'sunny_sun',
            englishText: 'Greetings little space explorers! I am the SUN, a giant glowing ball of hydrogen and helium at the center of your Solar System!',
            malayalamText: 'സ്വാഗതം കൊച്ചു ബഹിരാകാശ സഞ്ചാരികളേ! ഞാനാണ് സൂര്യൻ! സൗരയൂഥത്തിന്റെ കേന്ദ്രത്തിലെ തിളങ്ങുന്ന നക്ഷത്രം!',
            emotion: 'celebrating',
            actionPrompt: 'Sunny glows with warm solar flares and a friendly smile.',
          },
          {
            speakerId: 'rocky_rover',
            englishText: 'Beep-boop! Scanning planetary order from Sun outwards: Mercury, Venus, EARTH, Mars, Jupiter, Saturn, Uranus, Neptune!',
            malayalamText: 'ബീപ്-ബൂപ്! ഗ്രഹങ്ങളുടെ നിര: ബുധൻ, ശുക്രൻ, ഭൂമി, ചൊവ്വ, വ്യാഴം, ശനി, യുറാനസ്, നെപ്റ്റ്യൂൺ!',
            emotion: 'explaining',
            actionPrompt: 'Rocky activates his high-tech laser scanner.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Earth is the 3rd planet! It takes 24 hours to rotate once for Day and Night, and 365 days to revolve for 1 Year!',
            malayalamText: 'ഭൂമി മൂന്നാമത്തെ ഗ്രഹം! സ്വയം കറങ്ങാൻ 24 മണിക്കൂർ (രാവും പകലും), സൂര്യനെ വലംവെക്കാൻ 365 ദിവസം (ഒരു വർഷം)!',
            emotion: 'excited',
          },
          {
            speakerId: 'father',
            englishText: 'And Earth has an Atmosphere blanket of Nitrogen and Oxygen, plus liquid water oceans that support all life!',
            malayalamText: 'ഭൂമിയിലെ അന്തരീക്ഷവും ജീവജലവുമാണ് നമ്മെ ജീവിക്കാൻ സഹായിക്കുന്നത്!',
            emotion: 'explaining',
          },
        ],
        keyConceptPopup: {
          english: '8 Planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune! Rotation = Day/Night, Revolution = Year!',
          malayalam: '8 ഗ്രഹങ്ങൾ! ഭ്രമണം = രാപ്പകലുകൾ, പരിക്രമണം = ഒരു വർഷം!',
        },
      },
    ],
  },

  // =========================================================================
  // 8. CLASS 4 SOCIAL STUDIES — CH 1: STORY OF THE PAST & HISTORY
  // =========================================================================
  'chap-c4-soc-1': {
    chapterId: 'chap-c4-soc-1',
    title: 'Time Travelers: The Story of the Past & History Evidences!',
    malayalamTitle: 'ഭൂതകാല കഥകളും ചരിത്ര തെളിവുകളും!',
    subjectTitle: 'Candid ICSE Social Studies (Class 4) — Chapter 1',
    bannerGradient: 'from-amber-700 via-orange-800 to-stone-900',
    themeEmoji: '🏛️🐘',
    worldName: { en: 'Ancient Heritage Kingdom', ml: 'ചരിത്ര സ്മാരക കൊട്ടാരം' },
    moral: { en: 'Learning history helps us understand who we are and make wise choices for our tomorrow!', ml: 'ചരിത്രം പഠിക്കുന്നത് നമ്മുടെ സംസ്കാരത്തെ മനസ്സിലാക്കാനും നല്ല നാളെയെ വാർത്തെടുക്കാനും സഹായിക്കുന്നു!' },
    cast: [
      {
        id: 'raja_elephant',
        name: 'Raja the Royal Heritage Elephant',
        malayalamName: 'രാജകൊട്ടാര ആന രാജ',
        role: 'Keeper of Ancient Forts',
        malayalamRole: 'പഴയ കോട്ടകളുടെ കാവൽക്കാരൻ ആന',
        emoji: '🐘',
        voiceKey: 'voice_giant',
        voicePitch: 0.65,
        voiceRate: 0.9,
        bgGradient: 'from-stone-600 to-amber-800',
        badgeColor: 'bg-stone-700 text-white',
        borderColor: 'border-stone-500',
        tagline: 'Trumpet! I carry royal memories from ancient monuments, stone edicts, and golden coins!',
      },
      {
        id: 'prof_scroll',
        name: 'Professor Scroll the Historian Owl',
        malayalamName: 'ചരിത്ര താളിയോല മൂങ്ങ',
        role: 'Manuscript Archaeologist',
        malayalamRole: 'പഴയ താളിയോല ഗ്രന്ഥ സൂക്ഷിപ്പുകാരൻ',
        emoji: '📜',
        voiceKey: 'voice_wise',
        voicePitch: 0.85,
        voiceRate: 0.95,
        bgGradient: 'from-amber-500 to-yellow-700',
        badgeColor: 'bg-amber-700 text-white',
        borderColor: 'border-amber-400',
        tagline: 'Deciphering ancient palm-leaf manuscripts and excavated artifacts from long ago!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Archaeological vs Literary Sources',
        malayalamTitle: 'പുരാവസ്തു തെളിവുകളും ഗ്രന്ഥങ്ങളും',
        backdrop: 'museum',
        visualStageEmoji: '🏛️📜🪙🏺',
        props: ['🏛️', '📜', '🪙', '🏺'],
        dialogues: [
          {
            speakerId: 'raja_elephant',
            englishText: 'Trumpet! Welcome to the Royal Museum! History is not just dates in a book — it is the true story of how our ancestors lived!',
            malayalamText: 'സ്വാഗതം ചരിത്ര കൊട്ടാരത്തിലേക്ക്! നമ്മുടെ മുൻതലമുറകൾ എങ്ങനെ ജീവിച്ചു എന്ന് പറയുന്ന ജീവനുള്ള കഥയാണ് ചരിത്രം!',
            emotion: 'celebrating',
            actionPrompt: 'Raja raises his trunk in a royal salute.',
          },
          {
            speakerId: 'prof_scroll',
            englishText: 'We study history through 2 sources: Archaeological Sources like Monuments, Coins, and Pots; and Literary Sources like Palm-leaf books!',
            malayalamText: 'രണ്ടു തരം തെളിവുകൾ: സ്മാരകങ്ങൾ, നാണയങ്ങൾ, കൊത്തുപണികൾ (Archaeological) കൂടാതെ പുരാതന പുസ്തകങ്ങൾ (Literary)!',
            emotion: 'explaining',
            actionPrompt: 'Professor Scroll unrolls a golden parchment.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Historians divide Indian history into Ancient, Medieval, and Modern periods! It connects our roots!',
            malayalamText: 'ഇന്ത്യൻ ചരിത്രത്തെ പ്രാചീന (Ancient), മധ്യകാല (Medieval), ആധുനിക (Modern) കാലഘട്ടങ്ങളായി തിരിച്ചിരിക്കുന്നു!',
            emotion: 'excited',
          },
          {
            speakerId: 'father',
            englishText: 'Exactly, Eadrick! Just like our family tree connects Grandpa, Grandma, Papa, Mummy, and you boys, history connects all humanity!',
            malayalamText: 'നമ്മുടെ കുടുംബ ചരിത്രം നമ്മെ ബന്ധിപ്പിക്കുന്നതുപോലെ ലോക ചരിത്രം മനുഷ്യകുലത്തെ മുഴുവൻ ഒരുമിപ്പിക്കുന്നു!',
            emotion: 'happy',
          },
        ],
        keyConceptPopup: {
          english: 'History Sources: Archaeological (Monuments, Coins, Inscriptions) & Literary (Manuscripts, Books)!',
          malayalam: 'ചരിത്ര സ്രോതസ്സുകൾ: പുരാവസ്തു തെളിവുകൾ (സ്മാരകങ്ങൾ, നാണയങ്ങൾ) & സാഹിത്യ രേഖകൾ!',
        },
      },
    ],
  },

  // =========================================================================
  // 9. HINDI UDAN KHATOLA 4 — CH 3: THE MAGICAL SKY CHARIOT ADVENTURE
  // =========================================================================
  'chap-c4-hin-3': {
    chapterId: 'chap-c4-hin-3',
    title: 'उड़न खटोला की रोमांचक सैर: The Sky Chariot Flight!',
    malayalamTitle: 'ഉഡൻ ഖടോലയുടെ ആകാശയാത്ര!',
    subjectTitle: 'उड़न खटोला 4 (रचना सागर) — Chapter 3',
    bannerGradient: 'from-rose-500 via-pink-600 to-red-600',
    themeEmoji: '🛸✨',
    worldName: { en: 'The Flying Chariot Sky Realm', ml: 'ഉഡൻ ഖടോല ആകാശ ലോകം' },
    moral: { en: 'Imagination takes us across snowy mountains and sparkling rivers!', ml: 'ഭാവനയും അറിവും നമ്മെ ഹിമാലയ പർവ്വതങ്ങൾക്കും പുഴകൾക്കും മുകളിലൂടെ പറക്കാൻ സഹായിക്കുന്നു!' },
    cast: [
      {
        id: 'khatola_ufo',
        name: 'Khatola the Magical Flying Chariot',
        malayalamName: 'ഉഡൻ ഖടോല മാന്ത്രിക രഥം',
        role: 'Flying Sky Guide',
        malayalamRole: 'ആകാശയാത്രയിലെ മാന്ത്രിക വാഹനം',
        emoji: '🛸',
        voiceKey: 'voice_creature',
        voicePitch: 1.3,
        voiceRate: 1.05,
        bgGradient: 'from-rose-400 to-pink-600',
        badgeColor: 'bg-rose-600 text-white',
        borderColor: 'border-rose-400',
        tagline: 'सर्र-सर्र! बादलों के बीच उड़ते चलो, भारत के सुंदर दृश्य देखते चलो!',
      },
      {
        id: 'birbal_wise',
        name: 'Birbal the Clever Vizier',
        malayalamName: 'ബുദ്ധിമാനായ ബീർബൽ',
        role: 'Royal Wit and Problem Solver',
        malayalamRole: 'അക്ബറുടെ കൊട്ടാരത്തിലെ ബുദ്ധിമാൻ',
        emoji: '👑',
        voiceKey: 'voice_wise',
        voicePitch: 0.88,
        voiceRate: 0.95,
        bgGradient: 'from-amber-400 to-yellow-600',
        badgeColor: 'bg-amber-600 text-slate-900',
        borderColor: 'border-amber-400',
        tagline: 'बुद्धि और चतुराई से हर उलझन को सुलझाना ही सबसे बड़ी शक्ति है!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Flying High above Clouds with Khatola',
        malayalamTitle: 'ഉഡൻ ഖടോലയിലെ ആകാശയാത്ര',
        backdrop: 'sky',
        visualStageEmoji: '🛸☁️🏔️🇮🇳',
        props: ['🛸', '☁️', '🏔️', '✨'],
        dialogues: [
          {
            speakerId: 'khatola_ufo',
            englishText: 'Namaste Eadrick and Faidan! Hop aboard your book cover’s magical उड़न खटोला! Let’s glide over snowy Himalayan peaks!',
            malayalamText: 'നമസ്തേ ഏദ്രിക്, ഫൈദാൻ! നിങ്ങളുടെ ഹിന്ദി പുസ്തകത്തിലെ മാന്ത്രിക ഉഡൻ ഖടോലയിൽ കയറൂ! ഹിമാലയ കൊടുമുടികൾക്ക് മുകളിലൂടെ പറക്കാം!',
            emotion: 'excited',
            actionPrompt: 'Khatola spins with golden stardust sparkles across the blue sky.',
          },
          {
            speakerId: 'eadrick',
            englishText: 'Wah, look down Papa Manoj! I can see the holy Ganga river flowing like a silver ribbon through the green valleys!',
            malayalamText: 'പപ്പാ താഴോട്ട് നോക്കൂ! ഗംഗാനദി വെള്ളിനൂലുപോലെ പച്ചപ്പുനിറഞ്ഞ താഴ്‌വരകളിലൂടെ ഒഴുകുന്നത് കാണാം!',
            emotion: 'excited',
            actionPrompt: 'Eadrick leans over the side of the chariot with amazement.',
          },
          {
            speakerId: 'birbal_wise',
            englishText: 'Muskuraiye Eadrick! Hindi is the thread of unity that connects millions of hearts across our proud nation!',
            malayalamText: 'പുഞ്ചിരിക്കൂ ഏദ്രിക്! ഹിന്ദി ഭാഷ ഭാരതത്തിലെ കോടിക്കണക്കിന് ഹൃദയങ്ങളെ സ്നേഹത്തോടെ കോർത്തിണക്കുന്നു!',
            emotion: 'happy',
            actionPrompt: 'Birbal folds his hands with a warm royal greeting.',
          },
          {
            speakerId: 'father',
            englishText: 'Just like Rachna Sagar’s Udan Khatola teaches us, stories and poems make learning Hindi effortless and joyful!',
            malayalamText: 'ഉഡൻ ഖടോല പുസ്തകം നമ്മെ പഠിപ്പിക്കുന്നതുപോലെ കഥകളിലൂടെ ഹിന്ദി പഠിക്കുന്നത് എത്ര എളുപ്പമാണ്!',
            emotion: 'celebrating',
          },
        ],
        keyConceptPopup: {
          english: 'उड़न खटोला (Udan Khatola) = Magical Flying Chariot in Indian Folklore!',
          malayalam: 'ഉഡൻ ഖടോല എന്നാൽ ആകാശത്ത് പറക്കുന്ന മാന്ത്രിക രഥം!',
        },
      },
    ],
  },

  // =========================================================================
  // 10. GRAMMAR FEST 4 (HEADWORD) — CH 1: THE 4 KINDS OF SENTENCES
  // =========================================================================
  'chap-c4-eng-1': {
    chapterId: 'chap-c4-eng-1',
    title: 'Grammar Fest: The 4 Sentence Superheroes!',
    malayalamTitle: 'ഗ്രാമർ ഫെസ്റ്റ്: 4 തരം വാക്യങ്ങൾ!',
    subjectTitle: 'Grammar Fest 4 (Headword Publishing) — Chapter 1',
    bannerGradient: 'from-indigo-600 via-purple-600 to-blue-700',
    themeEmoji: '✍️🦘',
    worldName: { en: 'Grammar Fest Carnival', ml: 'ഗ്രാമർ ഫെസ്റ്റ് ഉത്സവം' },
    moral: { en: 'Expressing your thoughts with the right sentence structure opens doors everywhere!', ml: 'ശരിയായ വാക്യങ്ങളിലൂടെ ആശയങ്ങൾ പങ്കുവെക്കുമ്പോൾ എല്ലാവർക്കും അത് വ്യക്തമായി മനസ്സിലാകും!' },
    cast: [
      {
        id: 'prof_punctuation',
        name: 'Professor Punctuation',
        malayalamName: 'പ്രൊഫസർ ചിഹ്ന മാന്ത്രികൻ',
        role: 'Chief Punctuation Inspector',
        malayalamRole: 'വാക്യ ചിഹ്നങ്ങളുടെ സൂക്ഷിപ്പുകാരൻ',
        emoji: '✍️',
        voiceKey: 'voice_wise',
        voicePitch: 0.88,
        voiceRate: 0.95,
        bgGradient: 'from-purple-500 to-indigo-600',
        badgeColor: 'bg-purple-600 text-white',
        borderColor: 'border-purple-400',
        tagline: 'Always begin with a Capital Letter and end with the right punctuation sign!',
      },
      {
        id: 'wordy_kangaroo',
        name: 'Wordy the Grammar Kangaroo',
        malayalamName: 'വേർഡി ചാട്ടക്കാരൻ കംഗാരു',
        role: 'Sentence Trampoline Champion',
        malayalamRole: 'വാക്യങ്ങൾ നിർമ്മിച്ച് ചാടുന്ന കംഗാരു',
        emoji: '🦘',
        voiceKey: 'voice_creature',
        voicePitch: 1.35,
        voiceRate: 1.05,
        bgGradient: 'from-amber-400 to-orange-500',
        badgeColor: 'bg-amber-500 text-slate-900',
        borderColor: 'border-amber-400',
        tagline: 'Boing boing! Bouncing on the Grammar Fest trampoline with 4 kinds of sentences!',
      },
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: 'Bouncing on the Trampoline with 4 Sentence Types',
        malayalamTitle: 'നാല് തരം വാക്യങ്ങൾ പരിചയപ്പെടുന്നു',
        backdrop: 'classroom',
        visualStageEmoji: '✍️🦘❓❗.',
        props: ['✍️', '🦘', '❓', '❗'],
        dialogues: [
          {
            speakerId: 'wordy_kangaroo',
            englishText: 'Boing boing! Welcome to Grammar Fest, Eadrick! Just like the kids bouncing on your book cover trampoline, let’s build 4 sentence types!',
            malayalamText: 'സ്വാഗതം ഗ്രാമർ ഫെസ്റ്റിലേക്ക് ഏദ്രിക്! നിന്റെ ബുക്കിന്റെ പുറംചട്ടയിലെ കുട്ടികളെപ്പോലെ നമുക്ക് 4 തരം വാക്യങ്ങളിലേക്ക് ചാടാം!',
            emotion: 'excited',
            actionPrompt: 'Wordy does a bouncy trampoline leap across the stage.',
          },
          {
            speakerId: 'prof_punctuation',
            englishText: 'Listen carefully: Declarative makes a STATEMENT (.), Interrogative asks a QUESTION (?), Imperative gives a COMMAND (.), Exclamatory shows EXCITEMENT (!)!',
            malayalamText: 'ശ്രദ്ധിക്കൂ: പ്രസ്താവന (.), ചോദ്യം (?), നിർദ്ദേശം (.), ആശ്ചര്യവാക്യം (!) — ഇവയാണ് 4 തരം വാക്യങ്ങൾ!',
            emotion: 'explaining',
          },
          {
            speakerId: 'eadrick',
            englishText: '"Eadrick loves science." is Declarative! "Are you ready?" is Interrogative! And "What a glorious day!" is Exclamatory!',
            malayalamText: '"ഏദ്രിക് സയൻസ് ഇഷ്ടപ്പെടുന്നു" എന്നത് പ്രസ്താവന! "തയ്യാറാണോ?" എന്നത് ചോദ്യം! "എത്ര മനോഹരമായ ദിവസം!" എന്നത് ആശ്ചര്യവാക്യം!',
            emotion: 'celebrating',
          },
          {
            speakerId: 'mother',
            englishText: 'Spot on, Eadrick! Master your Grammar Fest lessons and your writing will always be crystal clear and brilliant!',
            malayalamText: 'വളരെ കൃത്യമായി പറഞ്ഞു ഏദ്രിക്! വ്യാകരണം പഠിച്ചാൽ ഇംഗ്ലീഷ് എഴുത്തും സംസാരവും ഒന്നാംകിടയാകും!',
            emotion: 'happy',
          },
        ],
        keyConceptPopup: {
          english: '4 Sentences: Declarative (.), Interrogative (?), Imperative (.), Exclamatory (!)',
          malayalam: '4 തരം വാക്യങ്ങൾ: പ്രസ്താവന (.), ചോദ്യം (?), നിർദ്ദേശം (.), ആശ്ചര്യവാക്യം (!)',
        },
      },
    ],
  },
};

/**
 * Intelligent Dynamic Episode Generator Engine
 * Transforms ANY chapter (across all subjects in UKG and Class 4)
 * into an original cartoon episode with:
 * - Content-specific guest characters & animals (custom emojis, names, voices, personas)
 * - Thematic backdrop matching the topic
 * - Thematic props drifting across the stage
 * - Unique multi-character storyline with the child, family, and guest stars!
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

  const textLower = `${chapterId} ${chapterTitle} ${chapterSummary} ${keyTerms.join(' ')}`.toLowerCase();

  // Determine category archetype based on content keywords
  let category = 'general';
  let backdrop: SceneBackdrop = 'classroom';
  let bannerGradient = 'from-indigo-600 via-purple-600 to-pink-600';
  let themeEmoji = '✨📚';
  let worldName = { en: 'Wonderland Academy', ml: 'അറിവിന്റെ മാന്ത്രിക ലോകം' };
  let moral = {
    en: 'Curiosity and family teamwork make every mystery simple to solve!',
    ml: 'കുടുംബത്തോടൊപ്പം അന്വേഷിച്ചു പഠിച്ചാൽ എല്ലാ അറിവും എളുപ്പമായി മാറും!',
  };
  let props: string[] = ['📚', '⭐', '💡', '✨'];

  let guest1: GuestCharacter;
  let guest2: GuestCharacter;

  if (textLower.includes('plant') || textLower.includes('tree') || textLower.includes('seed') || textLower.includes('flower') || textLower.includes('leaf') || textLower.includes('photosynthesis')) {
    category = 'plants';
    backdrop = 'garden';
    bannerGradient = 'from-emerald-500 via-green-600 to-teal-700';
    themeEmoji = '🌱🌻';
    worldName = { en: 'The Secret Botanical Kingdom', ml: 'സസ്യലോക അത്ഭുത വനം' };
    props = ['🌱', '🌻', '🍃', '💧'];
    moral = { en: 'Plants give us clean air, sweet fruits, and life — always plant green trees!', ml: 'സസ്യങ്ങളാണ് നമുക്ക് പ്രാണവായുവും ആഹാരവും തരുന്നത് — മരങ്ങൾ നടൂ!' };
    guest1 = {
      id: 'sprout_seed',
      name: 'Sprout the Singing Seed',
      malayalamName: 'സ്പ്രൗട്ട് കൊച്ചു വിത്ത്',
      role: 'Green Shoot Explorer',
      malayalamRole: 'മുളച്ചുയരുന്ന വിത്ത് കൂട്ടുകാരൻ',
      emoji: '🌱',
      voiceKey: 'voice_creature',
      voicePitch: 1.35,
      voiceRate: 1.05,
      bgGradient: 'from-lime-400 to-emerald-600',
      badgeColor: 'bg-lime-600 text-white',
      borderColor: 'border-lime-400',
      tagline: 'Give me sunlight, water, and rich soil, and watch me grow tall!',
    };
    guest2 = {
      id: 'chef_chlorophyll',
      name: 'Chef Chlorophyll the Leaf',
      malayalamName: 'ഷെഫ് ക്ലോറോഫിൽ ഇല',
      role: 'Master Solar Cook',
      malayalamRole: 'സൂര്യപ്രകാശത്തിൽ ഭക്ഷണം പാകം ചെയ്യുന്ന ഇല',
      emoji: '🍃',
      voiceKey: 'voice_creature',
      voicePitch: 1.25,
      voiceRate: 1.0,
      bgGradient: 'from-emerald-400 to-teal-600',
      badgeColor: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-400',
      tagline: 'Photosynthesis kitchen! I mix water, CO2, and sunlight into sweet glucose!',
    };
  } else if (textLower.includes('animal') || textLower.includes('lion') || textLower.includes('bird') || textLower.includes('insect') || textLower.includes('wildlife') || textLower.includes('adaptation in animal')) {
    category = 'animals';
    backdrop = 'jungle';
    bannerGradient = 'from-amber-600 via-orange-600 to-emerald-700';
    themeEmoji = '🦁🐾';
    worldName = { en: 'Wild Kingdom Safari', ml: 'വന്യജീവി സഫാരി' };
    props = ['🦁', '🐾', '🌴', '🌿'];
    moral = { en: 'Every creature is uniquely adapted to survive happily in its natural home!', ml: 'ഓരോ ജീവിയും അതിന്റെ പ്രകൃതിദത്ത ആവാസവ്യവസ്ഥയ്ക്കനുസരിച്ച് പൊരുത്തപ്പെടുന്നു!' };
    guest1 = {
      id: 'leo_safari',
      name: 'Sheru the Safari Lion',
      malayalamName: 'ഷെരു വനരാജൻ സിംഹം',
      role: 'Jungle King Guide',
      malayalamRole: 'വനസംരക്ഷകനായ സിംഹം',
      emoji: '🦁',
      voiceKey: 'voice_giant',
      voicePitch: 0.65,
      voiceRate: 0.95,
      bgGradient: 'from-amber-500 to-orange-700',
      badgeColor: 'bg-amber-700 text-white',
      borderColor: 'border-amber-500',
      tagline: 'Roar! Welcome to our green jungle kingdom of wonderful animals!',
    };
    guest2 = {
      id: 'chiku_monkey',
      name: 'Chiku the Acrobatic Monkey',
      malayalamName: 'ചിക്കു കുസൃതി കുരങ്ങൻ',
      role: 'Canopy Navigator',
      malayalamRole: 'മരച്ചില്ലകളിലെ അക്രോബാറ്റ് കുരങ്ങൻ',
      emoji: '🐒',
      voiceKey: 'voice_creature',
      voicePitch: 1.4,
      voiceRate: 1.1,
      bgGradient: 'from-yellow-400 to-amber-600',
      badgeColor: 'bg-yellow-600 text-slate-900',
      borderColor: 'border-yellow-400',
      tagline: 'Chatter chatter! Swinging from tree to tree with my strong grasping tail!',
    };
  } else if (textLower.includes('space') || textLower.includes('planet') || textLower.includes('star') || textLower.includes('sun') || textLower.includes('moon') || textLower.includes('earth')) {
    category = 'space';
    backdrop = 'space';
    bannerGradient = 'from-slate-900 via-indigo-900 to-purple-800';
    themeEmoji = '🚀🪐';
    worldName = { en: 'The Galaxy Cosmic Station', ml: 'സൗരയൂഥ നിലയം' };
    props = ['🚀', '🪐', '⭐', '☄️'];
    moral = { en: 'The universe is vast and wonderful — science uncovers its secrets step by step!', ml: 'പ്രപഞ്ചം അത്ഭുതങ്ങൾ നിറഞ്ഞതാണ് — ശാസ്ത്രം അതിന്റെ രഹസ്യങ്ങൾ ഓരോന്നായി വെളിപ്പെടുത്തുന്നു!' };
    guest1 = {
      id: 'cosmo_astronaut',
      name: 'Captain Cosmo the Rocket',
      malayalamName: 'ക്യാപ്റ്റൻ കോസ്മോ റോക്കറ്റ്',
      role: 'Orbit Commander',
      malayalamRole: 'ബഹിരാകാശ പര്യവേക്ഷക റോക്കറ്റ്',
      emoji: '🚀',
      voiceKey: 'voice_creature',
      voicePitch: 1.25,
      voiceRate: 1.05,
      bgGradient: 'from-blue-500 to-cyan-600',
      badgeColor: 'bg-blue-600 text-white',
      borderColor: 'border-blue-400',
      tagline: 'Igniting thrusters! Blasting past gravity into the starry cosmos!',
    };
    guest2 = {
      id: 'twinkle_star',
      name: 'Twinkle the Golden Star',
      malayalamName: 'ട്വിങ്കിൾ തിളങ്ങുന്ന നക്ഷത്രം',
      role: 'Beacon of Deep Space',
      malayalamRole: 'ആകാശത്തെ വഴികാട്ടി നക്ഷത്രം',
      emoji: '⭐',
      voiceKey: 'voice_creature',
      voicePitch: 1.45,
      voiceRate: 1.05,
      bgGradient: 'from-amber-300 to-yellow-500',
      badgeColor: 'bg-yellow-500 text-slate-900',
      borderColor: 'border-yellow-300',
      tagline: 'Twinkle, twinkle! Shining bright light from millions of miles away!',
    };
  } else if (textLower.includes('math') || textLower.includes('number') || textLower.includes('addition') || textLower.includes('subtraction') || textLower.includes('multiplication') || textLower.includes('division') || textLower.includes('fraction') || textLower.includes('geometry') || textLower.includes('shapes')) {
    category = 'math';
    backdrop = 'classroom';
    bannerGradient = 'from-indigo-600 via-sky-600 to-blue-700';
    themeEmoji = '🔢📐';
    worldName = { en: 'The Mathemagic Academy', ml: 'മാത്തമാജിക് വിസ്മയ ലോകം' };
    props = ['🔢', '➕', '📐', '🎯'];
    moral = { en: 'Math is the secret code behind shapes, music, buildings, and nature!', ml: 'കണക്ക് പ്രകൃതിയുടെയും രൂപങ്ങളുടെയും രഹസ്യ കോഡാണ്!' };
    guest1 = {
      id: 'coco_math_parrot',
      name: 'Coco the Number Parrot',
      malayalamName: 'കൊക്കോ സംഖ്യാ തത്ത',
      role: 'Math Game Champion',
      malayalamRole: 'കണക്കിലെ കളിക്കൂട്ടുകാരൻ തത്ത',
      emoji: '🦜',
      voiceKey: 'voice_bird',
      voicePitch: 1.45,
      voiceRate: 1.1,
      bgGradient: 'from-emerald-400 to-teal-600',
      badgeColor: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-400',
      tagline: 'Squawk! Numbers are friendly puzzles waiting to be solved!',
    };
    guest2 = {
      id: 'geo_shape_wizard',
      name: 'Geo the Shape Wizard',
      malayalamName: 'ജിയോ ആകൃതി മാന്ത്രികൻ',
      role: 'Master of Symmetry & Angles',
      malayalamRole: 'രൂപങ്ങളുടെയും അളവുകളുടെയും സൂക്ഷിപ്പുകാരൻ',
      emoji: '📐',
      voiceKey: 'voice_creature',
      voicePitch: 1.2,
      voiceRate: 1.0,
      bgGradient: 'from-violet-400 to-purple-600',
      badgeColor: 'bg-purple-600 text-white',
      borderColor: 'border-purple-400',
      tagline: 'Lines, angles, squares, and circles construct everything we build!',
    };
  } else if (textLower.includes('transport') || textLower.includes('vehicle') || textLower.includes('traffic') || textLower.includes('communication') || textLower.includes('travel')) {
    category = 'transport';
    backdrop = 'city';
    bannerGradient = 'from-sky-500 via-blue-600 to-indigo-700';
    themeEmoji = '✈️🚗';
    worldName = { en: 'Speedway Metro World', ml: 'വേഗതയുടെ മെട്രോ നഗരം' };
    props = ['✈️', '🚗', '🚂', '🚦'];
    moral = { en: 'Safe travels connect families and cities across the globe!', ml: 'സുരക്ഷിതമായ യാത്ര ലോകത്തെ പരസ്പരം അടുപ്പിക്കുന്നു!' };
    guest1 = {
      id: 'zoomy_express',
      name: 'Zoomy the High-Speed Jet',
      malayalamName: 'സൂമി ജെറ്റ് വിമാനം',
      role: 'Sky Cruiser',
      malayalamRole: 'ആകാശയാത്രയിലെ വേഗതയേറിയ കൂട്ട്',
      emoji: '✈️',
      voiceKey: 'voice_creature',
      voicePitch: 1.35,
      voiceRate: 1.1,
      bgGradient: 'from-sky-400 to-blue-600',
      badgeColor: 'bg-sky-600 text-white',
      borderColor: 'border-sky-400',
      tagline: 'Cruising high above clouds to carry passengers safely!',
    };
    guest2 = {
      id: 'captain_ship',
      name: 'Captain Tugger the Steam Boat',
      malayalamName: 'ക്യാപ്റ്റൻ കപ്പൽ',
      role: 'Ocean Navigator',
      malayalamRole: 'കടൽ സഞ്ചാരി കപ്പൽ',
      emoji: '🚢',
      voiceKey: 'voice_giant',
      voicePitch: 0.75,
      voiceRate: 0.95,
      bgGradient: 'from-teal-500 to-cyan-700',
      badgeColor: 'bg-teal-700 text-white',
      borderColor: 'border-teal-500',
      tagline: 'Toot toot! Sailing through blue ocean waves across foreign ports!',
    };
  } else if (textLower.includes('history') || textLower.includes('past') || textLower.includes('ancient') || textLower.includes('culture') || textLower.includes('citizen') || textLower.includes('india') || textLower.includes('monument')) {
    category = 'history';
    backdrop = 'museum';
    bannerGradient = 'from-amber-700 via-stone-800 to-slate-900';
    themeEmoji = '🏛️📜';
    worldName = { en: 'Chronicles Heritage Castle', ml: 'പൈതൃക ചരിത്ര കൊട്ടാരം' };
    props = ['🏛️', '📜', '👑', '🏺'];
    moral = { en: 'Respecting our heritage gives us courage and wisdom to build a bright future!', ml: 'പൈതൃകത്തെ ബഹുമാനിക്കുന്നത് നല്ല ഭാവിയെ നിർമ്മിക്കാൻ സഹായിക്കുന്നു!' };
    guest1 = {
      id: 'raja_fort_elephant',
      name: 'Raja the Heritage Elephant',
      malayalamName: 'രാജകൊട്ടാര ആന',
      role: 'Guardian of Forts & Temples',
      malayalamRole: 'പുരാതന സ്മാരകങ്ങളുടെ കാവൽക്കാരൻ',
      emoji: '🐘',
      voiceKey: 'voice_giant',
      voicePitch: 0.65,
      voiceRate: 0.9,
      bgGradient: 'from-stone-600 to-amber-800',
      badgeColor: 'bg-stone-700 text-white',
      borderColor: 'border-stone-500',
      tagline: 'Carrying the glorious stories and celebrations of centuries past!',
    };
    guest2 = {
      id: 'prof_timely',
      name: 'Professor Scroll the Time Sage',
      malayalamName: 'താളിയോല മുത്തശ്ശി മൂങ്ങ',
      role: 'Ancient Script Decoder',
      malayalamRole: 'പഴയ താളിയോല രേഖകളുടെ കാവൽക്കാരൻ',
      emoji: '📜',
      voiceKey: 'voice_wise',
      voicePitch: 0.85,
      voiceRate: 0.95,
      bgGradient: 'from-amber-500 to-yellow-700',
      badgeColor: 'bg-amber-700 text-white',
      borderColor: 'border-amber-400',
      tagline: 'Every artifact and copper coin whispers a forgotten secret of the past!',
    };
  } else if (textLower.includes('malayalam') || textLower.includes('മലയാളം') || textLower.includes('കവിത') || textLower.includes('അക്ഷര') || textLower.includes('ചങ്ങാതി')) {
    category = 'malayalam';
    backdrop = 'nature';
    bannerGradient = 'from-emerald-600 via-teal-700 to-green-800';
    themeEmoji = '🌺🥥';
    worldName = { en: 'God’s Own Nature Haven', ml: 'കേരളത്തിലെ പൂന്തോട്ടം' };
    props = ['🌴', '🌺', '🥥', '🦚'];
    moral = { en: 'Our mother tongue connects our heart, songs, and culture!', ml: 'മാതൃഭാഷ നമ്മുടെ ഹൃദയത്തെയും സംസ്കാരത്തെയും ബന്ധിപ്പിക്കുന്നു!' };
    guest1 = {
      id: 'mayil_peacock',
      name: 'Mayil the Dancing Peacock',
      malayalamName: 'പീലിവിടർത്തിയ മയിൽ',
      role: 'Rain Melody Singer',
      malayalamRole: 'മഴപ്പാട്ട് പാടുന്ന മയിൽ',
      emoji: '🦚',
      voiceKey: 'voice_bird',
      voicePitch: 1.35,
      voiceRate: 1.05,
      bgGradient: 'from-teal-400 to-emerald-600',
      badgeColor: 'bg-teal-600 text-white',
      borderColor: 'border-teal-400',
      tagline: 'നീലപ്പീലി വിടർത്തി മലയാള കവിതകളുടെ ഈണത്തിൽ ഞാൻ നൃത്തം ചെയ്യും!',
    };
    guest2 = {
      id: 'thumbi_nature',
      name: 'Thumbi the Garden Dragonfly',
      malayalamName: 'പാറിപ്പറക്കുന്ന തുമ്പി',
      role: 'Flower Nectar Explorer',
      malayalamRole: 'പൂന്തോട്ടത്തിലെ കൊച്ചു ചങ്ങാതി',
      emoji: '蜻蛉',
      voiceKey: 'voice_creature',
      voicePitch: 1.45,
      voiceRate: 1.1,
      bgGradient: 'from-sky-400 to-cyan-600',
      badgeColor: 'bg-sky-600 text-white',
      borderColor: 'border-sky-400',
      tagline: 'തുമ്പപ്പൂവിൽ തേനുണ്ടോ എന്ന് പാടിപ്പാറി നടക്കുന്ന കൊച്ചു കൂട്ടുകാരി!',
    };
  } else if (textLower.includes('hindi') || textLower.includes('हिन्दी') || textLower.includes('उड़न') || textLower.includes('खटोला') || textLower.includes('बीरबल') || textLower.includes('पाठ')) {
    category = 'hindi';
    backdrop = 'sky';
    bannerGradient = 'from-rose-500 via-pink-600 to-red-600';
    themeEmoji = '🛸🪶';
    worldName = { en: 'Udan Khatola Hindi Realm', ml: 'ഉഡൻ ഖടോല വിസ്മയ ലോകം' };
    props = ['🛸', '🪶', '🏔️', '✨'];
    moral = { en: 'Hindi literature inspires wisdom, courage, and love for nature!', ml: 'ഹിന്ദി സാഹിത്യം വിവേകവും പ്രകൃതിസ്നേഹവും പകർന്നുതരുന്നു!' };
    guest1 = {
      id: 'khatola_dynamic',
      name: 'Khatola the Flying Chariot',
      malayalamName: 'ഉഡൻ ഖടോല മാന്ത്രിക രഥം',
      role: 'Sky Chariot of Wisdom',
      malayalamRole: 'ആകാശയാത്രയിലെ മാന്ത്രിക വാഹനം',
      emoji: '🛸',
      voiceKey: 'voice_creature',
      voicePitch: 1.3,
      voiceRate: 1.05,
      bgGradient: 'from-rose-400 to-pink-600',
      badgeColor: 'bg-rose-600 text-white',
      borderColor: 'border-rose-400',
      tagline: 'जादुई उड़न खटोले में बैठकर भारत के सुंदर पर्वतों और नदियों की सैर करें!',
    };
    guest2 = {
      id: 'birbal_dynamic',
      name: 'Birbal the Clever Vizier',
      malayalamName: 'ബുദ്ധിമാനായ ബീർബൽ',
      role: 'Champion of Wit & Justice',
      malayalamRole: 'നീതിമാനും ബുദ്ധിമാനുമായ മന്ത്രി',
      emoji: '👑',
      voiceKey: 'voice_wise',
      voicePitch: 0.88,
      voiceRate: 0.95,
      bgGradient: 'from-amber-400 to-yellow-600',
      badgeColor: 'bg-amber-600 text-slate-900',
      borderColor: 'border-amber-400',
      tagline: 'बुद्धि और हास्य-बोध से हर मुश्किल समस्या का हल निकलता है!',
    };
  } else if (textLower.includes('grammar') || textLower.includes('sentence') || textLower.includes('predicate') || textLower.includes('noun') || textLower.includes('adverb') || textLower.includes('pronoun') || textLower.includes('conjunction')) {
    category = 'english_grammar';
    backdrop = 'classroom';
    bannerGradient = 'from-indigo-600 via-purple-600 to-blue-700';
    themeEmoji = '✍️🦘';
    worldName = { en: 'Grammar Fest Carnival', ml: 'ഗ്രാമർ ഫെസ്റ്റ് ഉത്സവം' };
    props = ['✍️', '🦘', '📚', '🎯'];
    moral = { en: 'Clear grammar lets your thoughts shine like bright stars!', ml: 'വ്യക്തമായ വ്യാകരണം ആശയവിനിമയത്തെ മനോഹരമാക്കുന്നു!' };
    guest1 = {
      id: 'prof_punctuation_dyn',
      name: 'Professor Punctuation',
      malayalamName: 'പ്രൊഫസർ ചിഹ്ന മാന്ത്രികൻ',
      role: 'Chief Punctuation Inspector',
      malayalamRole: 'വാക്യ ചിഹ്നങ്ങളുടെ സൂക്ഷിപ്പുകാരൻ',
      emoji: '✍️',
      voiceKey: 'voice_wise',
      voicePitch: 0.88,
      voiceRate: 0.95,
      bgGradient: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-600 text-white',
      borderColor: 'border-purple-400',
      tagline: 'Every sentence begins with a Capital Letter and ends with proper punctuation!',
    };
    guest2 = {
      id: 'wordy_kangaroo_dyn',
      name: 'Wordy the Grammar Kangaroo',
      malayalamName: 'വേർഡി ചാട്ടക്കാരൻ കംഗാരു',
      role: 'Sentence Trampoline Champion',
      malayalamRole: 'വാക്യങ്ങൾ നിർമ്മിച്ച് ചാടുന്ന കംഗാരു',
      emoji: '🦘',
      voiceKey: 'voice_creature',
      voicePitch: 1.35,
      voiceRate: 1.05,
      bgGradient: 'from-amber-400 to-orange-500',
      badgeColor: 'bg-amber-500 text-slate-900',
      borderColor: 'border-amber-400',
      tagline: 'Boing boing! Bouncing on the trampoline of Grammar Fest!',
    };
  } else {
    // Default smart educational explorer theme
    category = 'general_learning';
    backdrop = 'school';
    bannerGradient = 'from-violet-600 via-indigo-600 to-pink-600';
    themeEmoji = '⭐🦉';
    worldName = { en: 'The Discovery Castle', ml: 'അറിവിന്റെ വിസ്മയ കൊട്ടാരം' };
    props = ['📚', '⭐', '💡', '🏆'];
    guest1 = {
      id: 'hootie_the_owl',
      name: 'Professor Hootie the AI Owl',
      malayalamName: 'പ്രൊഫസർ ഹൂട്ടി ബുദ്ധിമാൻ മൂങ്ങ',
      role: 'Genius Academy Mentor',
      malayalamRole: 'അറിവ് പകർന്നു തരുന്ന ബുദ്ധിമാനായ മൂങ്ങ',
      emoji: '🦉',
      voiceKey: 'voice_wise',
      voicePitch: 0.85,
      voiceRate: 0.95,
      bgGradient: 'from-purple-500 to-indigo-700',
      badgeColor: 'bg-purple-600 text-white',
      borderColor: 'border-purple-400',
      tagline: 'Hoo-hoo! Let us unlock the wonder hidden inside today’s lesson!',
    };
    guest2 = {
      id: 'sparky_curious',
      name: 'Sparky the Wonder Mascot',
      malayalamName: 'സ്പാർക്കി കളി കൂട്ടുകാരൻ',
      role: 'Fun Activity Champion',
      malayalamRole: 'കളിയിലൂടെ പഠിപ്പിക്കുന്ന കൊച്ചു താരം',
      emoji: '⭐',
      voiceKey: 'voice_creature',
      voicePitch: 1.35,
      voiceRate: 1.05,
      bgGradient: 'from-amber-400 to-orange-500',
      badgeColor: 'bg-amber-500 text-slate-900',
      borderColor: 'border-amber-400',
      tagline: 'Sparkle sparkle! When we ask questions, our brain grows bigger and brighter!',
    };
  }

  const termsString = keyTerms.slice(0, 3).join(', ') || chapterTitle;

  return {
    chapterId,
    title: `${chapterTitle}: The Cartoon Adventure!`,
    malayalamTitle: `${chapterTitle} — മാന്ത്രിക കാർട്ടൂൺ കഥ!`,
    subjectTitle: chapterTitle,
    bannerGradient,
    themeEmoji,
    worldName,
    moral,
    cast: [guest1, guest2],
    scenes: [
      {
        sceneNumber: 1,
        title: `Welcome to ${worldName.en}: Meeting ${guest1.name}`,
        malayalamTitle: `${guest1.malayalamName}യുള്ള സംഭാഷണം`,
        backdrop,
        visualStageEmoji: `${themeEmoji} ${guest1.emoji} ${guest2.emoji}`,
        props,
        dialogues: [
          {
            speakerId: guest1.id,
            englishText: `Hooray! Welcome Faidan and Eadrick! I am ${guest1.name}! Today our adventure is all about: ${chapterTitle}!`,
            malayalamText: `സ്വാഗതം ഫൈദാൻ, ഏദ്രിക്! ഞാനാണ് ${guest1.malayalamName}! ഇന്നത്തെ നമ്മുടെ പാഠം ${chapterTitle} ആണ്!`,
            emotion: 'excited',
            actionPrompt: `${guest1.name} waves happily with sparkling stage lights.`,
          },
          {
            speakerId: 'faidan',
            englishText: `Wow, look at ${guest1.name}! Papa Manoj, Mummy Tessy, can we explore ${termsString} together right now?`,
            malayalamText: `പപ്പാ, മമ്മീ! ${guest1.malayalamName}യെ കണ്ടോ! നമുക്കിത് ഒന്നിച്ച് കണ്ടുപിടിക്കാം!`,
            emotion: 'excited',
            actionPrompt: 'Faidan hops with curiosity and points to the scene backdrop.',
          },
          {
            speakerId: 'father',
            englishText: `Yes, sweet Faidan! Papa Manoj and Mummy Tessy are right beside you! In this chapter, we discover how ${chapterTitle} works in real life!`,
            malayalamText: `തീർച്ചയായും ഫൈദാൻ മോനേ! പപ്പയും മമ്മിയും നിന്റെ കൂടെയുണ്ട്! ഈ പാഠത്തിൽ നാം പ്രധാനമായും പഠിക്കുന്നത് ${chapterTitle} ആണ്!`,
            emotion: 'explaining',
            actionPrompt: 'Papa Manoj gives Faidan a warm, confident high-five.',
          },
          {
            speakerId: guest2.id,
            englishText: `And I am ${guest2.name}! Watch closely: ${chapterSummary.slice(0, 100)}... It is full of magic!`,
            malayalamText: `ഞാനാണ് ${guest2.malayalamName}! ശ്രദ്ധിക്കൂ: ${chapterSummary.slice(0, 80)}... ഇത് വളരെ രസകരമായ കാര്യമാണ്!`,
            emotion: 'happy',
            actionPrompt: `${guest2.name} performs an animated demonstration.`,
          },
        ],
        keyConceptPopup: {
          english: `Focus Concept: ${chapterTitle}`,
          malayalam: `പ്രധാന ആശയം: ${chapterTitle}`,
        },
      },
      {
        sceneNumber: 2,
        title: 'Mastering the Concept with the Family Team',
        malayalamTitle: 'കുടുംബത്തോടൊപ്പം ആശയം മനസ്സിലാക്കുന്നു',
        backdrop,
        visualStageEmoji: '🏆💡✨⭐',
        props,
        dialogues: [
          {
            speakerId: 'eadrick',
            englishText: `Hey Faidan, here is Big Brother Eadrick’s secret trick! Remember key terms: ${termsString}! Everything connects like a jigsaw puzzle!`,
            malayalamText: `ഫൈദാൻ, ചേട്ടന്റെ ഒരു സൂത്രം ഓർക്കുക: ${termsString} എന്നീ വാക്കുകൾ ഓർത്തു വെയ്ക്കൂ! എല്ലാം വളരെ ലളിതമാണ്!`,
            emotion: 'excited',
            actionPrompt: 'Eadrick demonstrates the connection with lively gestures.',
          },
          {
            speakerId: 'mother',
            englishText: `And remember my little champions: when we practice with love and joy, we remember it forever!`,
            malayalamText: `എന്റെ മിടുക്കന്മാർ! സന്തോഷത്തോടെ മനസ്സിലാക്കി പഠിച്ചാൽ ജീവിതകാലം മുഴുവൻ നാം ഇത് ഓർക്കും!`,
            emotion: 'happy',
            actionPrompt: 'Mummy Tessy beams with pride.',
          },
          {
            speakerId: 'grandmother',
            englishText: `Grandma Lilly is so proud of both of you! You listened so nicely and solved today’s adventure!`,
            malayalamText: `മുത്തശ്ശിക്ക് നിങ്ങളെ രണ്ടുപേരെയും ഓർത്ത് വലിയ സന്തോഷവും അഭിമാനവും തോന്നുന്നു! മിടുക്കന്മാർ!`,
            emotion: 'celebrating',
            actionPrompt: 'Grandma Lilly applauds with a loving smile.',
          },
          {
            speakerId: 'faidan',
            englishText: `Hooray! Now I understand ${chapterTitle} completely! Thank you Papa, Mummy, Grandma, Eadrick, and our cartoon friends!`,
            malayalamText: `യേയ്! ഇപ്പോൾ എനിക്ക് ${chapterTitle} പൂർണ്ണമായും മനസ്സിലായി! പപ്പയ്ക്കും മമ്മിക്കും മുത്തശ്ശിക്കും ചേട്ടനും കൂട്ടുകാർക്കും നന്ദി!`,
            emotion: 'celebrating',
            actionPrompt: 'Faidan jumps into the air with both hands up in celebration.',
          },
        ],
        keyConceptPopup: {
          english: `Awesome Mastery: ${chapterTitle}!`,
          malayalam: `${chapterTitle} വിജയകരമായി പൂർത്തിയാക്കി!`,
        },
      },
    ],
  };
}
