'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Sparkles,
  Wand2,
  Play,
  CheckCircle2,
  Star,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface StoryCharacter {
  name: string;
  malayalamName: string;
  emoji: string;
  role: string;
  color: string;
}

interface StoryScene {
  sceneTitle: string;
  malayalamSceneTitle: string;
  illustrationEmoji: string;
  narration: string;
  malayalamNarration: string;
  characterBubble: string;
  malayalamCharacterBubble: string;
}

interface Story {
  id: string;
  title: string;
  malayalamTitle: string;
  subjectTag: string;
  emoji: string;
  summary: string;
  characters: StoryCharacter[];
  scenes: StoryScene[];
  moral: string;
  moralMalayalam: string;
  quizQuestion: {
    question: string;
    malayalamQuestion: string;
    options: string[];
    malayalamOptions: string[];
    correctIndex: number;
  };
}

const PRESET_STORIES: Story[] = [
  {
    id: 'story-plants',
    title: 'Sprout the Little Seed & The Magic Sunlight Kitchen 🌱☀️',
    malayalamTitle: 'മുളയ്ക്കുന്ന വിത്തും സൂര്യപ്രകാശ അടുക്കളയും 🌱☀️',
    subjectTag: 'Plants & Photosynthesis',
    emoji: '🌱',
    summary: 'Learn how plants make food using sunlight, water, and air!',
    characters: [
      { name: 'Sprout the Seed', malayalamName: 'സ്പ്രൗട്ട് വിത്ത്', emoji: '🌱', role: 'Curious Plant', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { name: 'Chef Chlorophyll', malayalamName: 'ഷെഫ് ക്ലോറോഫിൽ', emoji: '🍃', role: 'Leaf Chef', color: 'bg-green-100 text-green-800 border-green-300' },
      { name: 'Sunny the Sun', malayalamName: 'സൂര്യൻ മാമൻ', emoji: '☀️', role: 'Energy Giver', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
    scenes: [
      {
        sceneTitle: 'Scene 1: Waking Up Under the Soil',
        malayalamSceneTitle: 'രംഗം 1: മണ്ണിനടിയിൽ ഉണരുന്നു',
        illustrationEmoji: '🌰💧🌱',
        narration: `Deep in a lush garden in Kerala, a tiny brown seed named Sprout was sleeping in the soft soil. One morning, cool raindrops trickled down and tickled Sprout's toes! "Time to wake up and stretch!" yawned Sprout, sending roots down to drink water and a green shoot up toward the sky.`,
        malayalamNarration: `കേരളത്തിലെ ഒരു മനോഹരമായ തോട്ടത്തിൽ മണ്ണിനടിയിൽ സ്പ്രൗട്ട് എന്ന കൊച്ചു വിത്ത് ഉറങ്ങുകയായിരുന്നു. ഒരു ദിവസം മഴത്തുള്ളികൾ വന്ന് അവനെ തൊട്ടുണർത്തി! സ്പ്രൗട്ട് വേരുകൾ താഴേക്കും പച്ച ഇലകൾ മുകളിലേക്കും നീട്ടി ഉണർന്നു.`,
        characterBubble: '🌱 "Yum! Fresh cool water from my roots!"',
        malayalamCharacterBubble: '🌱 "വേരുകളിലൂടെ നല്ല തണുത്ത വെള്ളം കിട്ടി!"',
      },
      {
        sceneTitle: 'Scene 2: The Green Leaf Kitchen (Photosynthesis)',
        malayalamSceneTitle: 'രംഗം 2: ഇലകളിലെ മാന്ത്രിക അടുക്കള (പ്രകാശസംശ്ലേഷണം)',
        illustrationEmoji: '☀️🍃🌬️',
        narration: `Inside Sprout's bright green leaves lived Chef Chlorophyll! Sunny the Sun beamed down warm golden light. "Let's cook!" cheered Chef Chlorophyll. He mixed Water from the roots, Carbon Dioxide from the air, and Sunlight energy. Together, this magical cooking process is called Photosynthesis!`,
        malayalamNarration: `പച്ച ഇലകൾക്കുള്ളിൽ ഷെഫ് ക്ലോറോഫിൽ ഉണ്ടായിരുന്നു! സൂര്യൻ മാമൻ പൊൻവെയിൽ നൽകി. വേരുകൾ നൽകിയ വെള്ളവും വായുവിലെ കാർബൺ ഡൈ ഓക്സൈഡും സൂര്യപ്രകാശവും ചേർത്ത് ഇലകൾ ആഹാരം പാകം ചെയ്തു. ഇതിനെയാണ് പ്രകാശസംശ്ലേഷണം (Photosynthesis) എന്ന് വിളിക്കുന്നത്!`,
        characterBubble: '🍃 "Sunlight + Water + Air = Sweet Plant Food!"',
        malayalamCharacterBubble: '🍃 "സൂര്യപ്രകാശം + വെള്ളം + വായു = സസ്യങ്ങളുടെ ആഹാരം!"',
      },
      {
        sceneTitle: 'Scene 3: A Gift of Fresh Oxygen for Everyone',
        malayalamSceneTitle: 'രംഗം 3: എല്ലാവർക്കും ശുദ്ധവായു സമ്മാനം',
        illustrationEmoji: '🌳🦋👧',
        narration: `After cooking delicious glucose food to grow tall and strong, Sprout released sparkling bubbles of fresh Oxygen into the breeze! Birds, butterflies, and children breathed the clean air happily. Every green plant is a life-giving friend to our Earth!`,
        malayalamNarration: `ആഹാരം പാകം ചെയ്ത ശേഷം സ്പ്രൗട്ട് ശുദ്ധമായ ഓക്സിജൻ (Oxygen) വായുവിലേക്ക് പുറത്തുവിട്ടു! പക്ഷികളും പൂമ്പാറ്റകളും കുട്ടികളും ശുദ്ധവായു ശ്വസിച്ച് സന്തോഷിച്ചു.`,
        characterBubble: '☀️ "Thank you, green plants, for keeping Earth fresh!"',
        malayalamCharacterBubble: '☀️ "ഭൂമിക്ക് ശുദ്ധവായു നൽകുന്ന ചെടികൾക്ക് നന്ദി!"',
      },
    ],
    moral: 'Plants make their own food through Photosynthesis and give us precious Oxygen to breathe.',
    moralMalayalam: 'സസ്യങ്ങൾ പ്രകാശസംശ്ലേഷണത്തിലൂടെ ആഹാരം നിർമ്മിക്കുകയും നമുക്ക് ശ്വസിക്കാൻ ഓക്സിജൻ നൽകുകയും ചെയ്യുന്നു.',
    quizQuestion: {
      question: 'What 3 things do plants need for Photosynthesis?',
      malayalamQuestion: 'പ്രകാശസംശ്ലേഷണത്തിന് സസ്യങ്ങൾക്ക് ആവശ്യമായ 3 കാര്യങ്ങൾ ഏവ?',
      options: ['Sunlight, Water, Carbon Dioxide', 'Milk, Bread, Butter', 'Moonlight, Stones, Sand'],
      malayalamOptions: ['സൂര്യപ്രകാശം, വെള്ളം, കാർബൺ ഡൈ ഓക്സൈഡ്', 'പാൽ, റൊട്ടി, വെണ്ണ', 'നിലാവ്, കല്ല്, മണൽ'],
      correctIndex: 0,
    },
  },
  {
    id: 'story-animals',
    title: 'Appu the Elephant & The Secret of Animal Habitats 🐘🌴',
    malayalamTitle: 'അപ്പു ആനയും മൃഗങ്ങളുടെ വാസസ്ഥലങ്ങളും 🐘🌴',
    subjectTag: 'Animals & Habitats',
    emoji: '🐘',
    summary: 'Explore how forest, desert, polar, and ocean animals adapt to their homes!',
    characters: [
      { name: 'Appu the Elephant', malayalamName: 'അപ്പു ആന', emoji: '🐘', role: 'Forest Explorer', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
      { name: 'Koko the Camel', malayalamName: 'കോക്കോ ഒട്ടകം', emoji: '🐪', role: 'Desert Ship', color: 'bg-amber-100 text-amber-800 border-amber-300' },
      { name: 'Pip the Penguin', malayalamName: 'പിപ്പ് പെൻഗ്വിൻ', emoji: '🐧', role: 'Ice Swimmer', color: 'bg-sky-100 text-sky-800 border-sky-300' },
    ],
    scenes: [
      {
        sceneTitle: 'Scene 1: The Lush Forest Habitat',
        malayalamSceneTitle: 'രംഗം 1: പച്ചപ്പുള്ള വനവാസസ്ഥലം',
        illustrationEmoji: '🐘🌳🐒',
        narration: `Appu the baby elephant lived in the green forests of Wayanad. He used his long trunk to pluck bamboo leaves and spray cool river water on his back. "The forest is my terrestrial habitat because it has plenty of trees, shade, and streams!" trumpeted Appu.`,
        malayalamNarration: `വയനാട്ടിലെ പച്ചപ്പുള്ള കാട്ടിലാണ് അപ്പു എന്ന കുട്ടിയാന ജീവിച്ചിരുന്നത്. നീണ്ട തുമ്പിക്കൈ കൊണ്ട് അവൻ മുളയിലകൾ തിന്നുകയും തണുത്ത വെള്ളം ചീറ്റിക്കുകയും ചെയ്തു. "ധാരാളം മരങ്ങളും വെള്ളവുമുള്ള കാടാണ് എന്റെ വാസസ്ഥലം!" അപ്പു പറഞ്ഞു.`,
        characterBubble: '🐘 "My big ears fan me when the forest gets warm!"',
        malayalamCharacterBubble: '🐘 "വലിയ ചെവികൾ വീശി ഞാൻ ചൂട് മാറ്റും!"',
      },
      {
        sceneTitle: 'Scene 2: Meeting Friends from Desert & Snow',
        malayalamSceneTitle: 'രംഗം 2: മരുഭൂമിയിലെയും മഞ്ഞിലെയും കൂട്ടുകാർ',
        illustrationEmoji: '🐪🏜️🐧❄️',
        narration: `At the World Animal Fair, Appu met Koko the Camel and Pip the Penguin! Koko smiled: "I have padded feet to walk on hot desert sand and a hump to store fat for energy!" Pip waddled happily: "And I have thick feathers and blubber to stay cozy in freezing icy lands!"`,
        malayalamNarration: `മൃഗങ്ങളുടെ സംഗമത്തിൽ അപ്പു ഒട്ടകത്തെയും പെൻഗ്വിനെയും കണ്ടുമുട്ടി! ഒട്ടകം പറഞ്ഞു: "മരുഭൂമിയിലെ മണലിൽ നടക്കാൻ എനിക്ക് പരന്ന പാദങ്ങളുണ്ട്!" പെൻഗ്വിൻ പറഞ്ഞു: "കടുത്ത മഞ്ഞിൽ തണുക്കാതിരിക്കാൻ എനിക്ക് കട്ടിയുള്ള തൂവലുകളുണ്ട്!"`,
        characterBubble: '🐪 "Every animal has special adaptations for its home!"',
        malayalamCharacterBubble: '🐪 "ഓരോ മൃഗത്തിനും അതിന്റെ വാസസ്ഥലത്തിന് അനുയോജ്യമായ സവിശേഷതകളുണ്ട്!"',
      },
    ],
    moral: 'Every animal has special body features (adaptations) suited to survive in its natural habitat.',
    moralMalayalam: 'ഓരോ ജീവിക്കും അതിന്റെ സ്വാഭാവിക വാസസ്ഥലത്ത് ജീവിക്കാൻ പ്രത്യേക ശരീര സവിശേഷതകൾ (അനുകൂലനങ്ങൾ) ഉണ്ട്.',
    quizQuestion: {
      question: 'Why is the Camel called the "Ship of the Desert"?',
      malayalamQuestion: 'ഒട്ടകത്തെ "മരുഭൂമിയിലെ കപ്പൽ" എന്ന് വിളിക്കുന്നത് എന്തുകൊണ്ട്?',
      options: ['It has padded feet to walk easily on hot sand', 'It swims in the ocean', 'It flies in the clouds'],
      malayalamOptions: ['ചൂടുള്ള മണലിൽ നടക്കാൻ പരന്ന പാദങ്ങൾ ഉള്ളതുകൊണ്ട്', 'കടലിൽ നീന്തുന്നതുകൊണ്ട്', 'ആകാശത്ത് പറക്കുന്നതുകൊണ്ട്'],
      correctIndex: 0,
    },
  },
  {
    id: 'story-environment',
    title: 'Piku the Raindrop & The Green Earth Squad 💧🌍',
    malayalamTitle: 'പിക്കു ജലത്തുള്ളിയും ഹരിത ഭൂമി സംഘവും 💧🌍',
    subjectTag: 'Environmental Science',
    emoji: '🌍',
    summary: 'A magical story about the water cycle, recycling, and protecting nature!',
    characters: [
      { name: 'Piku the Drop', malayalamName: 'പിക്കു തുള്ളി', emoji: '💧', role: 'Water Traveler', color: 'bg-sky-100 text-sky-800 border-sky-300' },
      { name: 'Hootie the Owl', malayalamName: 'ഹുട്ടി മൂങ്ങ', emoji: '🦉', role: 'Eco Guardian', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    ],
    scenes: [
      {
        sceneTitle: 'Scene 1: Piku Flies to the Clouds',
        malayalamSceneTitle: 'രംഗം 1: മേഘങ്ങളിലേക്കുള്ള യാത്ര',
        illustrationEmoji: '☀️🌊☁️',
        narration: `Piku lived in the Periyar river. When the warm sun shone, Piku floated up into the sky as water vapor (Evaporation). Up high in the cool air, Piku hugged millions of other drops to form a fluffy white cloud (Condensation), and then fell back as gentle rain (Precipitation)!`,
        malayalamNarration: `പെരിയാർ നദിയിലെ പിക്കു എന്ന ജലത്തുള്ളി സൂര്യന്റെ ചൂടിൽ നീരാവിയായി മുകളിലേക്ക് ഉയർന്നു (Evaporation). തണുത്ത ആകാശത്ത് വെച്ച് മറ്റ് തുള്ളികളുമായി ചേർന്ന് മേഘമായി (Condensation), തുടർന്ന് മഴയായി ഭൂമിയിൽ പെയ്തിറങ്ങി (Precipitation)!`,
        characterBubble: '💧 "Evaporation → Condensation → Precipitation!"',
        malayalamCharacterBubble: '💧 "ബാഷ്പീകരണം → ഘനീഭവിക്കൽ → മഴ പെയ്യൽ!"',
      },
      {
        sceneTitle: 'Scene 2: Keeping Rivers & Forests Clean',
        malayalamSceneTitle: 'രംഗം 2: നദികളും കാടുകളും ശുദ്ധമായി സൂക്ഷിക്കാം',
        illustrationEmoji: '♻️🚮🌱',
        narration: `Wise Hootie the Owl gathered the children: "To keep Piku's river sparkling clean, we must follow the 3 Rs — Reduce waste, Reuse bottles and bags, and Recycle paper and plastic! And never waste a single drop of water!"`,
        malayalamNarration: `ഹുട്ടി മൂങ്ങ കുട്ടികളോട് പറഞ്ഞു: "നമ്മുടെ നദികളും പ്രകൃതിയും മനോഹരമായി സൂക്ഷിക്കാൻ പ്ലാസ്റ്റിക് കുറയ്ക്കാം (Reduce), വീണ്ടും ഉപയോഗിക്കാം (Reuse), പുനരുപയോഗിക്കാം (Recycle)! ഒരു തുള്ളി വെള്ളം പോലും പാഴാക്കരുത്!"`,
        characterBubble: '🦉 "Reduce, Reuse, Recycle to protect Mother Earth!"',
        malayalamCharacterBubble: '🦉 "ഭൂമിയെ സംരക്ഷിക്കാൻ Reduce, Reuse, Recycle ശീലമാക്കാം!"',
      },
    ],
    moral: 'Protecting water, planting trees, and following Reduce-Reuse-Recycle keeps our planet healthy.',
    moralMalayalam: 'ജലം സംരക്ഷിക്കുന്നതും മരങ്ങൾ നടുന്നതും ഭൂമിയെ എപ്പോഴും ഹരിതാഭമായി നിലനിർത്തുന്നു.',
    quizQuestion: {
      question: 'What are the 3 Rs of saving our environment?',
      malayalamQuestion: 'പരിസ്ഥിതി സംരക്ഷണത്തിന്റെ 3 R-കൾ ഏവ?',
      options: ['Reduce, Reuse, Recycle', 'Run, Rest, Repeat', 'Read, Write, Ring'],
      malayalamOptions: ['Reduce, Reuse, Recycle', 'ഓടുക, വിശ്രമിക്കുക, ആവർത്തിക്കുക', 'വായിക്കുക, എഴുതുക, പാടുക'],
      correctIndex: 0,
    },
  },
  {
    id: 'story-ukg',
    title: 'Mimi the Bunny Finds Letter A & 5 Red Apples 🐰🍎',
    malayalamTitle: 'മിമി മുയലും A എന്ന അക്ഷരവും 5 ആപ്പിളുകളും 🐰🍎',
    subjectTag: 'UKG Phonics & Counting',
    emoji: '🐰',
    summary: 'A joyful animated phonics and counting story for UKG learners!',
    characters: [
      { name: 'Mimi the Bunny', malayalamName: 'മിമി മുയൽ', emoji: '🐰', role: 'Happy Hopper', color: 'bg-pink-100 text-pink-800 border-pink-300' },
      { name: 'Hootie the Owl', malayalamName: 'ഹുട്ടി മൂങ്ങ', emoji: '🦉', role: 'Phonics Teacher', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    ],
    scenes: [
      {
        sceneTitle: 'Scene 1: Ah-Ah-Apple Under the Tree!',
        malayalamSceneTitle: 'രംഗം 1: മരച്ചുവട്ടിലെ ചുവന്ന ആപ്പിൾ!',
        illustrationEmoji: '🐰🌳🍎',
        narration: `Little white bunny Mimi hopped through the sunny garden: Hop, hop, hop! Under a big green tree, she saw shiny red apples. Wise Hootie sang: "A is for Apple! Ah-Ah-Apple! And look, tiny Ants are marching too — A is for Ant!"`,
        malayalamNarration: `മിമി എന്ന വെളുത്ത മുയൽക്കുട്ടി തോട്ടത്തിലൂടെ തുള്ളിച്ചാടി നടന്നു! മരച്ചുവട്ടിൽ ചുവന്ന ആപ്പിളുകൾ കണ്ടപ്പോൾ ഹുട്ടി പാടി: "A for Apple! ആ... ആ... ആപ്പിൾ! അടുത്തുള്ള ഉറുമ്പിനും A for Ant!"`,
        characterBubble: '🐰 "Ah-Ah-Apple! A is my favorite letter!"',
        malayalamCharacterBubble: '🐰 "ആ... ആ... ആപ്പിൾ! A എനിക്ക് ഒത്തിരി ഇഷ്ടമായി!"',
      },
      {
        sceneTitle: 'Scene 2: Counting 1, 2, 3, 4, 5 Apples!',
        malayalamSceneTitle: 'രംഗം 2: 1, 2, 3, 4, 5 ആപ്പിളുകൾ എണ്ണാം!',
        illustrationEmoji: '🍎🍎🍎🍎🍎',
        narration: `Mimi put the apples in her basket and counted aloud with her friends: "One 🍎, Two 🍎🍎, Three 🍎🍎🍎, Four 🍎🍎🍎🍎, Five 🍎🍎🍎🍎🍎! Five crunchy red apples to share with everyone!"`,
        malayalamNarration: `മിമി കുട്ടയിലേക്ക് ആപ്പിളുകൾ ഓരോന്നായി എണ്ണിവെച്ചു: "ഒന്ന് 🍎, രണ്ട് 🍎🍎, മൂന്ന് 🍎🍎🍎, നാല് 🍎🍎🍎🍎, അഞ്ച് 🍎🍎🍎🍎🍎! കൂട്ടുകാർക്ക് നൽകാൻ 5 മധുരമുള്ള ആപ്പിളുകൾ!"`,
        characterBubble: '🦉 "1, 2, 3, 4, 5! Sharing makes learning twice as sweet!"',
        malayalamCharacterBubble: '🦉 "1, 2, 3, 4, 5! പങ്കുവെക്കുമ്പോൾ സന്തോഷം ഇരട്ടിയാകും!"',
      },
    ],
    moral: 'Learning letter sounds and counting objects around us is fun when we share with friends!',
    moralMalayalam: 'കൂട്ടുകാരോടൊപ്പം പങ്കുവെച്ച് അക്ഷരങ്ങളും സംഖ്യകളും പഠിക്കുന്നത് എത്ര രസകരമാണ്!',
    quizQuestion: {
      question: 'Which letter does Apple and Ant start with?',
      malayalamQuestion: 'Apple, Ant എന്നീ വാക്കുകൾ തുടങ്ങുന്നത് ഏത് അക്ഷരത്തിലാണ്?',
      options: ['Letter A 🍎', 'Letter Z 🦓', 'Letter M 🐒'],
      malayalamOptions: ['അക്ഷരം A 🍎', 'അക്ഷരം Z 🦓', 'അക്ഷരം M 🐒'],
      correctIndex: 0,
    },
  },
];

export default function StoryTimePage() {
  const router = useRouter();
  const { activeChild, language, speak, stopSpeaking, isSpeaking, addStars } = useApp();

  const [stories, setStories] = useState<Story[]>(PRESET_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story>(PRESET_STORIES[0]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  const [generatingStory, setGeneratingStory] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSolved, setQuizSolved] = useState(false);

  const currentScene = selectedStory.scenes[activeSceneIndex] || selectedStory.scenes[0];

  const handleSelectStory = (story: Story) => {
    soundEffects.playPop();
    stopSpeaking();
    setSelectedStory(story);
    setActiveSceneIndex(0);
    setSelectedAnswer(null);
    setQuizSolved(false);
  };

  const narrateCurrentScene = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const text =
      language === 'ml'
        ? `${currentScene.malayalamSceneTitle}. ${currentScene.malayalamNarration}`
        : `${currentScene.sceneTitle}. ${currentScene.narration}`;
    speak(text);
  };

  const narrateFullStory = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const allScenesText = selectedStory.scenes
      .map((s) => (language === 'ml' ? s.malayalamNarration : s.narration))
      .join(' ');
    const text =
      language === 'ml'
        ? `${selectedStory.malayalamTitle}. ${allScenesText}. ഗുണപാഠം: ${selectedStory.moralMalayalam}`
        : `${selectedStory.title}. ${allScenesText}. Moral of the story: ${selectedStory.moral}`;
    speak(text);
  };

  const handleConvertLessonToStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    soundEffects.playPop();
    setGeneratingStory(true);

    setTimeout(() => {
      const topic = customTopic.trim();
      const newStory: Story = {
        id: `custom-${Date.now()}`,
        title: `The Magical Adventure of ${topic} ✨`,
        malayalamTitle: `${topic} — മാന്ത്രിക പഠന കഥ ✨`,
        subjectTag: 'AI Lesson Story',
        emoji: '🦄',
        summary: `An interactive animated story converting your lesson on "${topic}" into a memorable adventure!`,
        characters: [
          { name: 'Hootie the Owl', malayalamName: 'ഹുട്ടി മൂങ്ങ', emoji: '🦉', role: 'Story Guide', color: 'bg-purple-100 text-purple-800 border-purple-300' },
          { name: activeChild?.name || 'Little Explorer', malayalamName: activeChild?.name || 'കൊച്ചു കൂട്ടുകാരൻ', emoji: '🚀', role: 'Hero Explorer', color: 'bg-sky-100 text-sky-800 border-sky-300' },
          { name: 'Professor Spark', malayalamName: 'പ്രൊഫസർ സ്പാർക്ക്', emoji: '🦊', role: 'Clever Fox', color: 'bg-amber-100 text-amber-800 border-amber-300' },
        ],
        scenes: [
          {
            sceneTitle: `Scene 1: Discovering the Secret of ${topic}`,
            malayalamSceneTitle: `രംഗം 1: ${topic} എന്ന പാഠത്തിന്റെ രഹസ്യം`,
            illustrationEmoji: '🦉📖✨',
            narration: `One sunny morning, ${activeChild?.name || 'our young explorer'} and Hootie the Owl opened a glowing golden textbook in the Enchanted Treehouse. Out popped Professor Spark the Clever Fox! "Today, let's explore ${topic} by seeing how it works in real life!" cheered Hootie.`,
            malayalamNarration: `ഒരു പ്രഭാതത്തിൽ ${activeChild?.name || 'നമ്മുടെ കൊച്ചു കൂട്ടുകാരനും'} ഹുട്ടി മൂങ്ങയും മാന്ത്രിക മരവീട്ടിലിരുന്ന് തിളങ്ങുന്ന പാഠപുസ്തകം തുറന്നു! "${topic} എന്ന പാഠം നമുക്ക് നേരിട്ട് കണ്ട് പഠിക്കാം!" ഹുട്ടി ആവേശത്തോടെ പറഞ്ഞു.`,
            characterBubble: `🦉 "Every big concept in ${topic} starts with a simple question!"`,
            malayalamCharacterBubble: `🦉 "${topic} വളരെ എളുപ്പത്തിൽ നമുക്ക് കഥയിലൂടെ മനസ്സിലാക്കാം!"`,
          },
          {
            sceneTitle: `Scene 2: How ${topic} Works in Nature & Daily Life`,
            malayalamSceneTitle: `രംഗം 2: ${topic} നമ്മുടെ നിത്യജീവിതത്തിൽ`,
            illustrationEmoji: '🌟🔬🌈',
            narration: `As they flew on Hootie's magic carpet, they observed ${topic} in action all around them — in the garden, in the kitchen, and up in the sky! By breaking ${topic} into 3 simple steps, ${activeChild?.name || 'the explorer'} solved the puzzle of the forest gate!`,
            malayalamNarration: `മാന്ത്രിക പരവതാനിയിലൂടെ പറക്കുമ്പോൾ അവർ ചുറ്റുമുള്ള പ്രകൃതിയിൽ ${topic} എങ്ങനെ പ്രവർത്തിക്കുന്നുവെന്ന് നേരിട്ട് കണ്ടു! മൂന്ന് ലളിതമായ ഘട്ടങ്ങളായി പഠിച്ചപ്പോൾ എല്ലാ സംശയങ്ങളും മാറി!`,
            characterBubble: `🦊 "Bravo! Understanding how things work is way better than memorizing!"`,
            malayalamCharacterBubble: `🦊 "കാണാതെ പഠിക്കുന്നതിനേക്കാൾ മനസ്സിലാക്കി പഠിക്കുന്നതാണ് മിടുക്ക്!"`,
          },
        ],
        moral: `When we explore "${topic}" with curiosity and real-life stories, every school lesson becomes an unforgettable adventure!`,
        moralMalayalam: `അന്വേഷണ ബുദ്ധിയോടെ കഥകളിലൂടെ പഠിക്കുമ്പോൾ "${topic}" എന്ന പാഠം ഒരിക്കലും മറക്കില്ല!`,
        quizQuestion: {
          question: `What is the best way to master "${topic}"?`,
          malayalamQuestion: `"${topic}" ഏറ്റവും നന്നായി പഠിക്കാനുള്ള വഴി ഏതാണ്?`,
          options: [
            'Understand it step-by-step with real-life examples & stories',
            'Skip the chapter without reading',
            'Close the book and guess',
          ],
          malayalamOptions: [
            'ഉദാഹരണങ്ങളിലൂടെയും കഥകളിലൂടെയും മനസ്സിലാക്കി പഠിക്കുക',
            'വായിക്കാതെ വിട്ടുകളയുക',
            'ഊഹിച്ചു പറയുക',
          ],
          correctIndex: 0,
        },
      };

      setStories((prev) => [newStory, ...prev]);
      setSelectedStory(newStory);
      setActiveSceneIndex(0);
      setSelectedAnswer(null);
      setQuizSolved(false);
      setCustomTopic('');
      setGeneratingStory(false);
      soundEffects.playStar();
    }, 600);
  };

  const handleAnswerQuiz = (idx: number) => {
    setSelectedAnswer(idx);
    if (idx === selectedStory.quizQuestion.correctIndex) {
      soundEffects.playCorrect();
      if (!quizSolved) {
        setQuizSolved(true);
        addStars(5);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      soundEffects.playIncorrect();
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopSpeaking();
            router.push('/child/dashboard');
          }}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4" />
          <span>AI Story Learning Theatre</span>
        </span>
      </div>

      {/* Convert School Lesson into Story Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-600 rounded-4xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              ✨ AI Story Learning
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              {language === 'ml'
                ? 'പാഠഭാഗങ്ങൾ കഥകളാക്കി മാറ്റാം!'
                : 'Convert School Lessons into Animated Stories!'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-50 mt-1">
              {language === 'ml'
                ? 'സസ്യങ്ങൾ, മൃഗങ്ങൾ, പരിസ്ഥിതി ശാസ്ത്രം, കണക്ക് എന്നിവ കാർട്ടൂൺ കഥാപാത്രങ്ങളിലൂടെ പഠിക്കാം'
                : 'Learn plants, animals, environmental science, and math through enchanting stories with animated characters!'}
            </p>
          </div>
          <span className="text-5xl animate-bounce-gentle">🧚‍♂️📖</span>
        </div>

        {/* Lesson-to-Story Generator Input */}
        <form onSubmit={handleConvertLessonToStory} className="flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder={
              language === 'ml'
                ? 'ഏത് പാഠഭാഗമാണ് കഥയാക്കേണ്ടത്? (ഉദാ: പ്രകാശസംശ്ലേഷണം, സൗരയൂഥം, ഭിന്നസംഖ്യകൾ)...'
                : 'Type any school lesson topic (e.g., Photosynthesis, Solar System, Fractions, Digestive System)...'
            }
            className="flex-1 px-4 py-3 rounded-2xl text-slate-800 font-bold text-xs sm:text-sm outline-none shadow-inner"
          />
          <button
            type="submit"
            disabled={!customTopic.trim() || generatingStory}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg btn-kid-3d disabled:opacity-60 whitespace-nowrap"
          >
            <Wand2 className="w-4 h-4" />
            <span>
              {generatingStory
                ? 'Creating Story...'
                : language === 'ml'
                ? 'കഥയാക്കി മാറ്റൂ ✨'
                : 'Convert Lesson to Story ✨'}
            </span>
          </button>
        </form>
      </div>

      {/* Story Selector Pills */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2">
        {stories.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectStory(s)}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center space-x-2 border-2 ${
              selectedStory.id === s.id
                ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-105'
                : 'bg-white text-slate-700 hover:bg-teal-50 border-slate-200'
            }`}
          >
            <span className="text-lg">{s.emoji}</span>
            <div className="text-left">
              <div className="text-[10px] uppercase opacity-75">{s.subjectTag}</div>
              <div>{language === 'ml' ? s.malayalamTitle : s.title}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Story Stage */}
      <div className="bg-white rounded-5xl p-6 sm:p-10 border-4 border-teal-300 shadow-xl space-y-6">
        {/* Title & Audio Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-100 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-4xl shadow-inner animate-float">
              {selectedStory.emoji}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {selectedStory.subjectTag}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {language === 'ml' ? selectedStory.malayalamTitle : selectedStory.title}
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">{selectedStory.summary}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={narrateCurrentScene}
              className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center space-x-1.5 shadow-md btn-kid-3d ${
                isSpeaking ? 'bg-rose-500 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>
                {isSpeaking
                  ? language === 'ml'
                    ? 'നിർത്തുക'
                    : 'Stop Voice'
                  : language === 'ml'
                  ? 'ഈ രംഗം കേൾക്കാം'
                  : 'Read Scene Aloud'}
              </span>
            </button>

            <button
              onClick={narrateFullStory}
              className="px-4 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-md btn-kid-3d"
            >
              <Play className="w-4 h-4" />
              <span>{language === 'ml' ? 'മുഴുവൻ കഥയും' : 'Full Story'}</span>
            </button>
          </div>
        </div>

        {/* Animated Characters Cast Bar */}
        <div className="space-y-2">
          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
            🎭 {language === 'ml' ? 'കഥാപാത്രങ്ങൾ (Animated Characters):' : 'Story Characters Cast:'}
          </p>
          <div className="flex flex-wrap gap-3">
            {selectedStory.characters.map((char, idx) => (
              <div
                key={idx}
                onClick={() => speak(language === 'ml' ? char.malayalamName : `${char.name}, the ${char.role}`)}
                className={`cursor-pointer px-4 py-2.5 rounded-2xl border-2 flex items-center space-x-2.5 transition transform hover:scale-105 shadow-sm ${char.color}`}
              >
                <span className="text-2xl animate-bounce-gentle">{char.emoji}</span>
                <div>
                  <p className="text-xs font-black">{language === 'ml' ? char.malayalamName : char.name}</p>
                  <p className="text-[10px] font-bold opacity-75">{char.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scene Switcher Tabs */}
        <div className="flex items-center space-x-2">
          {selectedStory.scenes.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playPop();
                setActiveSceneIndex(idx);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                activeSceneIndex === idx
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ml' ? `രംഗം ${idx + 1}` : `Scene ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Active Animated Scene Stage */}
        <div className="bg-gradient-to-br from-teal-50/70 via-emerald-50/50 to-sky-50/70 rounded-4xl p-6 sm:p-8 border-2 border-teal-200 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-teal-900">
              {language === 'ml' ? currentScene.malayalamSceneTitle : currentScene.sceneTitle}
            </h3>
            <div className="text-3xl sm:text-4xl tracking-widest bg-white px-4 py-2 rounded-2xl shadow-sm border border-teal-100 animate-pulse">
              {currentScene.illustrationEmoji}
            </div>
          </div>

          <p className="text-slate-700 text-base sm:text-lg font-semibold leading-relaxed">
            {language === 'ml' ? currentScene.malayalamNarration : currentScene.narration}
          </p>

          {/* Animated Character Speech Bubble */}
          <div className="bg-white rounded-3xl p-4 border-2 border-amber-300 shadow-md flex items-center space-x-3">
            <span className="text-3xl animate-bounce-gentle">{selectedStory.characters[0]?.emoji || '🦉'}</span>
            <p className="text-xs sm:text-sm font-black text-slate-800 italic">
              {language === 'ml' ? currentScene.malayalamCharacterBubble : currentScene.characterBubble}
            </p>
          </div>
        </div>

        {/* Moral of the Story */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 flex items-start space-x-3">
          <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black uppercase text-amber-800">
              {language === 'ml' ? 'ഈ കഥയിൽ നിന്ന് നമ്മൾ പഠിച്ചത്:' : 'Key Concept & Moral Learned:'}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
              {language === 'ml' ? selectedStory.moralMalayalam : selectedStory.moral}
            </p>
          </div>
        </div>

        {/* Story Star Question (Mini Quiz) */}
        <div className="bg-indigo-50/60 border-2 border-indigo-200 rounded-4xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{language === 'ml' ? 'കഥയിലെ ചോദ്യം (+5 നക്ഷത്രങ്ങൾ)' : 'Story Star Check (+5 Stars ⭐)'}</span>
            </span>
            {quizSolved && (
              <span className="text-xs font-black text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>+5 Stars Earned!</span>
              </span>
            )}
          </div>

          <h4 className="text-base sm:text-lg font-black text-slate-800">
            {language === 'ml'
              ? selectedStory.quizQuestion.malayalamQuestion
              : selectedStory.quizQuestion.question}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(language === 'ml'
              ? selectedStory.quizQuestion.malayalamOptions
              : selectedStory.quizQuestion.options
            ).map((opt, idx) => {
              const isCorrect = idx === selectedStory.quizQuestion.correctIndex;
              const isSelected = selectedAnswer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-black text-left border-2 transition ${
                    isSelected
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
