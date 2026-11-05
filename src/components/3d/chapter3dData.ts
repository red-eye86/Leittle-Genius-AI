import { TextbookChapter, Subject } from '@/lib/db/types';

export type DioramaTheme =
  | 'history_archaeology'
  | 'timeline_calendar'
  | 'civics_citizenship'
  | 'earth_landforms'
  | 'globe_compass_map'
  | 'water_climate_dam'
  | 'plants_forest_soil'
  | 'agriculture_industry'
  | 'transport_comm'
  | 'heritage_monuments'
  | 'eco_recycling'
  | 'nutrition_food'
  | 'teeth_digestion'
  | 'animals_habitats'
  | 'matter_states'
  | 'machines_force'
  | 'solar_space'
  | 'math_abacus'
  | 'math_fractions'
  | 'math_geometry_clock'
  | 'coding_cyber_lab'
  | 'kerala_culture'
  | 'language_storybook';

export type ModelType3D =
  | 'carbs_energy'
  | 'proteins_body'
  | 'vitamins_protect'
  | 'food_pyramid'
  | 'food_preservation'
  | 'tooth_jaw'
  | 'tooth_cross_section'
  | 'digestive_system'
  | 'leaf_photosynthesis'
  | 'plant_cactus'
  | 'plant_pine'
  | 'plant_lotus'
  | 'animal_camel'
  | 'animal_polar'
  | 'animal_aquatic'
  | 'matter_molecules'
  | 'matter_change'
  | 'matter_beaker'
  | 'water_cycle'
  | 'weather_breeze'
  | 'water_filter'
  | 'force_magnet'
  | 'solar_energy'
  | 'solar_planets'
  | 'grammar_stage'
  | 'literature_book'
  | 'phonics_abc'
  | 'abacus_count'
  | 'ukg_senses'
  | 'monument'
  | 'coins'
  | 'scroll'
  | 'hourglass'
  | 'magnifier'
  | 'globe'
  | 'compass'
  | 'mountain'
  | 'river_dam'
  | 'tree_leaf'
  | 'tooth'
  | 'food_plate'
  | 'train_transport'
  | 'satellite'
  | 'recycle_bin'
  | 'abacus'
  | 'fraction_pie'
  | 'clock'
  | 'lever_machine'
  | 'book_stage'
  | 'flag_parliament'
  | 'trophy_star'
  // New realistic chapter-matched 3D templates:
  | 'computer_memory_ram'
  | 'desktop_os_gui'
  | 'word_processor_doc'
  | 'flowchart_algorithm'
  | 'presentation_stage'
  | 'scratch_block_coding'
  | 'ai_humanoid_robot'
  | 'secret_garden_key'
  | 'pied_piper_flute'
  | 'isro_mars_rocket'
  | 'tom_paint_fence'
  | 'heidi_alps_goats'
  | 'kalam_missile_island'
  | 'magic_brass_pot'
  | 'udan_khatola_flying'
  | 'birbal_royal_throne'
  | 'unity_doves_net'
  | 'kerala_snake_boat'
  | 'changathi_garden_bugs'
  | 'malayalam_vowels_elephant'
  | 'ukg_sweet_home_school'
  | 'ukg_community_helpers'
  | 'ukg_traffic_safety'
  | 'ukg_heavy_light_seesaw'
  | 'shapes_3d_geometry'
  | 'moral_gratitude_shrine'
  | 'moral_honesty_scales'
  | 'moral_kindness_heart';

export interface TopicDetail {
  index: number;
  title: string;
  shortLabel: string;
  emoji: string;
  explanationEn: string;
  explanationMl: string;
  funFactEn: string;
  funFactMl: string;
  materialNote: string;
  environmentPreset: 'nature' | 'heritage' | 'science_lab' | 'cyber_tech' | 'ocean' | 'alpine' | 'playroom';
  modelType: ModelType3D;
}

/**
 * Ensures every chapter has 4-5 rich topics even if the syllabus chapter only defines keyTerms/learningObjectives.
 */
export function getChapterTopicsList(chapter?: TextbookChapter | null): string[] {
  if (!chapter) return ['Interactive 3D Concept'];
  if (chapter.topics && chapter.topics.length > 0) {
    return chapter.topics;
  }
  const built: string[] = [chapter.title];
  if (chapter.learningObjectives && chapter.learningObjectives.length > 0) {
    built.push(...chapter.learningObjectives);
  }
  if (chapter.keyTerms && chapter.keyTerms.length > 0) {
    const termsChunk1 = chapter.keyTerms.slice(0, 3).join(', ');
    const termsChunk2 = chapter.keyTerms.slice(3, 6).join(', ');
    if (termsChunk1) built.push(`Core Concepts: ${termsChunk1}`);
    if (termsChunk2) built.push(`Key Vocabulary: ${termsChunk2}`);
  }
  return built.slice(0, 5);
}

export function getChapterDioramaTheme(chapter: TextbookChapter, subject?: Subject | null): DioramaTheme {
  const id = chapter.id.toLowerCase();
  const text = `${chapter.title} ${chapter.summary} ${(chapter.topics || []).join(' ')}`.toLowerCase();

  if (id.includes('cod') || subject?.id.includes('coding') || text.includes('robot') || text.includes('ram')) {
    return 'coding_cyber_lab';
  }
  if (id.includes('mal') || text.includes('കഥകളി') || text.includes('വള്ളംകളി')) {
    return 'kerala_culture';
  }
  if (id === 'chap-c4-soc-1' || text.includes('archaeolog') || text.includes('evidences in history')) {
    return 'history_archaeology';
  }
  if (id === 'chap-c4-soc-2' || text.includes('almanac') || text.includes('timeline') || text.includes('calendar')) {
    return 'timeline_calendar';
  }
  if (id === 'chap-c4-soc-3' || text.includes('citizen') || text.includes('civic') || text.includes('election')) {
    return 'civics_citizenship';
  }
  if (id === 'chap-c4-soc-4' || id === 'chap-c4-soc-6' || text.includes('landform') || text.includes('himalaya') || text.includes('physical division')) {
    return 'earth_landforms';
  }
  if (id === 'chap-c4-soc-5' || text.includes('globe') || text.includes('cardinal direction') || text.includes('atlas')) {
    return 'globe_compass_map';
  }
  if (id === 'chap-c4-soc-7' || id === 'chap-c4-sci-6' || text.includes('monsoon') || text.includes('water cycle') || text.includes('rainwater')) {
    return 'water_climate_dam';
  }
  if (id === 'chap-c4-soc-8' || id === 'chap-c4-sci-3' || text.includes('photosynthesis') || text.includes('alluvial') || text.includes('forest')) {
    return 'plants_forest_soil';
  }
  if (id === 'chap-c4-soc-9' || text.includes('kharif') || text.includes('mineral') || text.includes('cottage industry')) {
    return 'agriculture_industry';
  }
  if (id === 'chap-c4-soc-10' || text.includes('transport') || text.includes('railway') || text.includes('communication')) {
    return 'transport_comm';
  }
  if (id === 'chap-c4-soc-11' || text.includes('heritage') || text.includes('kathakali') || text.includes('taj mahal')) {
    return 'heritage_monuments';
  }
  if (id === 'chap-c4-soc-12' || text.includes('pollution') || text.includes('biodegradable') || text.includes('recycle')) {
    return 'eco_recycling';
  }
  if (id === 'chap-c4-sci-1' || text.includes('carbohydrate') || text.includes('balanced diet') || text.includes('nutrition')) {
    return 'nutrition_food';
  }
  if (id === 'chap-c4-sci-2' || text.includes('teeth') || text.includes('incisor') || text.includes('digestive')) {
    return 'teeth_digestion';
  }
  if (id === 'chap-c4-sci-4' || text.includes('adaptation') || text.includes('habitat') || text.includes('amphibian')) {
    return 'animals_habitats';
  }
  if (id === 'chap-c4-sci-5' || text.includes('solid') || text.includes('liquid') || text.includes('molecule')) {
    return 'matter_states';
  }
  if (id === 'chap-c4-sci-7' || text.includes('force') || text.includes('pulley') || text.includes('lever')) {
    return 'machines_force';
  }
  if (id === 'chap-c4-sci-8' || text.includes('solar system') || text.includes('planet')) {
    return 'solar_space';
  }
  if (text.includes('fraction') || text.includes('numerator') || text.includes('half')) {
    return 'math_fractions';
  }
  if (text.includes('geometry') || text.includes('perimeter') || text.includes('clock') || text.includes('shape')) {
    return 'math_geometry_clock';
  }
  if (subject?.id.includes('math') || text.includes('number') || text.includes('addition') || text.includes('multiplication')) {
    return 'math_abacus';
  }

  return 'language_storybook';
}

