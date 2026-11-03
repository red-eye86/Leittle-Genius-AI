'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Volume2, Sparkles, Heart } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { soundEffects } from '@/lib/audio/soundEffects';

interface Story {
  id: string;
  title: string;
  malayalamTitle: string;
  emoji: string;
  summary: string;
  content: string;
  malayalamContent: string;
  moral: string;
  moralMalayalam: string;
}

const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'The Little Water Drop Who Flew to the Clouds 💧',
    malayalamTitle: 'മേഘങ്ങളിലേക്ക് പറന്ന കൊച്ചു തുള്ളി 💧',
    emoji: '🌧️',
    summary: 'A journey through the magical water cycle!',
    content: `Once upon a time in a sunny village in Kerala, there lived a joyful little raindrop named Piku. Piku lived in the gentle Periyar river. One hot sunny afternoon, the Golden Sun shone warm light over the water.
    
    Suddenly, Piku felt light as a feather! "Look at me! I am floating into the sky!" cheered Piku. This was called Evaporation.
    
    High up in the cool sky, Piku met millions of other friendly water vapor drops. They hugged tightly together to form a fluffy, cottony white cloud! This was Condensation.
    
    Soon the cloud grew heavy and dark gray with laughter. "Time to go home to the green trees!" shouted the drops. With a gentle whoosh of cool wind, Piku fell as refreshing rain, watering the coconut trees and dancing on lotus leaves! This was Precipitation.
    
    Piku laughed happily: "I can travel to the sky and come back again and again!"`,
    malayalamContent: `കേരളത്തിലെ ഒരു മനോഹരമായ ഗ്രാമത്തിൽ, പെരിയാർ നദിയിൽ പിക്കു എന്നൊരു കൊച്ചു ജലത്തുള്ളി ജീവിച്ചിരുന്നു. ഒരു ദിവസം ഉച്ചയ്ക്ക് നല്ല വെയിൽ വന്നു.
    
    സൂര്യന്റെ ചൂടിൽ പിക്കു പതുക്കെ ഒരു പഞ്ഞിത്തുള്ളി പോലെ ആകാശത്തേക്ക് ഉയർന്നു! ഇതിനെയാണ് ബാഷ്പീകരണം (Evaporation) എന്ന് വിളിക്കുന്നത്.
    
    തണുത്ത ആകാശത്തിൽ എത്തിയപ്പോൾ പിക്കു മറ്റ് കൂട്ടുകാരെ കണ്ടുമുട്ടി. അവർ പരസ്പരം കെട്ടിപ്പിടിച്ച് വെളുത്ത പഞ്ഞിക്കെട്ട് പോലുള്ള വലിയ മേഘങ്ങളായി മാറി! ഇതാണ് ഘനീഭവിക്കൽ (Condensation).
    
    മേഘങ്ങൾ കറുത്തു തുടുത്തു. "നമുക്ക് താഴെയുള്ള തെങ്ങിൻ തോപ്പുകളിലേക്ക് മടങ്ങാം!" എന്ന് പറഞ്ഞ് തണുത്ത കാറ്റോടൊപ്പം അവർ ചാറ്റൽ മഴയായി ഭൂമിയിലേക്ക് പെയ്തിറങ്ങി! ഇതാണ് മഴ പെയ്യൽ (Precipitation).
    
    താമരയിലകളിൽ തുള്ളിച്ചാടി പിക്കു പറഞ്ഞു: "ഞാൻ വീണ്ടും ആകാശത്തേക്ക് യാത്ര ചെയ്യും, വീണ്ടും മഴയായി വരും!"`,
    moral: 'Water is precious and always travels in a continuous circle of life.',
    moralMalayalam: 'ജലം വിലപ്പെട്ടതാണ്, അത് എപ്പോഴും പ്രകൃതിയിൽ പുനർജനിച്ചു കൊണ്ടിരിക്കുന്നു.',
  },
  {
    id: 'story-2',
    title: 'Mimi the Bunny Finds Letter A 🍎',
    malayalamTitle: 'മിമി മുയലും A എന്ന അക്ഷരവും 🍎',
    emoji: '🐰',
    summary: 'A joyful phonics adventure for little learners!',
    content: `Little white bunny Mimi loved hopping through the garden. One morning, under a big shady tree, she saw something round, bright red, and shiny!
    
    "What is this?" asked Mimi.
    Wise Hootie the Owl swooped down: "That is an Apple! It starts with the letter A! Ah-Ah-Apple!"
    
    Mimi took a crunchy bite: "Yum! Ah-Ah-Apple!" Next she saw a tiny marching Ant. "Does Ant start with A too?" asked Mimi.
    "Yes!" cheered Hootie. "You are learning Phonics!"`,
    malayalamContent: `മിമി എന്ന വെളുത്ത മുയൽക്കുട്ടി തോട്ടത്തിലൂടെ തുള്ളിച്ചാടി നടക്കുകയായിരുന്നു. ഒരു വലിയ മരത്തിന്റെ താഴെ അവൾ ചുവന്നു തുടുത്ത ഒരു പഴം കണ്ടു.
    
    "ഇതെന്താണ്?" മിമി അത്ഭുതപ്പെട്ടു.
    ഹുട്ടി മൂങ്ങ പറന്നു വന്നു പറഞ്ഞു: "അതാണ് ആപ്പിൾ (Apple)! അത് തുടങ്ങുന്നത് A യിലാണ്! ആ... ആ... ആപ്പിൾ!"
    
    മിമി സന്തോഷത്തോടെ അത് കടിച്ചുകൊണ്ട് പറഞ്ഞു: "നല്ല രുചി!" അപ്പോഴാണ് വഴിയിലൂടെ ഒരു ഉറുമ്പ് (Ant) പോകുന്നത് കണ്ടത്.
    "ഉറുമ്പും A യിലാണോ തുടങ്ങുന്നത്?" മിമി ചോദിച്ചു.
    "അതെ മിടുക്കി!" ഹുട്ടി സന്തോഷത്തോടെ ചിറകടിച്ചു.`,
    moral: 'Curiosity helps us discover magic in everyday objects.',
    moralMalayalam: 'അന്വേഷണ ബുദ്ധിയാണ് നമ്മെ പുതിയ കാര്യങ്ങൾ പഠിക്കാൻ സഹായിക്കുന്നത്.',
  },
];