export function getTopicDetail(
  chapter: TextbookChapter,
  topic: string,
  index: number
): TopicDetail {
  const id = chapter.id.toLowerCase();
  const tLower = topic.toLowerCase();
  const cLower = `${chapter.title} ${chapter.summary}`.toLowerCase();
  const combined = `${tLower} ${cLower}`;

  const withDefaults = (partial: Omit<TopicDetail, 'materialNote' | 'environmentPreset'> & {
    materialNote?: string;
    environmentPreset?: TopicDetail['environmentPreset'];
  }): TopicDetail => ({
    materialNote: partial.materialNote || 'PBR Physical Surface • Bump & Specular Reflections',
    environmentPreset: partial.environmentPreset || 'science_lab',
    ...partial,
  });

  // ===========================================================================
  // 1. CODING & AI (Coding Capers 4) — Exact Chapter & Topic 3D Matches
  // ===========================================================================
  if (id === 'chap-c4-cod-1' || combined.includes('ram') || combined.includes('binary') || combined.includes('hard disk')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'RAM, CPU & Storage 3D',
      emoji: '💾',
      explanationEn:
        'Computers store data as binary 0s and 1s (8 Bits = 1 Byte)! Primary memory includes high-speed RAM (Volatile) and ROM (Non-Volatile) on the motherboard, while Secondary Storage includes SSDs, Hard Disks, and USB Pen Drives.',
      explanationMl:
        'കമ്പ്യൂട്ടർ വിവരങ്ങൾ 0, 1 എന്നീ ബൈനറി അക്കങ്ങളായാണ് സൂക്ഷിക്കുന്നത്. മദർബോർഡിലെ RAM, ROM എന്നിവ പ്രൈമറി മെമ്മറിയും ഹാർഡ് ഡിസ്ക്, പെൻഡ്രൈവ് എന്നിവ സെക്കൻഡറി സ്റ്റോറേജുമാണ്.',
      funFactEn: '3D Model: Inspect the Gold-Plated PCB RAM Stick, Silicon CPU Core & USB Flash Drive!',
      funFactMl: '3D മോഡൽ: മദർബോർഡ് റാം (RAM), സിപിയു ചിപ്പ്, പെൻഡ്രൈവ് എന്നിവ 3D-യിൽ കാണാം!',
      materialNote: 'PBR Emerald Fiberglass PCB + Brushed Gold Contacts + Anodized Aluminum Heatspreader',
      environmentPreset: 'cyber_tech',
      modelType: 'computer_memory_ram',
    });
  }

  if (id === 'chap-c4-cod-2' || combined.includes('operating system') || combined.includes('taskbar') || combined.includes('desktop')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'OS & Desktop GUI 3D',
      emoji: '🖥️',
      explanationEn:
        'The Operating System (Windows / macOS / Linux) manages computer hardware and software! Its Graphical User Interface (GUI) gives us a Desktop screen, Taskbar, Start Menu, Organized Folders, Files, and the Recycle Bin.',
      explanationMl:
        'കമ്പ്യൂട്ടറിനെ നിയന്ത്രിക്കുന്ന പ്രധാന പ്രോഗ്രാമാണ് ഓപ്പറേറ്റിംഗ് സിസ്റ്റം. ഡെസ്ക്ടോപ്പ്, ടാസ്ക്ബാർ, ഫയലുകൾ, ഫോൾഡറുകൾ എന്നിവ ഇതിലൂടെ കൈകാര്യം ചെയ്യാം.',
      funFactEn: '3D Model: Explore the 3D Widescreen Monitor, Glowing Windows GUI, Folders & RGB Keyboard!',
      funFactMl: '3D മോഡൽ: 3D കമ്പ്യൂട്ടർ മോണിറ്ററും വിൻഡോസ് ഫോൾഡറുകളും കീബോർഡും!',
      materialNote: 'PBR Glass Display Panel + Matte Polycarbonate Bezel + Metallic Stand',
      environmentPreset: 'cyber_tech',
      modelType: 'desktop_os_gui',
    });
  }

  if (id === 'chap-c4-cod-3' || combined.includes('word processor') || combined.includes('font styling')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Word Document Studio',
      emoji: '📝',
      explanationEn:
        'Word Processing tools let us create, edit, and format rich documents! Use Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U), custom Fonts, Bullet Lists, and Left/Center/Right/Justify text alignment.',
      explanationMl:
        'വേർഡ് പ്രോസസ്സർ ഉപയോഗിച്ച് മനോഹരമായ ലേഖനങ്ങൾ തയ്യാറാക്കാം. ഫോണ്ടുകൾ മാറ്റാനും ബോൾഡ്, ഇറ്റാലിക്, ബുള്ളറ്റ് പോയിന്റുകൾ നൽകാനും ഇത് സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Floating Document Sheet, Bold/Italic 3D Typography & Stylus!',
      funFactMl: '3D മോഡൽ: 3D ഡോക്യുമെന്റ് പേജും ഫോർമാറ്റിംഗ് ടൂൾബാറും!',
      materialNote: 'Textured Paper Sheet + Glossy 3D Typography Blocks + Brushed Metal Pen',
      environmentPreset: 'cyber_tech',
      modelType: 'word_processor_doc',
    });
  }

  if (id === 'chap-c4-cod-4' || combined.includes('algorithm') || combined.includes('flowchart')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Flowchart & Logic',
      emoji: '🔀',
      explanationEn:
        'An Algorithm is a step-by-step logical procedure to solve a problem! A Flowchart visualizes an algorithm using geometric blocks: Start/Stop (Oval), Input/Output (Parallelogram), Process (Rectangle), and Decision (Diamond).',
      explanationMl:
        'ഒരു പ്രശ്നം പരിഹരിക്കാനുള്ള ഘട്ടംഘട്ടമായുള്ള നിർദ്ദേശങ്ങളാണ് അൽഗോരിതം. ഇതിനെ ചിത്രരൂപത്തിൽ കാണിക്കുന്നതാണ് ഫ്ലോചാർട്ട് (Flowchart).',
      funFactEn: '3D Model: Trace the Glowing 3D Flowchart Nodes — Start → Input → Process → Decision Diamond!',
      funFactMl: '3D മോഡൽ: പ്രകാശിക്കുന്ന 3D ഫ്ലോചാർട്ട് ബ്ലോക്കുകളും ലോജിക് പാതകളും!',
      materialNote: 'Anodized Neon Logic Blocks + Emissive Data Conduits',
      environmentPreset: 'cyber_tech',
      modelType: 'flowchart_algorithm',
    });
  }

  if (id === 'chap-c4-cod-5' || combined.includes('presentation') || combined.includes('slide show')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Slide Projector Stage',
      emoji: '📽️',
      explanationEn:
        'Presentation software (PowerPoint / Slides) communicates ideas using visual slides, themes, 3D charts, animations, and smooth slide transitions! Press F5 to launch your full-screen Slide Show.',
      explanationMl:
        'ചിത്രങ്ങളും ചാർട്ടുകളും ആനിമേഷനുകളും ഉൾപ്പെടുത്തി മനോഹരമായ ഡിജിറ്റൽ സ്ലൈഡ് ഷോകൾ നിർമ്മിക്കാൻ പ്രസന്റേഷൻ സോഫ്റ്റ്‌വെയർ സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Holographic Slide Projector, 3D Bar Chart & Presentation Screen!',
      funFactMl: '3D മോഡൽ: 3D പ്രൊജക്ടറും ഹോളോഗ്രാഫിക് സ്ലൈഡ് സ്ക്രീനും!',
      materialNote: 'Optical Glass Projector Lens + Translucent Hologram Screen',
      environmentPreset: 'cyber_tech',
      modelType: 'presentation_stage',
    });
  }

  if (id === 'chap-c4-cod-6' || combined.includes('block coding') || combined.includes('sprite') || combined.includes('scratch')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Visual Coding Blocks',
      emoji: '🧩',
      explanationEn:
        'Visual Block Coding lets you program animations and games by snapping interlocking puzzle blocks together! Use Events ("When Green Flag Clicked"), Motion ("Move 10 Steps"), and Control ("Repeat 10 Loop") to animate your 3D Sprite!',
      explanationMl:
        'പസിൽ ബ്ലോക്കുകൾ പരസ്പരം യോജിപ്പിച്ച് ഗെയിമുകളും ആനിമേഷനുകളും നിർമ്മിക്കുന്ന രീതിയാണ് ബ്ലോക്ക് കോഡിംഗ് (Block Coding).',
      funFactEn: '3D Model: Explore the Interlocking 3D Code Blocks, Green Flag Trigger & Animated Sprite!',
      funFactMl: '3D മോഡൽ: പരസ്പരം ചേരുന്ന 3D കോഡിംഗ് ബ്ലോക്കുകളും ഗ്രീൻ ഫ്ലാഗും സ്പ്രൈറ്റും!',
      materialNote: 'Glossy ABS Plastic Coding Blocks + Metallic Flag Pole',
      environmentPreset: 'cyber_tech',
      modelType: 'scratch_block_coding',
    });
  }

  if (id === 'chap-c4-cod-7' || combined.includes('artificial intelligence') || combined.includes('robotics') || combined.includes('sensor')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D AI Humanoid Robot',
      emoji: '🤖',
      explanationEn:
        'Artificial Intelligence (AI) enables machines to learn, see, listen, and make smart decisions! A Robot combines Sensors (eyes & ears to detect obstacles), an AI Controller (brain), and Actuators (servo motors & arms to act).',
      explanationMl:
        'മനുഷ്യരെപ്പോലെ ചിന്തിക്കാനും പഠിക്കാനും യന്ത്രങ്ങളെ പ്രാപ്തമാക്കുന്ന സാങ്കേതികവിദ്യയാണ് ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് (AI). സെൻസറുകളും മോട്ടോറുകളും ഉപയോഗിച്ച് റോബോട്ടുകൾ പ്രവർത്തിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the Realistic 3D AI Humanoid Robot with Optical Sensors & Neural Core!',
      funFactMl: '3D മോഡൽ: സെൻസർ കണ്ണുകളും ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് ബ്രെയിനുമുള്ള 3D റോബോട്ട്!',
      materialNote: 'Titanium White Ceramic Armor + Carbon Fiber Joints + Glowing Cyan Optics',
      environmentPreset: 'cyber_tech',
      modelType: 'ai_humanoid_robot',
    });
  }

  // ===========================================================================
  // 2. ENGLISH LITERATURE (FOCUS 4) — Exact Chapter 3D Story Dioramas
  // ===========================================================================
  if (id === 'chap-c4-foc-1' || combined.includes('secret garden') || combined.includes('brass key')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'The Secret Garden & Key',
      emoji: '🗝️',
      explanationEn:
        'In "The Key to the Garden", young Mary Lennox follows a friendly red Robin bird and unearths an ancient brass key that unlocks a hidden ivy-covered door to a magical blooming rose garden!',
      explanationMl:
        'മണ്ണിൽ പുതഞ്ഞുകിടന്ന പിച്ചള താക്കോൽ കണ്ടെത്തി രഹസ്യ പൂന്തോട്ടത്തിന്റെ വാതിൽ തുറക്കുന്ന മേരിയുടെ മനോഹരമായ കഥ.',
      funFactEn: '3D Model: Inspect the Antique Ornate Brass Key, Ivy Stone Archway, Blooming Roses & Robin Bird!',
      funFactMl: '3D മോഡൽ: പുരാതന പിച്ചള താക്കോലും പൂന്തോട്ട കവാടവും റോസാപ്പൂക്കളും!',
      materialNote: 'Aged Antique Brass + Mossy Carved Stone + Velvet Rose Petals',
      environmentPreset: 'nature',
      modelType: 'secret_garden_key',
    });
  }

  if (id === 'chap-c4-foc-2' || combined.includes('pied piper') || combined.includes('hamelin')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Pied Piper’s Magic Flute',
      emoji: '🪈',
      explanationEn:
        'In "The Pied Piper of Hamelin", the mysterious piper dressed in red and yellow plays a mesmerizing melody on his golden pipe to lead the rats away, teaching the greedy Mayor the timeless value of keeping promises!',
      explanationMl:
        'മാന്ത്രിക ഓടക്കുഴൽ വായിച്ച് ഹാംലിൻ പട്ടണത്തെ രക്ഷിച്ച പൈഡ് പൈപ്പറുടെ കഥ — നൽകിയ വാക്ക് പാലിക്കേണ്ടതിന്റെ പ്രാധാന്യം.',
      funFactEn: '3D Model: Rotate the 3D Golden Magic Flute, Medieval Hamelin Tower & Floating Musical Notes!',
      funFactMl: '3D മോഡൽ: മാന്ത്രിക സുവർണ്ണ ഓടക്കുഴലും ഹാംലിൻ ഗോപുരവും സംഗീത സ്വരങ്ങളും!',
      materialNote: 'Polished Gold Flute + Medieval Brick Masonry + Glowing Music Symbols',
      environmentPreset: 'heritage',
      modelType: 'pied_piper_flute',
    });
  }

  if (id === 'chap-c4-foc-3' || combined.includes('mangalyaan') || combined.includes('isro') || combined.includes('rocket women')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'ISRO Mangalyaan & Mars',
      emoji: '🚀',
      explanationEn:
        '"The Rocket Women of India" celebrates the brilliant women scientists of ISRO who guided India’s Mars Orbiter Mission (Mangalyaan) into orbit around the Red Planet Mars on the very first attempt!',
      explanationMl:
        'ഇന്ത്യയുടെ അഭിമാനമായ മംഗൾയാൻ പേടകത്തെ ചൊവ്വയുടെ ഭ്രമണപഥത്തിൽ എത്തിച്ച ഐ.എസ്.ആർ.ഒ (ISRO) വനിതാ ശാസ്ത്രജ്ഞരുടെ വീരഗാഥ.',
      funFactEn: '3D Model: Explore the Golden Foil Mangalyaan Spacecraft, Solar Array & Rusty Red Planet Mars!',
      funFactMl: '3D മോഡൽ: ഐ.എസ്.ആർ.ഒ മംഗൾയാൻ പേടകവും ചുവന്ന ഗ്രഹമായ ചൊവ്വയും 3D-യിൽ!',
      materialNote: 'Multi-Layer Gold Thermal Foil + Photovoltaic Solar Cells + Red Iron-Oxide Mars Terrain',
      environmentPreset: 'science_lab',
      modelType: 'isro_mars_rocket',
    });
  }

  if (id === 'chap-c4-foc-4' || combined.includes('tom paints') || combined.includes('tom sawyer') || combined.includes('whitewash')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Tom’s Whitewashed Fence',
      emoji: '🖌️',
      explanationEn:
        'In Mark Twain’s "Tom Paints the Fence", clever Tom Sawyer turns his Saturday chore of whitewashing Aunt Polly’s wooden fence into an exciting game, convincing his friends to trade their best treasures for a turn with the brush!',
      explanationMl:
        'വേലിക്ക് വെള്ളയടിക്കുന്ന ജോലി ഒരു രസകരമായ കളിയാക്കി മാറ്റി കൂട്ടുകാരെക്കൊണ്ട് സന്തോഷത്തോടെ ചെയ്യിച്ച ടോം സോയറിന്റെ ബുദ്ധിസാമർത്ഥ്യം.',
      funFactEn: '3D Model: Inspect the 3D Wooden Picket Fence, White Paint Bucket, Bristle Brush & Red Apple!',
      funFactMl: '3D മോഡൽ: മരവേലിയും പെയിന്റ് ബക്കറ്റും ബ്രഷും ചുവന്ന ആപ്പിളും!',
      materialNote: 'Weathered Cedar Wood Grain + Glossy White Enamel Paint + Galvanized Metal Bucket',
      environmentPreset: 'nature',
      modelType: 'tom_paint_fence',
    });
  }

  if (id === 'chap-c4-foc-5' || combined.includes('heidi') || combined.includes('swiss alps') || combined.includes('goatherd')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Heidi’s Swiss Alps',
      emoji: '🏔️',
      explanationEn:
        'In Johanna Spyri’s classic "Out with the Goats", little Heidi climbs the sunlit Swiss Alps with Peter and the mountain goats, breathing fresh alpine air amidst snow peaks, pine trees, and golden eagles.',
      explanationMl:
        'മഞ്ഞുമൂടിയ ആൽപ്സ് പർവ്വതനിരകളിലൂടെ ആട്ടിൻകൂട്ടങ്ങളോടൊപ്പം നടക്കുന്ന കൊച്ചു ഹെയ്ഡിയുടെ പ്രകൃതിസൗന്ദര്യം നിറഞ്ഞ കഥ.',
      funFactEn: '3D Model: Explore the 3D Alpine Mountain Chalet, Snow Peaks, Pine Trees & Mountain Goat!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുമൂടിയ ആൽപ്സ് മലനിരകളും മരവീടും പൈൻ മരങ്ങളും!',
      materialNote: 'Alpine Granite Rock + Fresh Snow Powder + Timber Chalet Wood',
      environmentPreset: 'alpine',
      modelType: 'heidi_alps_goats',
    });
  }

  if (id === 'chap-c4-foc-6' || combined.includes('kalam') || combined.includes('rameswaram') || combined.includes('missile man')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Young Kalam & Rocketry',
      emoji: '🛰️',
      explanationEn:
        '"Young Kalam: The Boy from Rameswaram" tells how Dr. A.P.J. Abdul Kalam distributed newspapers as a boy by the sea in Rameswaram, watched seabirds soar, studied aerospace engineering, and became India’s beloved Missile Man & President!',
      explanationMl:
        'രാമേശ്വരത്ത് പത്രവിതരണം നടത്തി പഠിച്ച് ഇന്ത്യയുടെ മിസൈൽമാനും രാഷ്ട്രപതിയുമായി മാറിയ ഡോ. എ.പി.ജെ. അബ്ദുൾ കലാമിന്റെ ബാല്യകാലം.',
      funFactEn: '3D Model: Rotate the 3D Rameswaram Coastal Rocket Launchpad, Soaring Seabird & Books!',
      funFactMl: '3D മോഡൽ: ഡോ. കലാമിന്റെ റോക്കറ്റ് മാതൃകയും പുസ്തകങ്ങളും കടൽപ്പക്ഷിയും!',
      materialNote: 'Aerospace Alloy Fuselage + Coastal Water + Bound Books',
      environmentPreset: 'ocean',
      modelType: 'kalam_missile_island',
    });
  }

  if (id === 'chap-c4-foc-7' || combined.includes('magic pot')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'The Magic Brass Pot',
      emoji: '🏺',
      explanationEn:
        'In the folk tale "The Magic Pot", a hardworking farmer digs up a mystical brass pot in his field that multiplies whatever is placed inside into a hundred! It rewards honesty and teaches that greed leads to downfall.',
      explanationMl:
        'കഠിനാധ്വാനിയായ കർഷകന് വയലിൽ നിന്ന് ലഭിച്ച മാന്ത്രിക പിച്ചള കലത്തിന്റെ കഥ — സത്യസന്ധതയുടെയും സംതൃപ്തിയുടെയും പാഠം.',
      funFactEn: '3D Model: Inspect the Hammered Copper-Brass Magic Cauldron Overflowing with Golden Coins!',
      funFactMl: '3D മോഡൽ: സ്വർണ്ണനാണയങ്ങൾ നിറഞ്ഞൊഴുകുന്ന മാന്ത്രിക പിച്ചള പാത്രം!',
      materialNote: 'Hammered Burnished Copper & Brass + Gleaming 24K Gold Coins',
      environmentPreset: 'heritage',
      modelType: 'magic_brass_pot',
    });
  }

  // ===========================================================================
  // 3. HINDI (उड़न खटोला 4) — Exact Chapter 3D Matches
  // ===========================================================================
  if (id === 'chap-c4-hin-1' || combined.includes('पर्वत कहता') || combined.includes('प्रकृति का संदेश')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'पर्वत और सागर (Nature 3D)',
      emoji: '🏔️',
      explanationEn:
        'In Sohanlal Dwivedi’s poem "प्रकृति का संदेश", the tall Mountain teaches us to hold our heads high with pride, the deep Ocean teaches depth of heart, and the dancing Waves teach us perseverance and joy!',
      explanationMl:
        'പർവ്വതത്തെപ്പോലെ ശിരസ്സുയർത്തി നിൽക്കാനും കടലിനെപ്പോലെ മനസ്സിന് ആഴമുണ്ടാകാനും പഠിപ്പിക്കുന്ന സോഹൻലാൽ ദ്വിവേദിയുടെ പ്രശസ്ത ഹിന്ദി കവിത.',
      funFactEn: '3D Model: Explore the Towering 3D Himalayan Peak, Rolling Ocean Waves & Rising Sun!',
      funFactMl: '3D മോഡൽ: ഉയർന്ന പർവ്വതവും തിരമാലകളുള്ള കടലും ഉദയസൂര്യനും 3D-യിൽ!',
      materialNote: 'Layered Cliff Stone + Glacial Snow + Translucent Ocean Waves',
      environmentPreset: 'alpine',
      modelType: 'mountain',
    });
  }

  if (id === 'chap-c4-hin-2' || combined.includes('बीरबल') || combined.includes('अकबर')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'बीरबल का दरबार (Royal Court)',
      emoji: '👑',
      explanationEn:
        'In "बीरबल की बुद्धिमानी", witty minister Birbal uses sharp observation and calm intelligence in Emperor Akbar’s royal court to catch the culprit and deliver fair justice!',
      explanationMl:
        'അക്ബർ ചക്രവർത്തിയുടെ കൊട്ടാരത്തിൽ ബീർബൽ തന്റെ ബുദ്ധിസാമർത്ഥ്യത്തിലൂടെ സത്യം കണ്ടെത്തുകയും നീതി നടപ്പാക്കുകയും ചെയ്യുന്ന കഥ.',
      funFactEn: '3D Model: Rotate the Ornate 3D Royal Mughal Throne, Red Sandstone Pillars & Crown!',
      funFactMl: '3D മോഡൽ: രാജകീയ സിംഹാസനവും ചെങ്കൽ തൂണുകളും കിരീടവും 3D-യിൽ!',
      materialNote: 'Agra Red Sandstone + Gold Inlay + Crimson Velvet Cushion',
      environmentPreset: 'heritage',
      modelType: 'birbal_royal_throne',
    });
  }

  if (id === 'chap-c4-hin-3' || combined.includes('उड़न खटोला')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'जादुई उड़न खटोला (Sky Flyer)',
      emoji: '🎈',
      explanationEn:
        'In "उड़न खटोला की रोमांचक सैर", children soar high above fluffy clouds, snow mountains, and winding rivers in a magical flying gondola, marveling at the beauty of India from the sky!',
      explanationMl:
        'മാന്ത്രിക ഉഡൻ ഖടോലയിൽ (ആകാശ പേടകം) മേഘങ്ങൾക്കും മലനിരകൾക്കും മുകളിലൂടെ പറന്ന് കാഴ്ചകൾ കാണുന്ന കുട്ടികളുടെ കഥ.',
      funFactEn: '3D Model: Inspect the Magical 3D Flying Udan Khatola Canopy Gondola & Fluffy Sky Clouds!',
      funFactMl: '3D മോഡൽ: മേഘങ്ങൾക്കിടയിലൂടെ പറക്കുന്ന മാന്ത്രിക ഉഡൻ ഖടോല!',
      materialNote: 'Royal Silk Canopy + Carved Teak Gondola + Golden Suspension Ropes',
      environmentPreset: 'alpine',
      modelType: 'udan_khatola_flying',
    });
  }

  if (id === 'chap-c4-hin-4' || combined.includes('पेड़ हमारे सच्चे मित्र')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'पेड़ हमारे मित्र (Living Tree)',
      emoji: '🌳',
      explanationEn:
        '"पेड़ हमारे सच्चे मित्र" teaches us that trees are our truest friends — giving us life-saving Oxygen (प्राणवायु), sweet fruits, cool shade, medicines, and rain while preventing soil erosion!',
      explanationMl:
        'മരങ്ങൾ നമുക്ക് ശ്വസിക്കാൻ പ്രാണവായുവും മധുരമുള്ള പഴങ്ങളും തണലും ഔഷധങ്ങളും നൽകുന്ന നമ്മുടെ ഏറ്റവും നല്ല സുഹൃത്തുക്കളാണ്.',
      funFactEn: '3D Model: Rotate the 3D Fruit-Bearing Banyan/Mango Tree, Bird Nest & Oxygen Aura!',
      funFactMl: '3D മോഡൽ: പഴങ്ങളും കിളിക്കൂടുമുള്ള തണൽമരത്തിന്റെ 3D മാതൃക!',
      materialNote: 'Natural Bark Bump Texture + Lush Leaf Canopy + Ripened Fruits',
      environmentPreset: 'nature',
      modelType: 'tree_leaf',
    });
  }

  if (id === 'chap-c4-hin-5' || combined.includes('समय का मोल')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'समय का मोल (Golden Clock)',
      emoji: '⏰',
      explanationEn:
        '"समय का मोल" reminds us that lost time never returns! Following a disciplined daily timetable for study, play, and rest leads every student to bright success.',
      explanationMl:
        'നഷ്ടപ്പെട്ട സമയം ഒരിക്കലും തിരിച്ചുകിട്ടില്ല; കൃത്യനിഷ്ഠയോടെ പഠിക്കുകയും പ്രവർത്തിക്കുകയും ചെയ്താൽ ജീവിതത്തിൽ വലിയ വിജയം നേടാം.',
      funFactEn: '3D Model: Inspect the 3D Golden Precision Clock with Moving Hands & Hourglass!',
      funFactMl: '3D മോഡൽ: സമയത്തിന്റെ വില ഓർമ്മിപ്പിക്കുന്ന 3D സുവർണ്ണ ക്ലോക്ക്!',
      materialNote: 'Brushed Brass Bezel + Crystal Clock Face + Ebony Hands',
      environmentPreset: 'playroom',
      modelType: 'clock',
    });
  }

  if (id === 'chap-c4-hin-6' || combined.includes('सच्चा मित्र') || combined.includes('एकता की शक्ति')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'एकता की शक्ति (Unity Doves)',
      emoji: '🕊️',
      explanationEn:
        'From the Panchatantra tale "सच्चा मित्र और एकता की शक्ति": When a flock of doves gets trapped in a hunter’s net, they fly up together in complete unity, and their loyal mouse friend nibbles the ropes to set them free!',
      explanationMl:
        'വേടന്റെ വലയിൽ കുടുങ്ങിയ പ്രാവുകൾ ഒത്തൊരുമയോടെ വലയുമായി പറന്നുയർന്ന് എലിയുടെ സഹായത്തോടെ രക്ഷപ്പെടുന്ന പഞ്ചതന്ത്രം കഥ.',
      funFactEn: '3D Model: Watch the 3D Flock of White Doves Lifting the Net Together with the Friendly Mouse!',
      funFactMl: '3D മോഡൽ: ഒത്തൊരുമയോടെ വലയുമായി പറക്കുന്ന പ്രാവുകളും സുഹൃത്തായ എലിയും!',
      materialNote: 'Soft Feathered White Plumage + Woven Rope Net + Forest Meadow',
      environmentPreset: 'nature',
      modelType: 'unity_doves_net',
    });
  }

  if (id === 'chap-c4-hin-7' || combined.includes('व्याकरण उपवन') || combined.includes('संज्ञा')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'हिंदी व्याकरण (Grammar 3D)',
      emoji: '🔤',
      explanationEn:
        'Master Hindi Grammar pillars: संज्ञा (Noun), सर्वनाम (Pronoun), विशेषण (Adjective), क्रिया (Verb), विलोम शब्द (Opposites), and पर्यायवाची शब्द (Synonyms)!',
      explanationMl:
        'ഹിന്ദി വ്യാകരണത്തിലെ നാമം (संज्ञा), സർവ്വനാമം (सर्वनाम), വിശേഷണം (विशेषण), ക്രിയ (क्रिया), വിപരീത പദങ്ങൾ എന്നിവ പഠിക്കാം.',
      funFactEn: '3D Model: Explore the 3D Interlocking Hindi Grammar Pillars & Golden Arch!',
      funFactMl: '3D മോഡൽ: ഹിന്ദി വ്യാകരണ തൂണുകളുടെ 3D മാതൃക!',
      materialNote: 'Satin Lacquered Wood Blocks + Gold Archway',
      environmentPreset: 'playroom',
      modelType: 'grammar_stage',
    });
  }

  // ===========================================================================
  // 4. VALUE EDUCATION (Joy of Better Living 4) — Exact Chapter 3D Matches
  // ===========================================================================
  if (id === 'chap-c4-mor-1' || combined.includes('gratitude') || combined.includes('prayer') || combined.includes('blessing')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Gratitude & Peace Shrine',
      emoji: '🙏',
      explanationEn:
        'Gratitude fills our hearts with joy! Thanking God, our parents, teachers, and nature every morning brings inner peace, humility, and kindness.',
      explanationMl:
        'നമുക്ക് ലഭിച്ച എല്ലാ അനുഗ്രഹങ്ങൾക്കും മാതാപിതാക്കൾക്കും അധ്യാപകർക്കും ദൈവത്തിനും ഹൃദയപൂർവ്വം നന്ദി പറയുന്ന നല്ല ശീലം.',
      funFactEn: '3D Model: Rotate the 3D Serene Peace Sanctuary, Glowing Oil Lamp & Blooming Lotus!',
      funFactMl: '3D മോഡൽ: സമാധാനത്തിന്റെ ദീപവും വിരിഞ്ഞ താമരയും അടങ്ങിയ 3D മാതൃക!',
      materialNote: 'Polished White Marble + Warm Candle Flame + Rose Quartz Lotus',
      environmentPreset: 'heritage',
      modelType: 'moral_gratitude_shrine',
    });
  }

  if (id === 'chap-c4-mor-2' || combined.includes('honesty') || combined.includes('truthfulness')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Golden Scales of Honesty',
      emoji: '⚖️',
      explanationEn:
        'Honesty is the highest virtue! Speaking the truth and acting fairly even when no one is watching builds unbreakable trust, courage, and a clear conscience.',
      explanationMl:
        'എപ്പോഴും സത്യം പറയുകയും സത്യസന്ധമായി പ്രവർത്തിക്കുകയും ചെയ്യുന്നത് വിശ്വാസവും ആത്മധൈര്യവും വളർത്തുന്നു.',
      funFactEn: '3D Model: Inspect the Balanced 3D Golden Scales of Truth & Shield of Integrity!',
      funFactMl: '3D മോഡൽ: സത്യത്തിന്റെയും നീതിയുടെയും 3D സുവർണ്ണ തുലാസും കവചവും!',
      materialNote: '24K Burnished Gold Balance Beam + Sapphire Truth Crystal',
      environmentPreset: 'heritage',
      modelType: 'moral_honesty_scales',
    });
  }

  if (id === 'chap-c4-mor-3' || id === 'chap-c4-mor-4' || id === 'chap-c4-mor-6' || combined.includes('empathy') || combined.includes('kindness') || combined.includes('teamwork') || combined.includes('perseverance')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Empathy, Unity & Courage',
      emoji: '❤️',
      explanationEn:
        'Kindness, Empathy, Teamwork, and Perseverance make us true leaders! Caring for elders, friends, and animals, cooperating as one team, and never giving up on good goals transforms the world.',
      explanationMl:
        'സഹാനുഭൂതി, ദയ, ഒത്തൊരുമ, സ്ഥിരോത്സാഹം എന്നീ മൂല്യങ്ങൾ നമ്മളെ മികച്ച മനുഷ്യരാക്കി മാറ്റുന്നു.',
      funFactEn: '3D Model: Explore the 3D Glowing Heart of Kindness, Unity Pillars & Champion Trophy!',
      funFactMl: '3D മോഡൽ: സ്നേഹത്തിന്റെയും കൂട്ടായ്മയുടെയും 3D ഹൃദയ മാതൃകയും ട്രോഫിയും!',
      materialNote: 'Ruby Crystal Heart + Brushed Gold Pedestal',
      environmentPreset: 'playroom',
      modelType: 'moral_kindness_heart',
    });
  }

  if (id === 'chap-c4-mor-5' || combined.includes('respect for nature') || combined.includes('clean earth')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Green Earth Conservation',
      emoji: '🌱',
      explanationEn:
        'Respecting Nature means saving every drop of water, avoiding single-use plastics, planting green saplings, and using clean renewable energy to keep our planet thriving!',
      explanationMl:
        'മരങ്ങൾ നട്ടുപിടിപ്പിച്ചും ജലം പാഴാക്കാതെയും പ്ലാസ്റ്റിക് ഒഴിവാക്കിയും നമ്മുടെ ഭൂമിയെ സംരക്ഷിക്കാം.',
      funFactEn: '3D Model: Rotate the 3D Eco-Biosphere with Green Bins & Wind Turbine!',
      funFactMl: '3D മോഡൽ: പരിസ്ഥിതി സംരക്ഷണ ബിന്നുകളും കാറ്റാടിയന്ത്രവും!',
      materialNote: 'Recycled HDPE Eco-Plastic + Brushed Steel Turbine',
      environmentPreset: 'nature',
      modelType: 'recycle_bin',
    });
  }

  // ===========================================================================
  // 5. MALAYALAM (Class 4 ഭാഷാപൂർണ്ണിമ & UKG ചങ്ങാതി Book-B)
  // ===========================================================================
  if (id === 'chap-c4-mal-3' || combined.includes('വള്ളംകളി') || combined.includes('കഥകളി') || combined.includes('ഓണം')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'കേരള വള്ളംകളിയും പൂക്കളവും',
      emoji: '🚣',
      explanationEn:
        'Celebrate Kerala’s vibrant cultural heritage! Explore the majestic Chundan Vallam (Snake Boat Race) gliding across backwaters, the colorful Onam Pookkalam floral carpet, and the traditional Nilavilakku brass lamp!',
      explanationMl:
        'കേരളത്തിന്റെ തനത് സാംസ്കാരിക പൈതൃകമായ ചുണ്ടൻ വള്ളംകളിയും ഓണപ്പൂക്കളവും നിലവിളക്കും 3D-യിൽ ആസ്വദിച്ചു പഠിക്കാം!',
      funFactEn: '3D Model: Rotate the 3D Kerala Chundan Vallam Snake Boat, Onam Pookkalam & Brass Lamp!',
      funFactMl: '3D മോഡൽ: കേരളീയ ചുണ്ടൻ വള്ളവും ഓണപ്പൂക്കളവും നിലവിളക്കും 3D-യിൽ!',
      materialNote: 'Oiled Anjili Teak Boat Hull + Brass Nilavilakku + Floral Pookkalam Rings',
      environmentPreset: 'ocean',
      modelType: 'kerala_snake_boat',
    });
  }

  if (id === 'chap-ukg-mal-1' || combined.includes('സ്വരാക്ഷരങ്ങൾ') || combined.includes('ആന')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'സ്വരാക്ഷരങ്ങൾ & ആന (3D)',
      emoji: '🐘',
      explanationEn:
        'Learn Malayalam Vowels (അ, ആ, ഇ, ഈ, ഉ, ഊ...) from Changathi Book-B! Meet ആന (3D Kerala Elephant with golden Nettipattam caparison), ഇല (Green Leaf), and ഊഞ്ഞാൽ (Garden Swing)!',
      explanationMl:
        'ചങ്ങാതി ബുക്ക്-B യിലെ സ്വരാക്ഷരങ്ങൾ: അ - അമ്മ, ആ - ആന, ഇ - ഇല, ഉ - ഉറുമ്പ്, ഊ - ഊഞ്ഞാൽ എന്നിവ 3D മോഡലുകളിലൂടെ പഠിക്കാം!',
      funFactEn: '3D Model: Explore the Cute 3D Elephant (ആന) with Golden Caparison & Malayalam Vowel Blocks!',
      funFactMl: '3D മോഡൽ: നെറ്റിപ്പട്ടം കെട്ടിയ കൊമ്പനാനയും (ആന) മലയാളം അക്ഷര ബ്ലോക്കുകളും!',
      materialNote: 'Sculpted Gray Elephant Skin + 24K Gold Nettipattam + Wooden Letter Blocks',
      environmentPreset: 'nature',
      modelType: 'malayalam_vowels_elephant',
    });
  }

  if (id === 'chap-ukg-mal-5' || combined.includes('ചങ്ങാതി') || combined.includes('തുമ്പി') || combined.includes('പൂമ്പാറ്റ') || combined.includes('കൂൺ')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'ചങ്ങാതിയുടെ പൂന്തോട്ടം 3D',
      emoji: '🦋',
      explanationEn:
        'Step inside the cover of Faidan’s Changathi Book-B! Meet the Red-Spotted Mushroom House (കൂൺ), Colorful Butterfly (പൂമ്പാറ്റ), Buzzing Honeybee (തേനീച്ച), Little Snail (ഒച്ച്), and Dragonfly (തുമ്പി)!',
      explanationMl:
        'ഫൈദാന്റെ ചങ്ങാതി പുസ്തകത്തിന്റെ പുറംചട്ടയിലെ പൂന്തോട്ടം! കൂൺ വീടും പൂമ്പാറ്റയും തേനീച്ചയും ഒച്ചും തുമ്പിയും 3D-യിൽ!',
      funFactEn: '3D Model: Rotate the 3D Red Mushroom House (കൂൺ), Butterfly (പൂമ്പാറ്റ), Bee & Snail (ഒച്ച്)!',
      funFactMl: '3D മോഡൽ: ചങ്ങാതിയുടെ പൂന്തോട്ടത്തിലെ കൂണും പൂമ്പാറ്റയും തേനീച്ചയും ഒച്ചും!',
      materialNote: 'Velvet Spotted Mushroom Cap + Iridescent Butterfly Wings + Glossy Snail Shell',
      environmentPreset: 'nature',
      modelType: 'changathi_garden_bugs',
    });
  }

  // ===========================================================================
  // 6. UKG GENERAL AWARENESS & MATH — Exact Chapter 3D Matches
  // ===========================================================================
  if (id === 'chap-ukg-evs-2' || combined.includes('sweet home') || combined.includes('my family')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'My Sweet Home & School 3D',
      emoji: '🏡',
      explanationEn:
        'Explore our cosy Sweet Home with its Living Room, Bedroom, Kitchen, and Garden, where Father, Mother, Brother, Sister, and Grandparents live happily together!',
      explanationMl:
        'അച്ഛനും അമ്മയും ചേട്ടനും മുത്തശ്ശിയും ഒത്തൊരുമയോടെ താമസിക്കുന്ന നമ്മുടെ മനോഹരമായ വീടും മുറികളും പൂന്തോട്ടവും!',
      funFactEn: '3D Model: Rotate the 3D Cutaway Family House with Red Tile Roof, Windows, Garden & School Bus!',
      funFactMl: '3D മോഡൽ: മനോഹരമായ 3D വീടും പൂന്തോട്ടവും സ്കൂൾ ബസും!',
      materialNote: 'Terracotta Roof Tiles + Stucco Walls + Warm Lit Glass Windows',
      environmentPreset: 'playroom',
      modelType: 'ukg_sweet_home_school',
    });
  }

  if (id === 'chap-ukg-evs-6' || combined.includes('community helper') || combined.includes('doctor') || combined.includes('firefighter')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Community Helpers Hub 3D',
      emoji: '🚒',
      explanationEn:
        'Our Community Helpers keep us healthy, safe, and learning every day! Doctors and Nurses care for us in the Hospital, Firefighters drive red Fire Engines, Policemen protect us, and Teachers guide us.',
      explanationMl:
        'ഡോക്ടർ, നഴ്സ്, അധ്യാപകർ, ഫയർഫോഴ്സ്, പോലീസ്, കർഷകൻ തുടങ്ങിയവർ നമ്മെ ദിവസവും സഹായിക്കുന്നവരാണ്.',
      funFactEn: '3D Model: Inspect the 3D Hospital Building with Red Cross, Emergency Ambulance & Fire Truck!',
      funFactMl: '3D മോഡൽ: ആശുപത്രി മന്ദിരവും ആംബുലൻസും ഫയർ എഞ്ചിനും 3D-യിൽ!',
      materialNote: 'Glossy Emergency Red Paint + Flashing Siren Beacons + Architectural Glass',
      environmentPreset: 'playroom',
      modelType: 'ukg_community_helpers',
    });
  }

  if (id === 'chap-ukg-evs-7' || combined.includes('traffic light') || combined.includes('zebra crossing')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Traffic Lights & Vehicles 3D',
      emoji: '🚦',
      explanationEn:
        'Follow Road Safety rules! Red Light says STOP 🔴, Yellow Light says WAIT 🟡, and Green Light says GO 🟢! Always cross the road safely at the black-and-white Zebra Crossing.',
      explanationMl:
        'ചുവപ്പ് കണ്ടാൽ നിൽക്കണം 🔴, മഞ്ഞ കണ്ടാൽ ഒരുങ്ങണം 🟡, പച്ച കണ്ടാൽ മുന്നോട്ട് പോകാം 🟢! എപ്പോഴും സീബ്രാ ക്രോസിംഗിലൂടെ റോഡ് മുറിച്ചുകടക്കുക.',
      funFactEn: '3D Model: Explore the 3D Glowing Traffic Signal, Zebra Crossing Road, Car & Aeroplane!',
      funFactMl: '3D മോഡൽ: കത്തുന്ന 3D ട്രാഫിക് ലൈറ്റും സീബ്രാ ക്രോസിംഗും വാഹനങ്ങളും!',
      materialNote: 'Emissive LED Traffic Lenses + Asphalt Road Texture + Metallic Car Body',
      environmentPreset: 'playroom',
      modelType: 'ukg_traffic_safety',
    });
  }

  if (id === 'chap-ukg-math-1' || combined.includes('heavy') || combined.includes('big & small') || combined.includes('tall & short')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Big/Small & Heavy/Light 3D',
      emoji: '⚖️',
      explanationEn:
        'Compare sizes and weights in 3D! A big heavy Elephant pushes the see-saw balance down, while a tiny light Mouse goes up in the air! Spot Tall vs Short and More vs Less.',
      explanationMl:
        'വലുതും ചെറുതും, ഭാരമുള്ളതും ഭാരം കുറഞ്ഞതും 3D സീസോയിലൂടെ (See-Saw) താരതമ്യം ചെയ്ത് പഠിക്കാം!',
      funFactEn: '3D Model: Watch the 3D Playground See-Saw Balance comparing Heavy vs Light & Tall vs Short!',
      funFactMl: '3D മോഡൽ: ഭാരവും വലിപ്പവും താരതമ്യം ചെയ്യുന്ന 3D സീസോ മാതൃക!',
      materialNote: 'Polished Playground Wood + Metallic Fulcrum + Sculpted Characters',
      environmentPreset: 'playroom',
      modelType: 'ukg_heavy_light_seesaw',
    });
  }

  if (id === 'chap-ukg-math-6' || id === 'chap-c4-math-6' || combined.includes('3d solid shape') || combined.includes('perimeter') || combined.includes('symmetry')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '2D & 3D Geometry Shapes',
      emoji: '📐',
      explanationEn:
        'Explore 2D & 3D Geometric Shapes! Inspect the Sphere (ball), Cube (6 square faces), Cylinder (2 circular bases), Cone, Pyramid, and Torus Ring — and see how Radius, Diameter, Perimeter, and Area work!',
      explanationMl:
        'ഗോളം (Sphere), സമചതുരക്കട്ട (Cube), സിലിണ്ടർ, കോൺ, പിരമിഡ് തുടങ്ങിയ 3D ജ്യാമിതീയ രൂപങ്ങളെ തിരിച്ചു നോക്കി പഠിക്കാം!',
      funFactEn: '3D Model: Rotate the Metallic & Crystal 3D Sphere, Cube, Cylinder, Cone & Pyramid!',
      funFactMl: '3D മോഡൽ: തിളങ്ങുന്ന 3D ജ്യാമിതീയ രൂപങ്ങൾ (Sphere, Cube, Cylinder, Cone)!',
      materialNote: 'PBR Clearcoat Geometric Solids + Laser-Etched Measurement Grid',
      environmentPreset: 'science_lab',
      modelType: 'shapes_3d_geometry',
    });
  }

  // ===========================================================================
  // 7. EXISTING SOCIAL SCIENCE, SCIENCE, MATH & LANGUAGE TOPICS (Enhanced)
  // ===========================================================================
  if (tLower.includes('what is history') || tLower.includes('family vs national')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'History & Past',
      emoji: '🏛️',
      explanationEn:
        'History is the true story of the past! Just like your family photo album shows how your parents and grandparents lived, National History tells us how early humans, kings, queens, and ordinary people lived, what food they ate, and how civilizations grew.',
      explanationMl:
        'കഴിഞ്ഞുപോയ കാലഘട്ടത്തിലെ യഥാർത്ഥ സംഭവങ്ങളുടെ പഠനമാണ് ചരിത്രം (History). നമ്മുടെ കുടുംബ ചരിത്രം പോലെ തന്നെ, പണ്ടുകാലത്ത് മനുഷ്യർ എങ്ങനെ ജീവിച്ചു എന്നും സംസ്കാരങ്ങൾ എങ്ങനെ വളർന്നു എന്നും ചരിത്രം നമ്മെ പഠിപ്പിക്കുന്നു.',
      funFactEn: '3D Model: Inspect the Ancient Heritage Pillar & Family Tree Pedestal!',
      funFactMl: '3D മോഡൽ: പ്രാചീന ചരിത്ര സ്തൂപവും പൈതൃക മാതൃകയും കറക്കി നോക്കൂ!',
      materialNote: 'Carved Chunar Sandstone + Burnished Gold Finial',
      environmentPreset: 'heritage',
      modelType: 'monument',
    });
  }

  if (tLower.includes('three periods') || (tLower.includes('ancient') && tLower.includes('medieval'))) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3 Periods of History',
      emoji: '⏳',
      explanationEn:
        'Indian History is divided into 3 grand periods so we can study it easily: 1) Ancient Period (Indus Valley Civilization, Ashoka, Gupta Age), 2) Medieval Period (Delhi Sultanate, Vijayanagara, Mughals), and 3) Modern Period (British Rule, Freedom Struggle, and Independent India).',
      explanationMl:
        'ഇന്ത്യൻ ചരിത്രത്തെ മൂന്ന് പ്രധാന കാലഘട്ടങ്ങളായി തിരിച്ചിരിക്കുന്നു: 1) പ്രാചീന കാലഘട്ടം (സിന്ധുനദീതട സംസ്കാരം), 2) മധ്യകാലഘട്ടം (മുഗൾ-സുൽത്താനേറ്റ് കാലം), 3) ആധുനിക കാലഘട്ടം (സ്വാതന്ത്ര്യ സമരവും ആധുനിക ഇന്ത്യയും).',
      funFactEn: '3D Model: Explore the 3-Tiered Time Hourglass & Era Pillars (Ancient → Medieval → Modern)!',
      funFactMl: '3D മോഡൽ: പ്രാചീന, മധ്യകാല, ആധുനിക യുഗങ്ങളെ സൂചിപ്പിക്കുന്ന 3D കാലഘട്ട ഗോപുരങ്ങൾ!',
      materialNote: 'Blown Crystal Glass + Brass Frame + Golden Sand',
      environmentPreset: 'heritage',
      modelType: 'hourglass',
    });
  }

  if (tLower.includes('archaeological sources') || tLower.includes('coins') || tLower.includes('inscriptions')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Coins & Monuments',
      emoji: '🪙',
      explanationEn:
        'Archaeological Sources are physical objects from the past dug up from the ground! These include: 1) Monuments (forts, temples, stupas), 2) Ancient Coins (gold, silver, and copper coins showing kings & dates), 3) Inscriptions (writings carved on stone pillars and cave walls), and 4) Artifacts (pottery, tools, jewelry).',
      explanationMl:
        'ഭൂമിക്കടിയിൽ നിന്ന് കുഴിച്ചെടുത്ത പുരാവസ്തു തെളിവുകളാണ് Archaeological Sources: പഴയ കോട്ടകൾ, ക്ഷേത്രങ്ങൾ (Monuments), പഴയകാല സ്വർണ്ണ-ചെമ്പ് നാണയങ്ങൾ (Coins), ശിലാലിഖിതങ്ങൾ (Inscriptions), മൺപാത്രങ്ങൾ (Artifacts).',
      funFactEn: '3D Model: Rotate the Golden Royal Coins, Carved Stone Pillar & Clay Artifact Pot!',
      funFactMl: '3D മോഡൽ: പുരാതന സ്വർണ്ണ നാണയങ്ങളും ശിലാലിഖിത സ്തൂപവും മൺപാത്രവും 3D-യിൽ കാണാം!',
      materialNote: '24K Stamped Gold Coin + Carved Basalt Stone + Baked Terracotta Clay',
      environmentPreset: 'heritage',
      modelType: 'coins',
    });
  }

  if (tLower.includes('literary sources') || tLower.includes('manuscript') || tLower.includes('palm-leaf')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Palm Manuscripts',
      emoji: '📜',
      explanationEn:
        'Before paper and printing presses were invented, people wrote by hand on dried palm leaves (Thaliyola) and birch bark (Bhojpatra). These handwritten records are called Manuscripts! Literary sources include Religious books (Vedas, Ramayana, Mahabharata, Jataka Tales) and Secular books (plays, biographies, travelogues).',
      explanationMl:
        'കടലാസ് കണ്ടുപിടിക്കുന്നതിന് മുമ്പ് ഉണങ്ങിയ പനയോലകളിലും (താളിയോല) മരത്തൊലികളിലും കൈകൊണ്ട് എഴുതിയ ഗ്രന്ഥങ്ങളാണ് മാനുസ്ക്രിപ്റ്റുകൾ (Manuscripts). വേദങ്ങൾ, ഇതിഹാസങ്ങൾ, സഞ്ചാരികളുടെ കുറിപ്പുകൾ എന്നിവ പ്രധാന സാഹിത്യ തെളിവുകളാണ്.',
      funFactEn: '3D Model: Inspect the Ancient Rolled Palm-Leaf Manuscript Scroll & Bamboo Stylus!',
      funFactMl: '3D മോഡൽ: പൗരാണിക താളിയോല ഗ്രന്ഥവും എഴുത്താണിയും 3D-യിൽ കറക്കി നോക്കൂ!',
      materialNote: 'Dried Palm-Leaf Fiber + Rosewood Rollers + Brass Narayam Stylus',
      environmentPreset: 'heritage',
      modelType: 'scroll',
    });
  }

  if (tLower.includes('archaeologist') || tLower.includes('historian')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Archaeologist & Historian',
      emoji: '🔍',
      explanationEn:
        'An Archaeologist is like a scientific detective who carefully excavates (digs up) historic sites using brushes and tools to find ancient coins, pots, and bones. A Historian then studies these artifacts along with old manuscripts to piece together and write the true story of the past!',
      explanationMl:
        'ചരിത്ര സ്ഥലങ്ങളിൽ ഉദ്ഘനനം (Excavation) നടത്തി പുരാവസ്തുക്കൾ കണ്ടെത്തുന്ന ശാസ്ത്രജ്ഞനാണ് പുരാവസ്തു ഗവേഷകൻ (Archaeologist). ഈ തെളിവുകളും ലിഖിതങ്ങളും പഠിച്ച് ചരിത്രം രചിക്കുന്നവരാണ് ചരിത്രകാരന്മാർ (Historians).',
      funFactEn: '3D Model: Explore the Archaeologist’s Magnifying Lens & Excavation Trench!',
      funFactMl: '3D മോഡൽ: പുരാവസ്തു ഗവേഷകന്റെ ലെൻസും ഉദ്ഘനന മാതൃകയും കാണാം!',
      materialNote: 'Refractive Optical Glass Lens + Brass Rim + Emerald Relic',
      environmentPreset: 'heritage',
      modelType: 'magnifier',
    });
  }

  if (tLower.includes('almanac') || tLower.includes('calendar') || tLower.includes('leap year') || tLower.includes('timeline') || tLower.includes('chronolog') || tLower.includes('bce')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Almanac & BCE-CE Timeline',
      emoji: '📅',
      explanationEn:
        'An Almanac shows calendars, moon phases, and festivals! A Timeline arranges historical events in Chronological Order: years before year 1 are BCE (counting backward) and years after year 1 are CE (counting forward)!',
      explanationMl:
        'സംഭവങ്ങൾ നടന്ന ക്രമത്തിൽ (Chronological Order) രേഖപ്പെടുത്തുന്ന രേഖയാണ് Timeline. ബി.സി.ഇ (BCE) വർഷങ്ങൾ പിന്നോട്ടും, സി.ഇ (CE) വർഷങ്ങൾ മുന്നോട്ടും എണ്ണുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Solar-Lunar Calendar & Chronological Hourglass!',
      funFactMl: '3D മോഡൽ: 3D കലണ്ടറും കാലഗണന മാതൃകയും!',
      materialNote: 'Crystal Glass Bulbs + Brushed Gold Pillars',
      environmentPreset: 'heritage',
      modelType: 'hourglass',
    });
  }

  if (tLower.includes('citizen') || tLower.includes('public property') || tLower.includes('election') || tLower.includes('government') || tLower.includes('constitution')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Good Citizenship',
      emoji: '🇮🇳',
      explanationEn:
        'A good citizen loves their country, obeys laws, helps neighbours, and protects Public Property (schools, parks, buses, trains, and historical monuments) because they belong to all of us! When citizens reach age 18, they vote in Elections to choose leaders in our Democracy.',
      explanationMl:
        'രാജ്യത്തെ നിയമങ്ങൾ പാലിക്കുകയും പൊതുമുതൽ (പാർക്കുകൾ, ബസുകൾ, സ്കൂളുകൾ, ചരിത്രസ്മാരകങ്ങൾ) സ്വന്തം സ്വത്ത് പോലെ സംരക്ഷിക്കുകയും ചെയ്യുന്നവനാണ് ഉത്തമ പൗരൻ.',
      funFactEn: '3D Model: Explore the 3D Civic Parliament Dome & National Tricolour Flag!',
      funFactMl: '3D മോഡൽ: പാർലമെന്റ് മന്ദിരവും ദേശീയ പതാകയും 3D-യിൽ കാണാം!',
      materialNote: 'White Makrana Marble Colonnade + Woven Khadi Tricolour Flag',
      environmentPreset: 'heritage',
      modelType: 'flag_parliament',
    });
  }

  if (tLower.includes('rotation') || tLower.includes('revolution') || tLower.includes('globe') || tLower.includes('continent') || tLower.includes('domain')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Earth & Globe 3D',
      emoji: '🌍',
      explanationEn:
        'Our Earth spins on its tilted axis once every 24 hours (Rotation → causing Day & Night) and orbits around the Sun in 365¼ days (Revolution → causing Seasons). Its 4 domains are Lithosphere (land), Hydrosphere (water), Atmosphere (air), and Biosphere (living world).',
      explanationMl:
        'ഭൂമി സ്വന്തം അച്ചുതണ്ടിൽ 24 മണിക്കൂർ കൊണ്ട് കറങ്ങുന്നതിനെ ഭ്രമണം (Rotation - രാവും പകലും) എന്നും, സൂര്യനെ 365¼ ദിവസം കൊണ്ട് വലംവയ്ക്കുന്നതിനെ പരിക്രമണം (Revolution - ഋതുക്കൾ) എന്നും വിളിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the Tilted 3D Earth Globe with Continents & Equatorial Ring!',
      funFactMl: '3D മോഡൽ: അച്ചുതണ്ടിൽ കറങ്ങുന്ന 3D ഭൂഗോളം തിരിച്ചു നോക്കൂ!',
      materialNote: 'Specular Ocean Water + Raised Continent Relief + Brass Meridian',
      environmentPreset: 'science_lab',
      modelType: 'globe',
    });
  }

  if (tLower.includes('direction') || tLower.includes('compass') || tLower.includes('scale') || tLower.includes('map')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Compass & Map',
      emoji: '🧭',
      explanationEn:
        'Maps use 4 Cardinal Directions (North, South, East, West) and 4 Intermediate Directions (NE, NW, SE, SW). Map Scale shows the ratio between map distance and real ground distance, while Colours and Symbols help us read any map easily!',
      explanationMl:
        'ഭൂപടങ്ങളിൽ വടക്ക്, തെക്ക്, കിഴക്ക്, പടിഞ്ഞാറ് എന്നീ 4 പ്രധാന ദിശകളും ഉപദിശകളും ഉപയോഗിക്കുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Golden Compass Rose & Topographical Map!',
      funFactMl: '3D മോഡൽ: 3D വടക്കുനോക്കിയന്ത്രവും (Compass) ഭൂപടവും!',
      materialNote: 'Burnished Brass Bezel + Magnetized Crimson/Silver Needles',
      environmentPreset: 'alpine',
      modelType: 'compass',
    });
  }

  if (tLower.includes('himalaya') || tLower.includes('mountain') || tLower.includes('landform') || tLower.includes('plateau') || tLower.includes('plain')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Mountains & Plains',
      emoji: '🏔️',
      explanationEn:
        'India has 6 spectacular physical divisions: 1) The snow-capped Himalayas (Himadri, Himachal, Shiwalik), 2) Fertile Northern Plains watered by Ganga, Indus & Brahmaputra, 3) The Great Indian Thar Desert, 4) The Southern Deccan Plateau, 5) Coastal Plains, and 6) Islands!',
      explanationMl:
        'ഇന്ത്യയുടെ ഭൂപ്രകൃതി: മഞ്ഞുമൂടിയ ഹിമാലയ പർവ്വതനിരകൾ, ഗംഗാ സമതലം, താർ മരുഭൂമി, ഡെക്കാൻ പീഠഭൂമി, തീരസമതലങ്ങൾ, ദ്വീപുകൾ.',
      funFactEn: '3D Model: Explore the Snow-Capped 3D Himalayan Peaks, Plateau & Flowing River!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുമൂടിയ ഹിമാലയ കൊടുമുടികളും നദിയും പീഠഭൂമിയും 3D-യിൽ!',
      materialNote: 'Granite Mountain Strata + Glacial Snow Cap + Alluvial Plains',
      environmentPreset: 'alpine',
      modelType: 'mountain',
    });
  }

  if (tLower.includes('monsoon') || tLower.includes('river') || tLower.includes('dam') || (tLower.includes('water') && !tLower.includes('lily')) || tLower.includes('weather') || tLower.includes('season')) {
    if (tLower.includes('water cycle') || tLower.includes('precipitation')) {
      return withDefaults({
        index,
        title: topic,
        shortLabel: 'The Water Cycle 3D',
        emoji: '💧',
        explanationEn:
          'Earth’s continuous natural recycling journey of water: 1) Evaporation (Sun heats lakes and oceans into vapor), 2) Condensation (cold air high up turns vapor into clouds), 3) Precipitation (clouds release rain or snow back to Earth)!',
        explanationMl:
          'സൂര്യന്റെ ചൂടേറ്റ് ജലം നീരാവിയാകുന്ന ബാഷ്പീകരണവും (Evaporation), മേഘങ്ങളാകുന്ന സാന്ദ്രീകരണവും (Condensation), മഴയായി പെയ്യുന്നതും ചേർന്നതാണ് ജലചക്രം.',
        funFactEn: '3D Model: Explore the 3D Water Cycle Diorama — Ocean, Rising Vapor & Rain Cloud!',
        funFactMl: '3D മോഡൽ: സമുദ്രവും നീരാവിയും മഴമേഘങ്ങളുമുള്ള 3D ജലചക്രം!',
        materialNote: 'Translucent Ocean Water + Volumetric Cloud + Raindrops',
        environmentPreset: 'ocean',
        modelType: 'water_cycle',
      });
    }
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Rivers, Dams & Rain',
      emoji: '🌧️',
      explanationEn:
        'Multi-purpose River Valley Dams (like Bhakra Nangal, Hirakud, and Idukki Dam in Kerala) store river water in reservoirs to irrigate farm fields, control floods, and generate clean Hydroelectricity!',
      explanationMl:
        'ഇടുക്കി, ഭക്രാനംഗൽ തുടങ്ങിയ അണക്കെട്ടുകൾ (Dams) കൃഷിക്കും ജലവൈദ്യുതി ഉല്പാദനത്തിനും സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Watch the 3D Rain Clouds, Concrete Hydroelectric Dam & Reservoir!',
      funFactMl: '3D മോഡൽ: മഴമേഘങ്ങളും അണക്കെട്ടും ജലസംഭരണിയും 3D-യിൽ!',
      materialNote: 'Reinforced Concrete Dam + Refractive Reservoir Water',
      environmentPreset: 'ocean',
      modelType: 'river_dam',
    });
  }

  if (tLower.includes('desert plant') || tLower.includes('cactus') || tLower.includes('desert adaptation')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Desert Cactus 3D',
      emoji: '🌵',
      explanationEn:
        'Cactus plants survive the hottest deserts! Their leaves are reduced to sharp Thorns (spines) to prevent water loss, while their thick, fleshy green stem stores water and performs photosynthesis!',
      explanationMl:
        'മരുഭൂമിയിലെ കള്ളിമുൾച്ചെടികൾക്ക് (Cactus) ഇലകൾക്ക് പകരം മുള്ളുകളാണുള്ളത്. ഇവയുടെ തടിച്ച പച്ച തണ്ട് ജലം സംഭരിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Desert Saguaro Cactus on Golden Sand Dunes!',
      funFactMl: '3D മോഡൽ: മണൽക്കുന്നിൽ നിൽക്കുന്ന മരുഭൂമിയിലെ 3D കള്ളിമുൾച്ചെടി!',
      materialNote: 'Waxy Ribbed Succulent Stem + Desert Silica Sand',
      environmentPreset: 'nature',
      modelType: 'plant_cactus',
    });
  }

  if (tLower.includes('mountain plant') || tLower.includes('pine') || tLower.includes('conifer')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Mountain Pine Tree 3D',
      emoji: '🌲',
      explanationEn:
        'Coniferous trees (Pine, Fir, Deodar) growing on snowy mountains have conical shapes with sloping branches so snow slides right off, woody cones instead of flowers, and waxy needle leaves!',
      explanationMl:
        'പർവ്വതങ്ങളിലെ പൈൻ മരങ്ങൾക്ക് കോൺ ആകൃതിയിലുള്ള ശാഖകളാണുള്ളത്. ഇത് മഞ്ഞ് അടിഞ്ഞുകൂടാതെ താഴേക്ക് വീഴാൻ സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Explore the Snow-Dusted 3D Coniferous Pine Tree & Woody Cones!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുപെയ്ത മലനിരകളിലെ 3D പൈൻ മരം!',
      materialNote: 'Evergreen Pine Needles + Rough Timber Bark + Snow Cap',
      environmentPreset: 'alpine',
      modelType: 'plant_pine',
    });
  }

  if (tLower.includes('water lily') || tLower.includes('lotus') || tLower.includes('aquatic plant')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Aquatic Lotus 3D',
      emoji: '🪷',
      explanationEn:
        'Aquatic plants (Lotus, Water Lily, Hydrilla) thrive in ponds! They have wide, flat, waxy leaves that float on water without rotting, with stomata on the upper surface and hollow air-filled stems.',
      explanationMl:
        'താമരയും ആമ്പലും ജലത്തിൽ ജീവിക്കുന്ന സസ്യങ്ങളാണ്. ജലത്തിന് മുകളിൽ പൊങ്ങിക്കിടക്കാൻ ഇവയുടെ ഇലകളിൽ മെഴുക് പാളിയുണ്ട്.',
      funFactEn: '3D Model: Watch the 3D Floating Waxy Lily Pad & Pink Lotus Petals on Water!',
      funFactMl: '3D മോഡൽ: വെള്ളത്തിൽ വിരിഞ്ഞുനിൽക്കുന്ന 3D താമരപ്പൂവും ഇലയും!',
      materialNote: 'Waxy Hydrophobic Leaf + Soft Pink Velvet Petals + Pond Water',
      environmentPreset: 'ocean',
      modelType: 'plant_lotus',
    });
  }

  if (tLower.includes('photosynthesis') || tLower.includes('chloroplast') || tLower.includes('stomata') || tLower.includes('leaf blade')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Photosynthesis Leaf 3D',
      emoji: '🍃',
      explanationEn:
        'Inside green plant leaves, Chloroplasts trap sunlight energy! Leaves take in Carbon Dioxide through Stomata and water through veins, producing glucose food and releasing fresh Oxygen bubbles!',
      explanationMl:
        'ഇലകളിലെ ഹരിതകണങ്ങൾ (Chloroplasts) സൂര്യപ്രകാശം ആഗിരണം ചെയ്ത് ജലവും കാർബൺ ഡൈ ഓക്സൈഡും ചേർത്ത് അന്നജം നിർമ്മിക്കുകയും ഓക്സിജൻ പുറത്തുവിടുകയും ചെയ്യുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Leaf Blade, Veins, Sunlight Rays & Oxygen Bubbles!',
      funFactMl: '3D മോഡൽ: സൂര്യപ്രകാശവും ഓക്സിജൻ കണികകളുമുള്ള ഇലയുടെ 3D പ്രകാശസംശ്ലേഷണ മാതൃക!',
      materialNote: 'Translucent Chlorophyll Leaf Cuticle + Refractive Oxygen Spheres',
      environmentPreset: 'nature',
      modelType: 'leaf_photosynthesis',
    });
  }

  if (tLower.includes('plant') || tLower.includes('forest') || tLower.includes('soil') || tLower.includes('wildlife')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Plants, Soil & Forests',
      emoji: '🌳',
      explanationEn:
        'Fertile Alluvial and Black soils support rich crops and Evergreen, Deciduous, and Mangrove forests. Roots anchor trees firmly into the soil to prevent soil erosion!',
      explanationMl:
        'ഫലഭൂയിഷ്ഠമായ മണ്ണും വനങ്ങളും നമ്മുടെ ഭൂമിയുടെ ജീവനാഡിയാണ്. മരങ്ങളുടെ വേരുകൾ മണ്ണൊലിപ്പ് തടയുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Tree Canopy, Root Soil Layers & Sunlight Energy!',
      funFactMl: '3D മോഡൽ: വൃക്ഷവും വേരുകളും മണ്ണിന്റെ പാളികളും സൂര്യപ്രകാശവും 3D-യിൽ!',
      materialNote: 'Organic Bark Grain + Layered Alluvial Soil + Foliage',
      environmentPreset: 'nature',
      modelType: 'tree_leaf',
    });
  }

  if (tLower.includes('carbohydrate') || tLower.includes('energy-giving') || (tLower.includes('fat') && !tLower.includes('adaptation'))) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Carbohydrates & Fats',
      emoji: '🍞',
      explanationEn:
        'Carbohydrates (Rice, Wheat, Bread, Potatoes, Bananas) give us immediate energy to run, jump, think and study! Healthy fats (Butter, Ghee, Nuts) store concentrated energy and keep our bodies warm.',
      explanationMl:
        'ശരീരത്തിന് വേഗത്തിൽ പ്രവർത്തിക്കാൻ ആവശ്യമായ ഊർജ്ജം നൽകുന്നത് കാർബോഹൈഡ്രേറ്റുകളും (അരി, ഗോതമ്പ്, കിഴങ്ങുകൾ) കൊഴുപ്പുകളുമാണ്.',
      funFactEn: '3D Model: Inspect the 3D Crusty Bread Loaf, Steaming Rice Bowl, Potato & Butter!',
      funFactMl: '3D മോഡൽ: ഊർജ്ജം നൽകുന്ന 3D ധാന്യങ്ങളും റൊട്ടിയും ഉരുളക്കിഴങ്ങും കാണാം!',
      materialNote: 'Baked Golden Crust Texture + Glazed Ceramic Bowl + Wood Cutting Board',
      environmentPreset: 'science_lab',
      modelType: 'carbs_energy',
    });
  }

  if (tLower.includes('protein') || tLower.includes('body-building')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Proteins (Body-Building)',
      emoji: '🥛',
      explanationEn:
        'Proteins are the body-building blocks that help children grow taller, build strong muscles, and repair skin and cuts! Rich protein sources include Milk, Cheese, Eggs, Pulses (Dal), Fish, and Paneer.',
      explanationMl:
        'കുട്ടികളുടെ വളർച്ചയ്ക്കും പേശികളുടെയും കോശങ്ങളുടെയും പുനർനിർമ്മാണത്തിനും പ്രോട്ടീനുകൾ (പാൽ, മുട്ട, പരിപ്പുവർഗ്ഗങ്ങൾ, മത്സ്യം) അത്യാവശ്യമാണ്.',
      funFactEn: '3D Model: Rotate the 3D Milk Carton, Fresh Egg, Shimmering Fish & Pulses Bowl!',
      funFactMl: '3D മോഡൽ: വളർച്ചയ്ക്ക് സഹായിക്കുന്ന പാലും മുട്ടയും മീനും പരിപ്പും 3D-യിൽ!',
      materialNote: 'Matte Eggshell + Iridescent Fish Scales + Coated Milk Carton',
      environmentPreset: 'science_lab',
      modelType: 'proteins_body',
    });
  }

  if (tLower.includes('vitamin') || tLower.includes('mineral') || tLower.includes('protective') || id === 'chap-ukg-evs-3') {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Vitamins, Fruits & Veggies',
      emoji: '🍎',
      explanationEn:
        'Vitamins and Minerals in fresh Fruits and Vegetables are Protective Foods! They protect our eyes, skin, bones, and teeth, and build our immune shield against illnesses.',
      explanationMl:
        'രോഗങ്ങളിൽ നിന്ന് സംരക്ഷണം നൽകുന്ന ജീവകങ്ങളും (Vitamins) ധാതുക്കളും പഴങ്ങളിലും പച്ചക്കറികളിലുമാണ് ധാരാളമുള്ളത്.',
      funFactEn: '3D Model: Explore the 3D Glossy Red Apple, Citrus Orange, Carrot & Fresh Broccoli!',
      funFactMl: '3D മോഡൽ: രോഗപ്രതിരോധം നൽകുന്ന 3D ആപ്പിളും ക്യാരറ്റും പഴങ്ങളും!',
      materialNote: 'Waxy Clearcoat Apple Skin + Dimpled Citrus Peel + Organic Florets',
      environmentPreset: 'nature',
      modelType: 'vitamins_protect',
    });
  }

  if (tLower.includes('pyramid') || (tLower.includes('balanced') && tLower.includes('diet'))) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Food Pyramid',
      emoji: '🥗',
      explanationEn:
        'A Balanced Diet gives our body all 5 essential nutrients in the right proportions! The 3D Food Pyramid shows: Eat mostly grains at the base, plenty of fruits/veggies, moderate dairy/proteins, and a tiny pinch of sweets on top!',
      explanationMl:
        'ശരിയായ അളവിൽ എല്ലാ പോഷകങ്ങളും നൽകുന്ന ഭക്ഷണക്രമമാണ് സമീകൃതാഹാരം.',
      funFactEn: '3D Model: Rotate the 4-Tier Glowing 3D Balanced Food Pyramid!',
      funFactMl: '3D മോഡൽ: നാല് തട്ടുകളുള്ള 3D ഫുഡ് പിരമിഡ് കറക്കി നോക്കൂ!',
      materialNote: '4-Tier Satin Acrylic Tiers + Golden Star Apex',
      environmentPreset: 'science_lab',
      modelType: 'food_pyramid',
    });
  }

  if (tLower.includes('preservation') || tLower.includes('drying') || tLower.includes('freezing') || tLower.includes('salting')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Food Preservation 3D',
      emoji: '❄️',
      explanationEn:
        'Food Preservation stops germs from spoiling food! Methods include: 1) Freezing in refrigerators, 2) Sun Drying, 3) Salting & Pickling in ceramic Bharani jars, 4) Sweetening (jams), and 5) Boiling & Canning.',
      explanationMl:
        'ഭക്ഷണം കേടാകാതെ സൂക്ഷിക്കുന്ന രീതികൾ: തണുപ്പിക്കൽ (Freezing), വെയിലിൽ ഉണക്കൽ (Drying), ഉപ്പിലിടൽ (Salting - ഭരണിയിലെ അച്ചാറുകൾ).',
      funFactEn: '3D Model: Inspect the 3D Refrigerator, Translucent Ice Cubes & Ceramic Pickle Jar!',
      funFactMl: '3D മോഡൽ: ഫ്രിഡ്ജും ഐസ് ക്യൂബുകളും പരമ്പരാഗത അച്ചാർ ഭരണിയും!',
      materialNote: 'Brushed Stainless Steel Fridge + Refractive Ice + Glazed Ceramic Bharani',
      environmentPreset: 'science_lab',
      modelType: 'food_preservation',
    });
  }

  if (tLower.includes('incisor') || tLower.includes('canine') || tLower.includes('premolar') || tLower.includes('molar') || tLower.includes('type of teeth') || tLower.includes('sets of teeth')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '4 Types of Teeth 3D',
      emoji: '🦷',
      explanationEn:
        'Children have 20 Milk Teeth, and adults have 32 Permanent Teeth! Our jaw has 4 specialized tooth tools: 8 sharp Incisors (biting), 4 pointed Canines (tearing), 8 broad Premolars (crushing), and 12 strong Molars (grinding)!',
      explanationMl:
        'മനുഷ്യന്റെ താടിയെല്ലിൽ 4 തരം പല്ലുകളുണ്ട്: ഉളിപ്പല്ലുകൾ (Incisors), ദംഷ്ട്രകൾ (Canines), അഗ്രചർവണകങ്ങളും ചർവണകങ്ങളും (Premolars & Molars).',
      funFactEn: '3D Model: Rotate the 3D Dental Jaw Arch showing Incisors, Canines & Molars!',
      funFactMl: '3D മോഡൽ: താടിയെല്ലിലെ 4 തരം പല്ലുകളുടെ 3D മാതൃക!',
      materialNote: 'High-Gloss Pearlescent Tooth Enamel + Soft Pink Gingiva Gum Tissue',
      environmentPreset: 'science_lab',
      modelType: 'tooth_jaw',
    });
  }

  if (tLower.includes('structure') || tLower.includes('enamel') || tLower.includes('dentine') || tLower.includes('pulp')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Tooth Enamel & Pulp 3D',
      emoji: '✨',
      explanationEn:
        'A tooth has a visible Crown and a Root anchored in the jawbone! Inside: 1) Enamel (hardest white substance in the human body!), 2) Dentine (yellow bone-like layer), and 3) Pulp (soft inner chamber with blood vessels & nerves).',
      explanationMl:
        'പല്ലിന്റെ പുറമെയുള്ള കടുപ്പമേറിയ വെളുത്ത പാളിയാണ് ഇനാമൽ (Enamel). അതിനടിയിലുള്ള മഞ്ഞ പാളിയാണ് ഡെന്റൈൻ (Dentine). ഉൾഭാഗമാണ് പൾപ്പ് (Pulp).',
      funFactEn: '3D Model: Inspect the Split 3D Tooth Cross-Section with Enamel, Dentine & Nerve Pulp!',
      funFactMl: '3D മോഡൽ: ഇനാമലും പൾപ്പും ഞരമ്പുകളും വ്യക്തമായി കാണിക്കുന്ന പല്ലിന്റെ 3D പരിച്ഛേദം!',
      materialNote: 'Clearcoat White Enamel + Ivory Dentine + Vascular Crimson Pulp',
      environmentPreset: 'science_lab',
      modelType: 'tooth_cross_section',
    });
  }

  if (tLower.includes('digestive system') || tLower.includes('stomach') || tLower.includes('journey of food') || tLower.includes('intestine')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Digestive System 3D',
      emoji: '🫀',
      explanationEn:
        'Digestion turns food into energy! The journey: 1) Mouth (saliva), 2) Food Pipe (Esophagus), 3) Stomach (churned with digestive juices), 4) Small Intestine (nutrients absorbed into blood), 5) Large Intestine!',
      explanationMl:
        'ഭക്ഷണം വായിൽ വെച്ച് ചവച്ചരച്ച് ആഹാരക്കുഴൽ വഴി ആമാശയത്തിലും (Stomach) ചെറുകുടലിലും എത്തി പോഷകങ്ങൾ രക്തത്തിലേക്ക് ആഗിരണം ചെയ്യുന്ന പ്രക്രിയയാണ് ദഹനം.',
      funFactEn: '3D Model: Follow the 3D Anatomical Digestive Track — Stomach, Liver & Intestines!',
      funFactMl: '3D മോഡൽ: ആമാശയവും കരളും കുടലുകളും അടങ്ങിയ 3D ദഹനവ്യവസ്ഥ!',
      materialNote: 'Anatomical Smooth Muscle Tissue + Glossy Organ Membrane',
      environmentPreset: 'science_lab',
      modelType: 'digestive_system',
    });
  }

  if (tLower.includes('hygiene') || tLower.includes('dental care') || tLower.includes('plaque') || tLower.includes('cavity') || tLower.includes('brush')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Dental Care & Molar 3D',
      emoji: '🪥',
      explanationEn:
        'Brush teeth twice a day—morning and before bedtime! Sticky sugar left on teeth feeds bacteria that make acid, leading to yellow Plaque and Tooth Decay (Cavities).',
      explanationMl:
        'ദിവസവും രണ്ട് നേരം പല്ല് തേയ്ക്കണം! മധുരപലഹാരങ്ങൾ പല്ലിൽ പറ്റിപ്പിടിച്ചിരുന്നാൽ ബാക്ടീരിയകൾ ആസിഡ് ഉല്പാദിപ്പിച്ച് പല്ലിൽ പോടുകൾ (Cavities) ഉണ്ടാക്കുന്നു.',
      funFactEn: '3D Model: Inspect the Sparkling 3D Molar Tooth Crown & Roots!',
      funFactMl: '3D മോഡൽ: തിളങ്ങുന്ന 3D പല്ലിന്റെ മാതൃക!',
      materialNote: 'Polished Ceramic-White Enamel + Gum Base',
      environmentPreset: 'science_lab',
      modelType: 'tooth',
    });
  }

  if (tLower.includes('camel') || tLower.includes('desert animal')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Desert Camel 3D',
      emoji: '🐪',
      explanationEn:
        'The Camel is the "Ship of the Desert"! It stores fat in its Hump for energy, has wide padded hooves that never sink in sand, long eyelashes to block sandstorms, and survives days without water!',
      explanationMl:
        'ഒട്ടകത്തിന് മണലിൽ ആണ്ടുപോകാത്ത പരന്ന കാൽപാദങ്ങളും, കൊഴുപ്പ് സംഭരിക്കുന്ന പൂഞ്ഞയും (Hump) ഉണ്ട്.',
      funFactEn: '3D Model: Rotate the 3D Desert Camel with Hump & Padded Feet!',
      funFactMl: '3D മോഡൽ: മരുഭൂമിയിലെ ഒട്ടകത്തിന്റെ 3D മാതൃക കറക്കി കാണാം!',
      materialNote: 'Textured Golden-Brown Camel Coat + Desert Sand',
      environmentPreset: 'nature',
      modelType: 'animal_camel',
    });
  }

  if (tLower.includes('polar') || tLower.includes('penguin') || tLower.includes('bear') || tLower.includes('arctic') || tLower.includes('hibernation')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Polar Bear & Penguin 3D',
      emoji: '🐻‍❄️',
      explanationEn:
        'Polar Bears and Penguins thrive in freezing polar zones! They have a thick layer of fat under their skin called Blubber and dense waterproof fur or feathers to lock in warmth.',
      explanationMl:
        'ധ്രുവക്കരടികൾക്കും പെൻഗ്വിനുകൾക്കും കൊടുംതണുപ്പിൽ നിന്ന് രക്ഷനേടാൻ ചർമ്മത്തിനടിയിൽ കട്ടിയുള്ള കൊഴുപ്പ് പാളിയും (Blubber) രോമങ്ങളുമുണ്ട്.',
      funFactEn: '3D Model: Explore the 3D Polar Bear & Emperor Penguin on Floating Glacial Iceberg!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുമലയിൽ നിൽക്കുന്ന ധ്രുവക്കരടിയും പെൻഗ്വിനും 3D-യിൽ!',
      materialNote: 'Refractive Glacial Iceberg + Thick White Fur + Sleek Plumage',
      environmentPreset: 'alpine',
      modelType: 'animal_polar',
    });
  }

  if (tLower.includes('aquatic animal') || tLower.includes('fish') || tLower.includes('dolphin') || tLower.includes('gills') || tLower.includes('amphibian')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Aquatic Dolphin 3D',
      emoji: '🐬',
      explanationEn:
        'Water animals have streamlined bodies that cut smoothly through water! Fishes use Gills to breathe dissolved oxygen and fins to swim, while Dolphins breathe air through blowholes.',
      explanationMl:
        'ജലജീവികൾക്ക് വെള്ളത്തിൽ നീന്താൻ സഹായിക്കുന്ന ശരീരവും (Streamlined body), ചിറകുകളും, ശ്വസിക്കാൻ ചെകിളകളും (Gills) ഉണ്ട്.',
      funFactEn: '3D Model: Watch the 3D Leaping Dolphin in Ocean Waves!',
      funFactMl: '3D മോഡൽ: കടലിൽ നീന്തുന്ന 3D ഡോൾഫിൻ!',
      materialNote: 'Wet-Look Marine Skin + Translucent Ocean Waves',
      environmentPreset: 'ocean',
      modelType: 'animal_aquatic',
    });
  }

  if (tLower.includes('state') || tLower.includes('solid') || tLower.includes('liquid') || tLower.includes('gas') || tLower.includes('molecule')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3 States of Matter 3D',
      emoji: '🧊',
      explanationEn:
        'Everything is made of Matter! 1) Solids: molecules tightly packed in rigid grids, 2) Liquids: loosely packed molecules that flow, 3) Gases: molecules far apart zooming freely!',
      explanationMl:
        'പദാർത്ഥത്തിന്റെ മൂന്ന് അവസ്ഥകൾ: കട്ടിയുള്ള ഖരം (Solid), ഒഴുകുന്ന ദ്രാവകം (Liquid), തന്മാത്രകൾ വേഗത്തിൽ പായുന്ന വാതകം (Gas).',
      funFactEn: '3D Model: Inspect the 3 Glass Molecular Chambers (Solid Lattice, Flowing Liquid & Gas)!',
      funFactMl: '3D മോഡൽ: ഖര-ദ്രാവക-വാതക തന്മാത്രകളുടെ 3D ഗ്ലാസ് അറകൾ!',
      materialNote: 'Optical Glass Chambers + Metallic Atomic Spheres',
      environmentPreset: 'science_lab',
      modelType: 'matter_molecules',
    });
  }

  if (tLower.includes('melting') || tLower.includes('evaporat') || tLower.includes('condens') || tLower.includes('change')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Melting Ice & Steam 3D',
      emoji: '💨',
      explanationEn:
        'Heating and cooling change states of matter! Ice (Solid) melts with heat into Water (Liquid). Boiling water evaporates into Steam (Gas). Cooling steam condenses back into water!',
      explanationMl:
        'ചൂടാക്കുമ്പോൾ ഐസ് ഉരുകി വെള്ളമാകുന്നു (Melting), തിളപ്പിക്കുമ്പോൾ നീരാവിയാകുന്നു (Evaporation).',
      funFactEn: '3D Model: Watch the 3D Translucent Melting Ice Cube, Water Pool & Rising Steam!',
      funFactMl: '3D മോഡൽ: ഉരുകുന്ന ഐസ് ക്യൂബും ഉയരുന്ന നീരാവിയും 3D-യിൽ!',
      materialNote: 'Refractive Clear Ice Crystal + Liquid Puddle + Volumetric Steam',
      environmentPreset: 'science_lab',
      modelType: 'matter_change',
    });
  }

  if (tLower.includes('solute') || tLower.includes('solvent') || tLower.includes('solution') || tLower.includes('dissolv')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Chemistry Beaker 3D',
      emoji: '🧪',
      explanationEn:
        'When you stir sugar into water, you make a Solution! The substance that dissolves (sugar/salt) is the Solute, and the liquid that dissolves it (water) is the Solvent.',
      explanationMl:
        'പഞ്ചസാര വെള്ളത്തിൽ അലിയിക്കുമ്പോൾ ലായനി (Solution) ഉണ്ടാകുന്നു. അലിയുന്ന വസ്തു ലീനം (Solute), അലിയിക്കുന്ന ദ്രാവകം ലായകവുമാണ് (Solvent).',
      funFactEn: '3D Model: Swirl the 3D Borosilicate Glass Beaker with Dissolving Crystal Solute!',
      funFactMl: '3D മോഡൽ: ലായനി തയ്യാറാക്കുന്ന 3D കെമിസ്ട്രി ഗ്ലാസ് ബീക്കർ!',
      materialNote: 'Borosilicate Lab Glass + Aqueous Solution + Crystalline Solute',
      environmentPreset: 'science_lab',
      modelType: 'matter_beaker',
    });
  }

  if (tLower.includes('breeze') || tLower.includes('land breeze') || tLower.includes('sea breeze')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Land & Sea Breeze 3D',
      emoji: '🏖️',
      explanationEn:
        'By day, warm air over land rises and cool sea air rushes in (Sea Breeze). At night, land cools faster than the sea, so breeze blows from land towards the warm sea (Land Breeze).',
      explanationMl:
        'പകൽ സമയത്ത് കടലിൽ നിന്ന് കരയിലേക്ക് വീശുന്ന കാറ്റാണ് കടൽക്കാറ്റ് (Sea Breeze). രാത്രിയിൽ കരയിൽ നിന്ന് കടലിലേക്ക് വീശുന്ന കാറ്റാണ് കരക്കാറ്റ് (Land Breeze).',
      funFactEn: '3D Model: Inspect the Coastal Beach Diorama with Palm Tree & Convection Wind Flow!',
      funFactMl: '3D മോഡൽ: കാറ്റിന്റെ ഗതി കാണിക്കുന്ന 3D കടൽത്തീര മാതൃക!',
      materialNote: 'Golden Beach Sand + Translucent Sea Waves + Palm Fronds',
      environmentPreset: 'ocean',
      modelType: 'weather_breeze',
    });
  }

  if (tLower.includes('magnet') || tLower.includes('gravity') || tLower.includes('friction')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Horseshoe Magnet 3D',
      emoji: '🧲',
      explanationEn:
        'Forces make things move, stop, or change direction! Gravitational Force pulls everything towards Earth. Frictional Force slows sliding objects down. Magnetic Force attracts iron!',
      explanationMl:
        'ഭൂമി വസ്തുക്കളെ താഴേക്ക് വലിക്കുന്ന ഗുരുത്വാകർഷണ ബലവും (Gravity), ഘർഷണ ബലവും (Friction), കാന്തിക ബലവും (Magnetism) പ്രധാന ബലങ്ങളാണ്.',
      funFactEn: '3D Model: Rotate the 3D Red-Blue Alnico Horseshoe Magnet Attracting Chrome Iron Spheres!',
      funFactMl: '3D മോഡൽ: ഇരുമ്പ് ഗോളങ്ങളെ ആകർഷിക്കുന്ന 3D കാന്തം!',
      materialNote: 'Painted Alnico Magnet + Polished Chrome Steel Spheres',
      environmentPreset: 'science_lab',
      modelType: 'force_magnet',
    });
  }

  if (tLower.includes('solar energy') || (tLower.includes('energy') && !tLower.includes('food'))) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Solar Panel & Bulb 3D',
      emoji: '💡',
      explanationEn:
        'Energy is the ability to do work! Solar panels convert golden sunlight directly into clean electricity to power homes, streetlights, and glowing lightbulbs!',
      explanationMl:
        'സൗരോർജ്ജം (Solar Energy) ഉപയോഗിച്ച് സൗരോർജ്ജ പാനലുകൾ വഴി വൈദ്യുതി ഉല്പാദിപ്പിച്ച് വീടുകളും ബൾബുകളും പ്രകാശിപ്പിക്കാം.',
      funFactEn: '3D Model: Inspect the 3D Photovoltaic Solar Panel Grid & Glowing Filament Bulb!',
      funFactMl: '3D മോഡൽ: സൂര്യപ്രകാശം സ്വീകരിച്ച് ബൾബ് കത്തിക്കുന്ന 3D സോളാർ പാനൽ!',
      materialNote: 'Monocrystalline Silicon Solar Grid + Emissive Glass Bulb',
      environmentPreset: 'science_lab',
      modelType: 'solar_energy',
    });
  }

  if (tLower.includes('planet') || tLower.includes('solar system') || tLower.includes('sun') || tLower.includes('luminous')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Sun, Earth & Saturn 3D',
      emoji: '🪐',
      explanationEn:
        'Our Solar System has 8 planets orbiting the blazing Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune! The Sun is a luminous star, while planets reflect sunlight.',
      explanationMl:
        'സൂര്യനെ വലംവയ്ക്കുന്ന 8 ഗ്രഹങ്ങൾ: ബുധൻ, ശുക്രൻ, ഭൂമി, ചൊവ്വ, വ്യാഴം, ശനി, യുറാനസ്, നെപ്റ്റ്യൂൺ.',
      funFactEn: '3D Model: Explore the Blazing 3D Sun, Orbiting Blue Earth & Ringed Saturn!',
      funFactMl: '3D മോഡൽ: തിളങ്ങുന്ന സൂര്യനും ഭൂമിയും വളയങ്ങളുള്ള ശനി ഗ്രഹവും 3D-യിൽ!',
      materialNote: 'Emissive Solar Corona + Banded Gas Giant + Ice Rings',
      environmentPreset: 'science_lab',
      modelType: 'solar_planets',
    });
  }

  if (tLower.includes('noun') || tLower.includes('verb') || tLower.includes('adjective') || tLower.includes('pronoun') || tLower.includes('grammar') || tLower.includes('sentence') || tLower.includes('നാമം')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Grammar Stage Blocks',
      emoji: '🔤',
      explanationEn:
        'Words work together as building blocks in sentences! Nouns name persons, places, and things. Pronouns replace nouns. Adjectives describe qualities, and Verbs power actions!',
      explanationMl:
        'വ്യാകരണത്തിലെ പ്രധാന ഭാഗങ്ങൾ: നാമം (Noun), സർവ്വനാമം (Pronoun), നാമവിശേഷണം (Adjective), ക്രിയ (Verb).',
      funFactEn: '3D Model: Interlock the Colorful 3D Noun, Verb & Adjective Grammar Stage Blocks!',
      funFactMl: '3D മോഡൽ: വർണ്ണാഭമായ 3D വ്യാകരണ ബ്ലോക്കുകൾ!',
      materialNote: 'Lacquered Hardwood Blocks + Brushed Gold Arch',
      environmentPreset: 'playroom',
      modelType: 'grammar_stage',
    });
  }

  if (tLower.includes('കവിത') || tLower.includes('കഥ') || tLower.includes('ഭാഷ') || tLower.includes('poem') || tLower.includes('dolittle') || tLower.includes('ekalavya')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Golden Storybook & Lamp',
      emoji: '📖',
      explanationEn:
        'Literature and poetry open doors of imagination, empathy, and cultural wisdom! Explore classic prose tales, nature poems, and traditional Kerala literary heritage.',
      explanationMl:
        'ഭാഷയും സാഹിത്യവും ഭാവനയുടെ ലോകം തുറക്കുന്നു. കൊച്ചു കഥകളും കവിതകളും മാതൃഭാഷയുടെ മാധുര്യം കുട്ടികളിൽ നിറയ്ക്കുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Open Golden Storybook, Quill Pen & Traditional Brass Nilavilakku!',
      funFactMl: '3D മോഡൽ: തുറന്നുവെച്ച 3D പുസ്തകവും എഴുത്താണിയും നിലവിളക്കും!',
      materialNote: 'Parchment Pages + Leather Spine + Polished Brass Oil Lamp',
      environmentPreset: 'heritage',
      modelType: 'literature_book',
    });
  }

  if (tLower.includes('phonic') || tLower.includes('alphabet') || tLower.includes('letter') || tLower.includes('cvc') || tLower.includes('sight word') || tLower.includes('vowel') || tLower.includes('rhyme') || id.includes('ukg-listen')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Phonics & A-B-C Blocks',
      emoji: '🔤',
      explanationEn:
        'Learn the magic sounds of letters and spoken English! A is for Apple /æ/, B is for Ball /b/, C is for Cat /k/! Blend short vowels and CVC words to read and speak with confidence!',
      explanationMl:
        'അക്ഷരങ്ങളുടെ ശബ്ദങ്ങളും (Phonics) കൊച്ചു വാക്കുകളും സംഭാഷണങ്ങളും സന്തോഷത്തോടെ പഠിക്കാം!',
      funFactEn: '3D Model: Rotate the 3D Wooden Letter Blocks A-B-C with Glossy Apple & Bouncing Ball!',
      funFactMl: '3D മോഡൽ: കൊച്ചുകുട്ടികൾക്കായുള്ള 3D അക്ഷര ബ്ലോക്കുകളും ആപ്പിളും പന്തും!',
      materialNote: 'Painted Maple Wood Blocks + Clearcoat Red Apple + Rubber Ball',
      environmentPreset: 'playroom',
      modelType: 'phonics_abc',
    });
  }

  if (tLower.includes('fraction') || tLower.includes('numerator') || tLower.includes('half') || tLower.includes('quarter') || tLower.includes('decimal')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Fraction Pie Wheel',
      emoji: '🍕',
      explanationEn:
        'A Fraction represents equal parts of a whole! In 3/4, the Denominator (4) tells how many equal slices the whole is divided into, and the Numerator (3) tells how many slices we have!',
      explanationMl:
        'ഒരു പൂർണ്ണ വസ്തുവിന്റെ തുല്യ ഭാഗങ്ങളെയാണ് ഭിന്നസംഖ്യ (Fraction) എന്ന് വിളിക്കുന്നത്.',
      funFactEn: '3D Model: Inspect the 3D Sliced Fraction Wheel (1/4, 1/2, 3/4, Whole)!',
      funFactMl: '3D മോഡൽ: തുല്യ കഷ്ണങ്ങളാക്കിയ 3D ഭിന്നസംഖ്യാ ചക്രം!',
      materialNote: 'Satin Precision Wedges + Metallic Divider Rim',
      environmentPreset: 'science_lab',
      modelType: 'fraction_pie',
    });
  }

  if (tLower.includes('clock') || tLower.includes('time') || tLower.includes('hour') || tLower.includes('minute') || tLower.includes('rupee')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Analog Clock & Time',
      emoji: '⏰',
      explanationEn:
        'A clock face has 12 hours and 60 minutes! The short hand points to the Hour, and the long hand points to the Minutes. 1 Hour = 60 Minutes, and 1 Day = 24 Hours!',
      explanationMl:
        'ക്ലോക്കിലെ ചെറിയ സൂചി മണിക്കൂറിനെയും വലിയ സൂചി മിനിറ്റിനെയും സൂചിപ്പിക്കുന്നു. 1 മണിക്കൂർ = 60 മിനിറ്റ്.',
      funFactEn: '3D Model: Rotate the 3D Clock Face with Hour, Minute & Second Hands!',
      funFactMl: '3D മോഡൽ: മണിക്കൂർ-മിനിറ്റ് സൂചികളുള്ള 3D ക്ലോക്ക്!',
      materialNote: 'Anodized Blue Clock Case + Tempered Glass Dial',
      environmentPreset: 'playroom',
      modelType: 'clock',
    });
  }

  if (tLower.includes('count') || tLower.includes('number') || tLower.includes('addition') || tLower.includes('subtraction') || tLower.includes('before') || tLower.includes('skip counting')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Counting Abacus',
      emoji: '🔢',
      explanationEn:
        'Slide colorful beads on the 3D Wooden Abacus to master counting, addition (+), subtraction (-), and skip counting by 2s, 5s, and 10s!',
      explanationMl:
        '3D അബാക്കസിലെ വർണ്ണ മുത്തുകൾ നിരക്കി എണ്ണലും കൂട്ടലും കുറയ്ക്കലും ലളിതമായി പഠിക്കാം!',
      funFactEn: '3D Model: Slide the 3D Glossy Counting Beads on the Wooden Math Abacus!',
      funFactMl: '3D മോഡൽ: വർണ്ണ മുത്തുകളുള്ള 3D കുട്ടികളുടെ അബാക്കസ്!',
      materialNote: 'Teak Wood Frame + Chrome Steel Rods + Glossy Acrylic Beads',
      environmentPreset: 'playroom',
      modelType: 'abacus_count',
    });
  }

  if (cLower.includes('math') || tLower.includes('digit') || tLower.includes('place value') || tLower.includes('multiplication') || tLower.includes('factor') || tLower.includes('multiple')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Place Value Abacus',
      emoji: '🧮',
      explanationEn:
        `Mastering "${topic}": Each rod on the 3D Abacus represents a place value column (Lakhs, Ten-Thousands, Thousands, Hundreds, Tens, Ones) for visualizing large numbers, factors, and multiples!`,
      explanationMl:
        `"${topic}" ലളിതമായി പഠിക്കാം: 3D അബാക്കസിലെ ഓരോ തൂണും ഒന്ന്, പത്ത്, നൂറ്, ആയിരം എന്നീ സ്ഥാനവിലകളെ (Place Value) സൂചിപ്പിക്കുന്നു.`,
      funFactEn: '3D Model: Explore the 3D Multi-Rod Place Value Abacus & Counting Beads!',
      funFactMl: '3D മോഡൽ: മുത്തുകളുള്ള 3D സ്ഥാനവില അബാക്കസ് കറക്കി നോക്കൂ!',
      materialNote: 'Hardwood Base + Brushed Steel Rods + Polished Torus Beads',
      environmentPreset: 'science_lab',
      modelType: 'abacus',
    });
  }

  if (tLower.includes('body') || tLower.includes('sense') || tLower.includes('myself') || tLower.includes('habit') || tLower.includes('animal')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '5 Senses & Body 3D',
      emoji: '🖐️',
      explanationEn:
        'Our 5 magical Sense Organs: Eyes to see 👁️, Ears to hear 👂, Nose to smell 👃, Tongue to taste 👅, and Skin/Hands to touch and feel! Good hygiene habits keep us strong!',
      explanationMl:
        'നമ്മുടെ പഞ്ചേന്ദ്രിയങ്ങൾ: കാണാൻ കണ്ണുകൾ, കേൾക്കാൻ കാതുകൾ, മണം അറിയാൻ മൂക്ക്, രുചിക്കാൻ നാവ്, സ്പർശിക്കാൻ കൈകൾ!',
      funFactEn: '3D Model: Explore the 3D Sense Organs Display & Waving Hand!',
      funFactMl: '3D മോഡൽ: പഞ്ചേന്ദ്രിയങ്ങളുടെയും ആരോഗ്യ ശീലങ്ങളുടെയും 3D മാതൃക!',
      materialNote: 'Smooth Sculpted Clay Finish + Glossy Iris Optics',
      environmentPreset: 'playroom',
      modelType: 'ukg_senses',
    });
  }

  if (tLower.includes('transport') || tLower.includes('highway') || tLower.includes('railway') || tLower.includes('port')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Express Locomotive',
      emoji: '🚆',
      explanationEn:
        'India is connected by Roadways (National Highways), Railways (Express & Metro trains), Waterways (Ships & Ports like Kochi and Mumbai), and Airways!',
      explanationMl:
        'ഇന്ത്യയിലെ 4 പ്രധാന ഗതാഗത മാർഗ്ഗങ്ങൾ: റോഡ്, റെയിൽവേ, ജലഗതാഗതം, വ്യോമഗതാഗതം.',
      funFactEn: '3D Model: Inspect the 3D Express Locomotive Train on Steel Tracks!',
      funFactMl: '3D മോഡൽ: 3D എക്സ്പ്രസ് ട്രെയിനും റെയിൽവേ ട്രാക്കും കറക്കി നോക്കൂ!',
      materialNote: 'Metallic Blue Locomotive + Steel Rails + Ballast Gravel',
      environmentPreset: 'science_lab',
      modelType: 'train_transport',
    });
  }

  if (tLower.includes('communication') || tLower.includes('satellite') || tLower.includes('internet')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Space Satellite',
      emoji: '🛰️',
      explanationEn:
        'Mass Communication reaches millions of people at once through Newspapers, Television, Radio, Internet, and Artificial Satellites orbiting high above the Earth!',
      explanationMl:
        'ബഹിരാകാശത്തെ കൃത്രിമോപഗ്രഹങ്ങൾ (Satellites) വാർത്താവിനിമയവും ഇന്റർനെറ്റും കാലാവസ്ഥാ പ്രവചനവും സാധ്യമാക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Orbiting Communication Satellite with Solar Wings!',
      funFactMl: '3D മോഡൽ: സോളാർ പാനലുകളുള്ള 3D വാർത്താവിനിമയ ഉപഗ്രഹം!',
      materialNote: 'Gold Foil Satellite Bus + Photovoltaic Wings + Parabolic Dish',
      environmentPreset: 'science_lab',
      modelType: 'satellite',
    });
  }

  if (tLower.includes('pollution') || tLower.includes('waste') || tLower.includes('biodegradable') || tLower.includes('recycle')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Eco 3Rs & Wind Turbine',
      emoji: '♻️',
      explanationEn:
        'Separate waste into Green Bins (Biodegradable compostable waste) and Blue Bins (Non-Biodegradable recyclable plastic, glass, metal) and practice the 3 Rs: Reduce, Reuse, and Recycle!',
      explanationMl:
        'ജൈവ മാലിന്യങ്ങൾ പച്ച ബിന്നിലും അജൈവ മാലിന്യങ്ങൾ നീല ബിന്നിലും ശേഖരിച്ച് Reduce, Reuse, Recycle എന്നീ 3 Rs ശീലമാക്കാം.',
      funFactEn: '3D Model: Explore the 3D Green & Blue Eco-Bins and Clean Energy Wind Turbine!',
      funFactMl: '3D മോഡൽ: ഹരിത-നീല റീസൈക്ലിംഗ് ബിന്നുകളും കാറ്റാടിയന്ത്രവും 3D-യിൽ!',
      materialNote: 'Molded Eco-Bins + Composite Wind Turbine Blades',
      environmentPreset: 'nature',
      modelType: 'recycle_bin',
    });
  }

  if (tLower.includes('monument') || tLower.includes('taj mahal') || tLower.includes('dance') || tLower.includes('festival') || tLower.includes('heritage') || tLower.includes('language')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Heritage Monuments 3D',
      emoji: '🕌',
      explanationEn:
        `India’s Unity in Diversity shines through "${topic}"! From world-famous monuments like the Taj Mahal, Red Fort, and Sanchi Stupa to classical dances and harvest festivals like Onam and Pongal.`,
      explanationMl:
        `നാനാത്വത്തിൽ ഏകത്വം വിളിച്ചോതുന്ന "${topic}": താജ്മഹൽ, ചെങ്കോട്ട, സാഞ്ചി സ്തൂപം തുടങ്ങിയ ചരിത്രസ്മാരകങ്ങളും കലാരൂപങ്ങളും ഉത്സവങ്ങളും.`,
      funFactEn: '3D Model: Rotate the 3D Heritage Dome, Carved Pillars & Archway!',
      funFactMl: '3D മോഡൽ: ചരിത്രസ്മാരക ഗോപുരവും തൂണുകളും 3D-യിൽ കാണാം!',
      materialNote: 'Carved Sandstone & Marble + Golden Finial',
      environmentPreset: 'heritage',
      modelType: 'monument',
    });
  }

  if (tLower.includes('kharif') || tLower.includes('rabi') || tLower.includes('crop') || tLower.includes('mineral') || tLower.includes('industry') || tLower.includes('revolution')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: 'Crops & Minerals 3D',
      emoji: '🌾',
      explanationEn:
        `Exploring "${topic}": India grows Kharif crops (Rice, Cotton in monsoon) and Rabi crops (Wheat, Mustard in winter), while underground minerals (Iron, Coal, Gold) power our industries!`,
      explanationMl:
        `"${topic}": മൺസൂൺ കാലത്തെ ഖാരിഫ് വിളകളും ശൈത്യകാലത്തെ റാബി വിളകളും ഇരുമ്പ്-കൽക്കരി ധാതുക്കളും ഇന്ത്യയുടെ കാർഷിക-വ്യവസായ മേഖലകളെ ശക്തിപ്പെടുത്തുന്നു.`,
      funFactEn: '3D Model: Inspect the 3D Agricultural Harvest & Mineral Resource Model!',
      funFactMl: '3D മോഡൽ: കാർഷിക വിളകളുടെയും ധാതുസമ്പത്തിന്റെയും 3D മാതൃക!',
      materialNote: 'Natural Soil & Foliage + Metallic Ore Crystals',
      environmentPreset: 'nature',
      modelType: tLower.includes('mineral') || tLower.includes('industry') ? 'coins' : 'tree_leaf',
    });
  }

  if (tLower.includes('force') || tLower.includes('lever') || tLower.includes('pulley') || tLower.includes('machine') || tLower.includes('work')) {
    return withDefaults({
      index,
      title: topic,
      shortLabel: '3D Simple Machines',
      emoji: '⚙️',
      explanationEn:
        `Understanding "${topic}": Simple Machines — Lever, Pulley, Wheel & Axle, Inclined Plane, Wedge, and Screw — multiply force and make heavy work much easier!`,
      explanationMl:
        `"${topic}": ഉത്തോലകം (Lever), കപ്പി (Pulley), ചരിവുതലം (Inclined Plane) തുടങ്ങിയ ലഘുയന്ത്രങ്ങൾ ജോലി എളുപ്പമാക്കുന്നു.`,
      funFactEn: '3D Model: Explore the 3D Lever Plank, Fulcrum, Heavy Load & Effort Sphere!',
      funFactMl: '3D മോഡൽ: ലഘുയന്ത്രങ്ങളുടെ (Lever & Fulcrum) 3D പ്രവർത്തന മാതൃക!',
      materialNote: 'Anodized Steel Beam + Brass Fulcrum + Cast Iron Weights',
      environmentPreset: 'science_lab',
      modelType: 'lever_machine',
    });
  }

  const fallbackModels: ModelType3D[] = ['literature_book', 'monument', 'globe', 'tree_leaf', 'compass', 'hourglass'];
  return withDefaults({
    index,
    title: topic,
    shortLabel: topic.split(':')[0].slice(0, 22),
    emoji: ['📘', '🏛️', '🌍', '🌳', '🧭', '⏳'][index % 6],
    explanationEn: `Key Concept ${index + 1} in "${chapter.title}": ${topic}. ${chapter.summary}`,
    explanationMl: `"${chapter.malayalamTitle}" എന്ന പാഠത്തിലെ പ്രധാന ആശയം (${index + 1}): ${topic}. ${chapter.malayalamSummary}`,
    funFactEn: `3D Interactive Model for: ${topic}`,
    funFactMl: `3D മാതൃക: ${topic}`,
    modelType: fallbackModels[index % fallbackModels.length],
  });
}