export default function StoryTimePage() {
  const router = useRouter();
  const { activeChild, language, t, speak } = useApp();
  const [selectedStory, setSelectedStory] = useState<Story>(STORIES[0]);

  const readStory = () => {
    const text = language === 'ml'
      ? `${selectedStory.malayalamTitle}. ${selectedStory.malayalamContent}`
      : `${selectedStory.title}. ${selectedStory.content}`;
    speak(text);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/child/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-black text-slate-500 hover:text-slate-800 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ml' ? 'ഹോം' : 'Dashboard'}</span>
        </button>

        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Illustrated Stories</span>
        </span>
      </div>

      {/* Story Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {STORIES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              soundEffects.playPop();
              setSelectedStory(s);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center space-x-2 ${
              selectedStory.id === s.id
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>{s.emoji}</span>
            <span>{language === 'ml' ? s.malayalamTitle : s.title}</span>
          </button>
        ))}
      </div>

      {/* Story Display Card */}
      <div className="bg-white rounded-5xl p-6 sm:p-10 border-4 border-teal-300 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-100 gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">{selectedStory.emoji}</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                {language === 'ml' ? selectedStory.malayalamTitle : selectedStory.title}
              </h2>
              <p className="text-xs font-bold text-teal-600 mt-0.5">
                {selectedStory.summary}
              </p>
            </div>
          </div>

          <button
            onClick={readStory}
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md btn-kid-3d flex-shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'ml' ? 'കഥ കേൾക്കാം' : 'Narrate Story'}</span>
          </button>
        </div>

        <div className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line space-y-4">
          {language === 'ml' ? selectedStory.malayalamContent : selectedStory.content}
        </div>

        {/* Moral of the story */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-3xl p-5 flex items-start space-x-3">
          <Sparkles className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black uppercase text-teal-800">
              {language === 'ml' ? 'ഗുണപാഠം' : 'Lesson Learned:'}
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-0.5">
              {language === 'ml' ? selectedStory.moralMalayalam : selectedStory.moral}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

