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
  | 'language_storybook';

export interface TopicDetail {
  index: number;
  title: string;
  shortLabel: string;
  emoji: string;
  explanationEn: string;
  explanationMl: string;
  funFactEn: string;
  funFactMl: string;
  modelType:
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
    | 'trophy_star';
}

export function getChapterDioramaTheme(chapter: TextbookChapter, subject?: Subject | null): DioramaTheme {
  const id = chapter.id.toLowerCase();
  const text = `${chapter.title} ${chapter.summary} ${(chapter.topics || []).join(' ')}`.toLowerCase();

  // Social Science Class 4 (Evergreen Publications) exact chapter mappings
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

  // Science Class 4 exact chapter mappings
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

  // Mathematics exact chapter mappings
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
  const tLower = topic.toLowerCase();
  const cLower = chapter.title.toLowerCase();

  // Specific topic intelligence for exact curriculum explanations & 3D sub-models
  if (tLower.includes('what is history') || tLower.includes('family vs national')) {
    return {
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
      modelType: 'monument',
    };
  }

  if (tLower.includes('three periods') || (tLower.includes('ancient') && tLower.includes('medieval'))) {
    return {
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
      modelType: 'hourglass',
    };
  }

  if (tLower.includes('archaeological sources') || tLower.includes('coins') || tLower.includes('inscriptions')) {
    return {
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
      modelType: 'coins',
    };
  }

  if (tLower.includes('literary sources') || tLower.includes('manuscript') || tLower.includes('palm-leaf')) {
    return {
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
      modelType: 'scroll',
    };
  }

  if (tLower.includes('archaeologist') || tLower.includes('historian')) {
    return {
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
      modelType: 'magnifier',
    };
  }

  // Chapter 2: Almanac, Calendars & Timelines
  if (tLower.includes('almanac') || tLower.includes('calendar') || tLower.includes('leap year')) {
    return {
      index,
      title: topic,
      shortLabel: 'Almanac & Calendar',
      emoji: '📅',
      explanationEn:
        'An Almanac is an annual reference book showing calendars, sunrise/sunset times, moon phases, eclipses, and festivals! In India, we use both the Gregorian Calendar (Jan–Dec, 365 days; 366 days in a Leap Year every 4 years) and the Saka National Calendar (starting with Chaitra).',
      explanationMl:
        'ഒരു വർഷത്തെ തീയതികൾ, ഗ്രഹണങ്ങൾ, ഉത്സവങ്ങൾ, കാലാവസ്ഥ എന്നിവ രേഖപ്പെടുത്തിയ പഞ്ചാംഗമാണ് Almanac. 4 വർഷത്തിലൊരിക്കൽ ഫെബ്രുവരിയിൽ 29 ദിവസങ്ങളുള്ള അധിവർഷവും (Leap Year - 366 Days) ഇതിലൂടെ പഠിക്കാം.',
      funFactEn: '3D Model: Inspect the 3D Solar-Lunar Calendar & Time Dial!',
      funFactMl: '3D മോഡൽ: 3D കലണ്ടറും സൂര്യ-ചന്ദ്ര ചലന മാതൃകയും!',
      modelType: 'hourglass',
    };
  }

  if (tLower.includes('timeline') || tLower.includes('chronolog') || tLower.includes('bce')) {
    return {
      index,
      title: topic,
      shortLabel: 'BCE & CE Timeline',
      emoji: '📏',
      explanationEn:
        'A Timeline arranges historical events in Chronological Order (from earliest to latest). Years before year 1 are called BCE (Before Common Era / BC) and count backward (e.g., 500 BCE came before 200 BCE). Years after year 1 are called CE (Common Era / AD) and count forward (e.g., 1947 CE, 2026 CE)!',
      explanationMl:
        'സംഭവങ്ങൾ നടന്ന ക്രമത്തിൽ (Chronological Order) രേഖപ്പെടുത്തുന്ന രേഖയാണ് Timeline. ബി.സി.ഇ (BCE - Before Common Era) വർഷങ്ങൾ പിന്നോട്ടും, സി.ഇ (CE - Common Era) വർഷങ്ങൾ മുന്നോട്ടും എണ്ണുന്നു.',
      funFactEn: '3D Model: Walk across the 3D Chronological BCE ↔ CE Timeline Bridge!',
      funFactMl: '3D മോഡൽ: BCE മുതൽ CE വരെയുള്ള 3D ടൈംലൈൻ പാലം!',
      modelType: 'hourglass',
    };
  }

  // Chapter 3: Civics
  if (tLower.includes('citizen') || tLower.includes('public property') || tLower.includes('election') || tLower.includes('government') || tLower.includes('constitution')) {
    return {
      index,
      title: topic,
      shortLabel: 'Good Citizenship',
      emoji: '🇮🇳',
      explanationEn:
        'A good citizen loves their country, obeys laws, helps neighbours, and protects Public Property (schools, parks, buses, trains, and historical monuments) because they belong to all of us! When citizens reach age 18, they vote in Elections to choose leaders in our Democracy.',
      explanationMl:
        'രാജ്യത്തെ നിയമങ്ങൾ പാലിക്കുകയും പൊതുമുതൽ (പാർക്കുകൾ, ബസുകൾ, സ്കൂളുകൾ, ചരിത്രസ്മാരകങ്ങൾ) സ്വന്തം സ്വത്ത് പോലെ സംരക്ഷിക്കുകയും ചെയ്യുന്നവനാണ് ഉത്തമ പൗരൻ. ജനാധിപത്യത്തിൽ വോട്ട് ചെയ്ത് നേതാക്കളെ തിരഞ്ഞെടുക്കുന്നു.',
      funFactEn: '3D Model: Explore the 3D Civic Parliament Dome & National Tricolour Flag!',
      funFactMl: '3D മോഡൽ: പാർലമെന്റ് മന്ദിരവും ദേശീയ പതാകയും 3D-യിൽ കാണാം!',
      modelType: 'flag_parliament',
    };
  }

  // Chapter 4, 5, 6: Earth, Globe, Compass, Mountains, Landforms
  if (tLower.includes('rotation') || tLower.includes('revolution') || tLower.includes('globe') || tLower.includes('continent') || tLower.includes('domain')) {
    return {
      index,
      title: topic,
      shortLabel: 'Earth & Globe 3D',
      emoji: '🌍',
      explanationEn:
        'Our Earth spins on its tilted axis once every 24 hours (Rotation → causing Day & Night) and orbits around the Sun in 365¼ days (Revolution → causing Seasons). Its 4 domains are Lithosphere (land), Hydrosphere (water), Atmosphere (air), and Biosphere (living world).',
      explanationMl:
        'ഭൂമി സ്വന്തം അച്ചുതണ്ടിൽ 24 മണിക്കൂർ കൊണ്ട് കറങ്ങുന്നതിനെ ഭ്രമണം (Rotation - രാവും പകലും) എന്നും, സൂര്യനെ 365¼ ദിവസം കൊണ്ട് വലംവയ്ക്കുന്നതിനെ പരിക്രമണം (Revolution - ഋതുക്കൾ) എന്നും വിളിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the Tilted 3D Earth Globe with Equator & Orbit Ring!',
      funFactMl: '3D മോഡൽ: അച്ചുതണ്ടിൽ കറങ്ങുന്ന 3D ഭൂഗോളം തിരിച്ചു നോക്കൂ!',
      modelType: 'globe',
    };
  }

  if (tLower.includes('direction') || tLower.includes('compass') || tLower.includes('scale') || tLower.includes('map')) {
    return {
      index,
      title: topic,
      shortLabel: 'Compass & Map',
      emoji: '🧭',
      explanationEn:
        'Maps use 4 Cardinal Directions (North, South, East, West) and 4 Intermediate Directions (NE, NW, SE, SW). Map Scale shows the ratio between map distance and real ground distance, while Colours (Blue for water, Green for plains, Brown for mountains) and Symbols help us read any map easily!',
      explanationMl:
        'ഭൂപടങ്ങളിൽ വടക്ക്, തെക്ക്, കിഴക്ക്, പടിഞ്ഞാറ് എന്നീ 4 പ്രധാന ദിശകളും ഉപദിശകളും ഉപയോഗിക്കുന്നു. ജലാശയങ്ങൾക്ക് നീലയും, സമതലങ്ങൾക്ക് പച്ചയും, പർവ്വതങ്ങൾക്ക് തവിട്ടുനിറവും ഭൂപടത്തിൽ നൽകുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Golden Compass Rose & Topographical Map!',
      funFactMl: '3D മോഡൽ: 3D വടക്കുനോക്കിയന്ത്രവും (Compass) ഭൂപടവും!',
      modelType: 'compass',
    };
  }

  if (tLower.includes('himalaya') || tLower.includes('mountain') || tLower.includes('landform') || tLower.includes('plateau') || tLower.includes('plain')) {
    return {
      index,
      title: topic,
      shortLabel: 'Mountains & Plains',
      emoji: '🏔️',
      explanationEn:
        'India has 6 spectacular physical divisions: 1) The snow-capped Himalayas (Himadri, Himachal, Shiwalik), 2) Fertile Northern Plains watered by Ganga, Indus & Brahmaputra, 3) The Great Indian Thar Desert, 4) The mineral-rich Southern Deccan Plateau, 5) Eastern & Western Coastal Plains, and 6) Andaman & Nicobar and Lakshadweep Islands!',
      explanationMl:
        'ഇന്ത്യയുടെ ഭൂപ്രകൃതി: മഞ്ഞുമൂടിയ ഹിമാലയ പർവ്വതനിരകൾ (ഹിമാദ്രി, ഹിമാചൽ, ശിവാലിക്), ഗംഗാ സമതലം, താർ മരുഭൂമി, ഡെക്കാൻ പീഠഭൂമി, തീരസമതലങ്ങൾ, ലക്ഷദ്വീപ്-ആൻഡമാൻ ദ്വീപുകൾ.',
      funFactEn: '3D Model: Explore the Snow-Capped 3D Himalayan Peaks, Plateau & Flowing River!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുമൂടിയ ഹിമാലയ കൊടുമുടികളും നദിയും പീഠഭൂമിയും 3D-യിൽ!',
      modelType: 'mountain',
    };
  }

  // Water, Climate, Dam
  if (tLower.includes('monsoon') || tLower.includes('river') || tLower.includes('dam') || tLower.includes('water') || tLower.includes('weather') || tLower.includes('season')) {
    return {
      index,
      title: topic,
      shortLabel: 'Rivers, Dams & Rain',
      emoji: '🌧️',
      explanationEn:
        'India experiences Summer, Monsoon (Rainy), and Winter seasons. Multi-purpose River Valley Dams (like Bhakra Nangal, Hirakud, and Idukki Dam in Kerala) store river water in reservoirs to irrigate farm fields, control floods, and generate clean Hydroelectricity!',
      explanationMl:
        'വേനൽക്കാലം, മൺസൂൺ മഴക്കാലം, ശൈത്യകാലം എന്നിവയാണ് ഇന്ത്യയിലെ പ്രധാന ഋതുക്കൾ. ഇടുക്കി, ഭക്രാനംഗൽ തുടങ്ങിയ അണക്കെട്ടുകൾ (Dams) കൃഷിക്കും ജലവൈദ്യുതി ഉല്പാദനത്തിനും സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Watch the 3D Rain Clouds, Hydroelectric Dam & Reservoir!',
      funFactMl: '3D മോഡൽ: മഴമേഘങ്ങളും അണക്കെട്ടും ജലസംഭരണിയും 3D-യിൽ!',
      modelType: 'river_dam',
    };
  }

  // Plants, Forests, Soil, Photosynthesis
  if (tLower.includes('photosynthesis') || tLower.includes('leaf') || tLower.includes('plant') || tLower.includes('forest') || tLower.includes('soil') || tLower.includes('wildlife')) {
    return {
      index,
      title: topic,
      shortLabel: 'Plants, Soil & Forests',
      emoji: '🌳',
      explanationEn:
        'Green plants make their own food in their leaves through Photosynthesis using Sunlight, Water from soil roots, Carbon Dioxide from air, and green Chlorophyll — releasing fresh Oxygen for us to breathe! Fertile Alluvial and Black soils support rich crops and Evergreen & Deciduous forests.',
      explanationMl:
        'സൂര്യപ്രകാശം, മണ്ണിലെ ജലം, കാർബൺ ഡൈ ഓക്സൈഡ്, ഹരിതകം (Chlorophyll) എന്നിവ ഉപയോഗിച്ച് സസ്യങ്ങൾ ആഹാരം നിർമ്മിക്കുന്ന പ്രക്രിയയാണ് പ്രകാശസംശ്ലേഷണം (Photosynthesis). ഇത് നമുക്ക് ശ്വസിക്കാൻ ഓക്സിജൻ നൽകുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Tree Canopy, Root Soil Layers & Sunlight Energy!',
      funFactMl: '3D മോഡൽ: വൃക്ഷവും വേരുകളും മണ്ണിന്റെ പാളികളും സൂര്യപ്രകാശവും 3D-യിൽ!',
      modelType: 'tree_leaf',
    };
  }

  // Science Ch 1: Food & Nutrition - Distinct Topic Models
  if (tLower.includes('carbohydrate') || tLower.includes('energy-giving') || (tLower.includes('fat') && !tLower.includes('adaptation'))) {
    return {
      index,
      title: topic,
      shortLabel: 'Carbohydrates & Fats',
      emoji: '🍞',
      explanationEn:
        'Carbohydrates (Rice, Wheat, Bread, Potatoes, Bananas) give us immediate energy to run, jump, think and study! Healthy fats (Butter, Ghee, Olive Oil, Nuts) store concentrated energy and keep our bodies warm.',
      explanationMl:
        'ശരീരത്തിന് വേഗത്തിൽ പ്രവർത്തിക്കാൻ ആവശ്യമായ ഊർജ്ജം നൽകുന്നത് കാർബോഹൈഡ്രേറ്റുകളും (അരി, ഗോതമ്പ്, കിഴങ്ങുകൾ) കൊഴുപ്പുകളുമാണ് (നെയ്യ്, വെണ്ണ, പരിപ്പുകൾ).',
      funFactEn: '3D Model: Inspect the 3D Crusty Bread Loaf, Steaming Rice Bowl & Potato!',
      funFactMl: '3D മോഡൽ: ഊർജ്ജം നൽകുന്ന 3D ധാന്യങ്ങളും റൊട്ടിയും ഉരുളക്കിഴങ്ങും കാണാം!',
      modelType: 'carbs_energy',
    };
  }

  if (tLower.includes('protein') || tLower.includes('body-building')) {
    return {
      index,
      title: topic,
      shortLabel: 'Proteins (Body-Building)',
      emoji: '🥛',
      explanationEn:
        'Proteins are the body-building blocks that help children grow taller, build strong muscles, and repair skin and cuts! Rich protein sources include Milk, Cheese, Eggs, Pulses (Dal), Fish, and Paneer.',
      explanationMl:
        'കുട്ടികളുടെ വളർച്ചയ്ക്കും പേശികളുടെയും കോശങ്ങളുടെയും പുനർനിർമ്മാണത്തിനും പ്രോട്ടീനുകൾ (പാൽ, മുട്ട, പരിപ്പുവർഗ്ഗങ്ങൾ, മത്സ്യം) അത്യാവശ്യമാണ്.',
      funFactEn: '3D Model: Rotate the 3D Milk Carton, Fresh Egg, Fish & Protein Pulses Bowl!',
      funFactMl: '3D മോഡൽ: വളർച്ചയ്ക്ക് സഹായിക്കുന്ന പാലും മുട്ടയും മീനും പരിപ്പും 3D-യിൽ!',
      modelType: 'proteins_body',
    };
  }

  if (tLower.includes('vitamin') || tLower.includes('mineral') || tLower.includes('protective')) {
    return {
      index,
      title: topic,
      shortLabel: 'Vitamins & Minerals',
      emoji: '🍎',
      explanationEn:
        'Vitamins (A, B, C, D, E, K) and Minerals (Calcium for strong bones, Iron for red blood) are Protective Foods! They protect our eyes, skin, and teeth, and build our immune shield against illnesses.',
      explanationMl:
        'രോഗങ്ങളിൽ നിന്ന് സംരക്ഷണം നൽകുന്ന ജീവകങ്ങളും (Vitamins) എല്ലുകൾക്ക് കരുത്തേകുന്ന കാൽസ്യവും ഇരുമ്പും പഴങ്ങളിലും പച്ചക്കറികളിലുമാണ് ധാരാളമുള്ളത്.',
      funFactEn: '3D Model: Explore the 3D Crunchy Red Apple, Citrus Orange, Carrot & Fresh Broccoli!',
      funFactMl: '3D മോഡൽ: രോഗപ്രതിരോധം നൽകുന്ന 3D ആപ്പിളും ക്യാരറ്റും പഴങ്ങളും!',
      modelType: 'vitamins_protect',
    };
  }

  if (tLower.includes('pyramid') || (tLower.includes('balanced') && tLower.includes('diet'))) {
    return {
      index,
      title: topic,
      shortLabel: '3D Food Pyramid',
      emoji: '🥗',
      explanationEn:
        'A Balanced Diet gives our body all 5 essential nutrients in the right proportions! The 3D Food Pyramid shows: Eat mostly grains at the base, plenty of fruits/veggies, moderate dairy/proteins, and only a tiny pinch of oils/sweets on top!',
      explanationMl:
        'ശരിയായ അളവിൽ എല്ലാ പോഷകങ്ങളും നൽകുന്ന ഭക്ഷണക്രമമാണ് സമീകൃതാഹാരം. ഫുഡ് പിരമിഡിൽ ധാന്യങ്ങൾ ഏറ്റവും അടിയിലും മധുരവും എണ്ണയും ഏറ്റവും മുകളിലും അടങ്ങിയിരിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 4-Tier Glowing 3D Balanced Food Pyramid!',
      funFactMl: '3D മോഡൽ: നാല് തട്ടുകളുള്ള 3D ഫുഡ് പിരമിഡ് കറക്കി നോക്കൂ!',
      modelType: 'food_pyramid',
    };
  }

  if (tLower.includes('preservation') || tLower.includes('drying') || tLower.includes('freezing') || tLower.includes('salting')) {
    return {
      index,
      title: topic,
      shortLabel: 'Food Preservation',
      emoji: '❄️',
      explanationEn:
        'Food Preservation stops germs from spoiling delicious food! Methods include: 1) Freezing / Cold Storage in refrigerators, 2) Sun Drying (raisins, fish), 3) Salting (traditional Kerala pickles in Bharani jars), 4) Sweetening with sugar syrup (jams), and 5) Boiling & Canning.',
      explanationMl:
        'ഭക്ഷണം കേടാകാതെ സൂക്ഷിക്കുന്ന രീതികൾ: തണുപ്പിക്കൽ (Freezing), വെയിലിൽ ഉണക്കൽ (Drying), ഉപ്പിലിടൽ (Salting - ഭരണിയിലെ അച്ചാറുകൾ), തിളപ്പിക്കൽ (Boiling).',
      funFactEn: '3D Model: Inspect the 3D Ice-Cooled Refrigerator, Drying Rack & Ceramic Pickle Jar!',
      funFactMl: '3D മോഡൽ: ഫ്രിഡ്ജും വെയിലിൽ ഉണക്കൽ മാതൃകയും പരമ്പരാഗത അച്ചാർ ഭരണിയും!',
      modelType: 'food_preservation',
    };
  }

  // Science Ch 2: Teeth & Digestion - Distinct Topic Models
  if (tLower.includes('incisor') || tLower.includes('canine') || tLower.includes('premolar') || tLower.includes('molar') || tLower.includes('type of teeth') || tLower.includes('sets of teeth')) {
    return {
      index,
      title: topic,
      shortLabel: '4 Types of Teeth',
      emoji: '🦷',
      explanationEn:
        'Children have 20 Milk Teeth, and adults have 32 Permanent Teeth! We have 4 specialized tooth tools in our jaw: 8 sharp chisel Incisors (biting), 4 pointed Canines (tearing), 8 broad Premolars (crushing), and 12 strong Molars (grinding)!',
      explanationMl:
        'മനുഷ്യന്റെ താടിയെല്ലിൽ 4 തരം പല്ലുകളുണ്ട്: കടിച്ചുമുറിക്കാൻ ഉളിപ്പല്ലുകൾ (Incisors), കീറിമുറിക്കാൻ ദംഷ്ട്രകൾ (Canines), ചവച്ചരയ്ക്കാൻ അഗ്രചർവണകങ്ങളും ചർവണകങ്ങളും (Premolars & Molars).',
      funFactEn: '3D Model: Rotate the 3D Dental Jaw Arch showing Incisors, Canines & Molars!',
      funFactMl: '3D മോഡൽ: താടിയെല്ലിലെ 4 തരം പല്ലുകളുടെ 3D മാതൃക!',
      modelType: 'tooth_jaw',
    };
  }

  if (tLower.includes('structure') || tLower.includes('enamel') || tLower.includes('dentine') || tLower.includes('pulp')) {
    return {
      index,
      title: topic,
      shortLabel: 'Tooth Enamel & Pulp',
      emoji: '✨',
      explanationEn:
        'A tooth has 2 main parts: the visible Crown above the gum and the Root anchored in the jawbone! Inside: 1) Enamel (hardest white substance in the human body!), 2) Dentine (yellow bone-like layer), and 3) Pulp (soft inner chamber with blood vessels & sensitive nerves).',
      explanationMl:
        'പല്ലിന്റെ പുറമെയുള്ള കടുപ്പമേറിയ വെളുത്ത പാളിയാണ് ഇനാമൽ (Enamel). അതിനടിയിലുള്ള മഞ്ഞ പാളിയാണ് ഡെന്റൈൻ (Dentine). രക്തക്കുഴലുകളും ഞരമ്പുകളുമുള്ള ഉൾഭാഗമാണ് പൾപ്പ് (Pulp).',
      funFactEn: '3D Model: Inspect the Split 3D Tooth Cross-Section with Enamel, Dentine & Red Nerve Pulp!',
      funFactMl: '3D മോഡൽ: ഇനാമലും പൾപ്പും ഞരമ്പുകളും വ്യക്തമായി കാണിക്കുന്ന പല്ലിന്റെ 3D പരിച്ഛേദം!',
      modelType: 'tooth_cross_section',
    };
  }

  if (tLower.includes('digestive system') || tLower.includes('stomach') || tLower.includes('journey of food') || tLower.includes('intestine')) {
    return {
      index,
      title: topic,
      shortLabel: 'Digestive Journey',
      emoji: '🫀',
      explanationEn:
        'Digestion turns tasty food into energy! The journey: 1) Mouth (chewed & mixed with saliva), 2) Food Pipe (Esophagus), 3) Stomach (churned with digestive juices into soup), 4) Small Intestine (nutrients absorbed into blood), 5) Large Intestine (water absorbed) and waste excreted!',
      explanationMl:
        'ഭക്ഷണം വായിൽ വെച്ച് ചവച്ചരച്ച് ആഹാരക്കുഴൽ വഴി ആമാശയത്തിലും (Stomach) ചെറുകുടലിലും (Small Intestine) എത്തി പോഷകങ്ങൾ രക്തത്തിലേക്ക് ആഗിരണം ചെയ്യുന്ന പ്രക്രിയയാണ് ദഹനം.',
      funFactEn: '3D Model: Follow the 3D Digestive Track — Mouth → Stomach → Liver → Intestines!',
      funFactMl: '3D മോഡൽ: ആമാശയവും കുടലുകളും അടങ്ങിയ 3D ദഹനവ്യവസ്ഥ!',
      modelType: 'digestive_system',
    };
  }

  if (tLower.includes('hygiene') || tLower.includes('dental care') || tLower.includes('plaque') || tLower.includes('cavity') || tLower.includes('brush')) {
    return {
      index,
      title: topic,
      shortLabel: 'Dental Care & Brush',
      emoji: '🪥',
      explanationEn:
        'Brush teeth twice a day—morning and before bedtime! Sticky sugar left on teeth feeds bacteria that make acid, leading to yellow Plaque and Tooth Decay (Cavities). Rinse your mouth thoroughly after every meal!',
      explanationMl:
        'ദിവസവും രണ്ട് നേരം പല്ല് തേയ്ക്കണം! മധുരപലഹാരങ്ങൾ പല്ലിൽ പറ്റിപ്പിടിച്ചിരുന്നാൽ ബാക്ടീരിയകൾ ആസിഡ് ഉല്പാദിപ്പിച്ച് പല്ലിൽ പോടുകൾ (Cavities) ഉണ്ടാക്കുന്നു.',
      funFactEn: '3D Model: Inspect the Sparkling 3D Tooth, Soft Bristle Toothbrush & Toothpaste Tube!',
      funFactMl: '3D മോഡൽ: തിളങ്ങുന്ന പല്ലും ടൂത്ത്ബ്രഷും പേസ്റ്റും 3D-യിൽ!',
      modelType: 'tooth',
    };
  }

  // Science Ch 3: Plant Adaptations & Photosynthesis
  if (tLower.includes('photosynthesis') || tLower.includes('chloroplast') || tLower.includes('stomata')) {
    return {
      index,
      title: topic,
      shortLabel: 'Photosynthesis Cell',
      emoji: '🍃',
      explanationEn:
        'Inside green plant leaves, millions of tiny solar power kitchens called Chloroplasts trap sunlight energy! Leaves take in Carbon Dioxide through microscopic pores called Stomata and water from roots, baking glucose sugar and releasing fresh Oxygen!',
      explanationMl:
        'ഇലകളിലെ ഹരിതകണങ്ങൾ (Chloroplasts) സൂര്യപ്രകാശം ആഗിരണം ചെയ്ത് ജലവും കാർബൺ ഡൈ ഓക്സൈഡും ചേർത്ത് അന്നജം നിർമ്മിക്കുകയും ഓക്സിജൻ പുറത്തുവിടുകയും ചെയ്യുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Green Leaf with Sun Rays, Chloroplast Cells & Oxygen Bubbles!',
      funFactMl: '3D മോഡൽ: സൂര്യപ്രകാശവും ഓക്സിജൻ കണികകളുമുള്ള ഇലയുടെ 3D പ്രകാശസംശ്ലേഷണ മാതൃക!',
      modelType: 'leaf_photosynthesis',
    };
  }

  if (tLower.includes('desert plant') || tLower.includes('cactus') || tLower.includes('desert adaptation')) {
    return {
      index,
      title: topic,
      shortLabel: 'Desert Cactus',
      emoji: '🌵',
      explanationEn:
        'Cactus plants survive the hottest deserts! Their leaves are reduced to sharp Thorns (spines) to prevent water loss and protect from animals. Their thick, fleshy green stem stores gallons of water and carries out photosynthesis!',
      explanationMl:
        'മരുഭൂമിയിലെ കള്ളിമുൾച്ചെടികൾക്ക് (Cactus) ഇലകൾക്ക് പകരം മുള്ളുകളാണുള്ളത്. ഇവയുടെ തടിച്ച പച്ച തണ്ട് ജലം സംഭരിക്കുകയും ആഹാരം നിർമ്മിക്കുകയും ചെയ്യുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Desert Saguaro Cactus on Sandy Dune Base!',
      funFactMl: '3D മോഡൽ: മണൽക്കുന്നിൽ നിൽക്കുന്ന മരുഭൂമിയിലെ 3D കള്ളിമുൾച്ചെടി!',
      modelType: 'plant_cactus',
    };
  }

  if (tLower.includes('mountain plant') || tLower.includes('pine') || tLower.includes('conifer')) {
    return {
      index,
      title: topic,
      shortLabel: 'Mountain Pine Tree',
      emoji: '🌲',
      explanationEn:
        'Coniferous trees (Pine, Fir, Deodar, Spruce) growing on cold snowy mountains have conical shapes with sloping branches so heavy snow slides right off! Instead of flowers, they have woody cones, and their leaves are tough, waxy needles.',
      explanationMl:
        'പർവ്വതങ്ങളിലെ പൈൻ മരങ്ങൾക്ക് കോൺ ആകൃതിയിലുള്ള ശാഖകളാണുള്ളത്. ഇത് മഞ്ഞ് അടിഞ്ഞുകൂടാതെ താഴേക്ക് വീഴാൻ സഹായിക്കുന്നു. ഇവയ്ക്ക് സൂചിപോലെയുള്ള ഇലകളാണുള്ളത്.',
      funFactEn: '3D Model: Explore the Snow-Dusted 3D Coniferous Pine Tree & Woody Cones!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുപെയ്ത മലനിരകളിലെ 3D പൈൻ മരം!',
      modelType: 'plant_pine',
    };
  }

  if (tLower.includes('water lily') || tLower.includes('lotus') || tLower.includes('aquatic plant')) {
    return {
      index,
      title: topic,
      shortLabel: 'Aquatic Water Lily',
      emoji: '🪷',
      explanationEn:
        'Aquatic plants (Lotus, Water Lily, Hydrilla) thrive in lakes and ponds! They have wide, flat, waxy leaves that float on the water surface without rotting, with stomata on the upper surface and light, spongy stems filled with air spaces.',
      explanationMl:
        'താമരയും ആമ്പലും ജലത്തിൽ ജീവിക്കുന്ന സസ്യങ്ങളാണ്. ജലത്തിന് മുകളിൽ പൊങ്ങിക്കിടക്കാൻ ഇവയുടെ ഇലകളിൽ മെഴുക് പാളിയും തണ്ടുകളിൽ വായു അറകളും ഉണ്ട്.',
      funFactEn: '3D Model: Watch the 3D Floating Lily Pad, Pink Lotus Flower & Air Stem!',
      funFactMl: '3D മോഡൽ: വെള്ളത്തിൽ വിരിഞ്ഞുനിൽക്കുന്ന 3D താമരപ്പൂവും ഇലയും!',
      modelType: 'plant_lotus',
    };
  }

  // Science Ch 4: Animal Adaptations
  if (tLower.includes('camel') || tLower.includes('desert animal')) {
    return {
      index,
      title: topic,
      shortLabel: 'Desert Camel',
      emoji: '🐪',
      explanationEn:
        'The Camel is called the "Ship of the Desert"! It stores rich fat in its Hump for energy when food is scarce, has wide padded hooves that never sink in desert sand, long eyelashes to keep sand out, and can survive days without drinking water!',
      explanationMl:
        'ഒട്ടകത്തിന് മണലിൽ ആണ്ടുപോകാത്ത പരന്ന കാൽപാദങ്ങളും, കൊഴുപ്പ് സംഭരിക്കുന്ന പൂഞ്ഞയും (Hump), മണലിൽ നിന്ന് സംരക്ഷിക്കാൻ നീളമുള്ള കൺപീലികളും ഉണ്ട്.',
      funFactEn: '3D Model: Rotate the 3D Desert Camel with Hump & Padded Feet on Dunes!',
      funFactMl: '3D മോഡൽ: മരുഭൂമിയിലെ ഒട്ടകത്തിന്റെ 3D മാതൃക കറക്കി കാണാം!',
      modelType: 'animal_camel',
    };
  }

  if (tLower.includes('polar') || tLower.includes('penguin') || tLower.includes('bear') || tLower.includes('arctic')) {
    return {
      index,
      title: topic,
      shortLabel: 'Polar Iceberg Life',
      emoji: '🐻‍❄️',
      explanationEn:
        'Polar Bears and Penguins thrive in freezing icy polar zones! They have a thick layer of fat under their skin called Blubber and dense waterproof fur or tightly overlapping feathers to lock in body warmth.',
      explanationMl:
        'ധ്രുവക്കരടികൾക്കും പെൻഗ്വിനുകൾക്കും കൊടുംതണുപ്പിൽ നിന്ന് രക്ഷനേടാൻ ചർമ്മത്തിനടിയിൽ കട്ടിയുള്ള കൊഴുപ്പ് പാളിയും (Blubber) വാട്ടർപ്രൂഫ് രോമങ്ങളുമുണ്ട്.',
      funFactEn: '3D Model: Explore the 3D Polar Bear & Emperor Penguin on Floating Iceberg!',
      funFactMl: '3D മോഡൽ: മഞ്ഞുമലയിൽ നിൽക്കുന്ന ധ്രുവക്കരടിയും പെൻഗ്വിനും 3D-യിൽ!',
      modelType: 'animal_polar',
    };
  }

  if (tLower.includes('aquatic animal') || tLower.includes('fish') || tLower.includes('dolphin') || tLower.includes('gills')) {
    return {
      index,
      title: topic,
      shortLabel: 'Aquatic Dolphin Life',
      emoji: '🐬',
      explanationEn:
        'Water animals have streamlined spindle-shaped bodies that cut smoothly through water! Fishes use Gills to breathe dissolved oxygen and fins to steer, while playful Dolphins use blowholes at the top of their heads to breathe fresh air.',
      explanationMl:
        'ജലജീവികൾക്ക് വെള്ളത്തിൽ നീന്താൻ സഹായിക്കുന്ന പടകുപോലെയുള്ള ശരീരവും (Streamlined body), ചിറകുകളും, ശ്വസിക്കാൻ ചെകിളകളും (Gills) ഉണ്ട്.',
      funFactEn: '3D Model: Watch the 3D Leaping Dolphin & Coral Reef Fish in Ocean Waves!',
      funFactMl: '3D മോഡൽ: കടലിൽ നീന്തുന്ന 3D ഡോൾഫിനും വർണ്ണമത്സ്യങ്ങളും!',
      modelType: 'animal_aquatic',
    };
  }

  // Science Ch 5: Matter - Solids, Liquids, Gases
  if (tLower.includes('state') || tLower.includes('solid') || tLower.includes('liquid') || tLower.includes('gas') || tLower.includes('molecule')) {
    return {
      index,
      title: topic,
      shortLabel: '3 States of Matter',
      emoji: '🧊',
      explanationEn:
        'Everything is made of Matter! 1) Solids: molecules tightly packed in rigid grids with definite shape & volume (wood, ice), 2) Liquids: loosely packed molecules that flow and take the shape of the container (water, milk), 3) Gases: molecules far apart zooming freely with no fixed shape!',
      explanationMl:
        'പദാർത്ഥത്തിന്റെ മൂന്ന് അവസ്ഥകൾ: കട്ടിയുള്ള ഖരം (Solid), ഒഴുകുന്ന ദ്രാവകം (Liquid), തന്മാത്രകൾ വേഗത്തിൽ പായുന്ന വാതകം (Gas).',
      funFactEn: '3D Model: Inspect the 3 Side-by-Side 3D Molecular Chamber Demonstrations!',
      funFactMl: '3D മോഡൽ: ഖര-ദ്രാവക-വാതക തന്മാത്രകളുടെ 3D പ്രവർത്തന അറകൾ!',
      modelType: 'matter_molecules',
    };
  }

  if (tLower.includes('melting') || tLower.includes('evaporat') || tLower.includes('condens') || tLower.includes('change')) {
    return {
      index,
      title: topic,
      shortLabel: 'Melting & Steam',
      emoji: '💨',
      explanationEn:
        'Heating and cooling change states of matter! Ice (Solid) melts with heat into Water (Liquid). Boiling water evaporates into Steam (Gas). Cooling steam condenses back into water, and freezing water turns back into ice!',
      explanationMl:
        'ചൂടാക്കുമ്പോൾ ഐസ് ഉരുകി വെള്ളമാകുന്നു (Melting), തിളപ്പിക്കുമ്പോൾ നീരാവിയാകുന്നു (Evaporation). തണുപ്പിക്കുമ്പോൾ തിരികെ ദ്രാവകവും ഖരവുമാകുന്നു.',
      funFactEn: '3D Model: Watch the 3D Melting Translucent Ice Cube, Water Pool & Rising Steam!',
      funFactMl: '3D മോഡൽ: ഉരുകുന്ന ഐസ് ക്യൂബും ഉയരുന്ന നീരാവിയും 3D-യിൽ!',
      modelType: 'matter_change',
    };
  }

  if (tLower.includes('solute') || tLower.includes('solvent') || tLower.includes('solution') || tLower.includes('dissolv')) {
    return {
      index,
      title: topic,
      shortLabel: 'Solute & Solution',
      emoji: '🧪',
      explanationEn:
        'When you stir sugar into water, you make a Solution! The substance that dissolves (sugar or salt) is the Solute. The liquid that dissolves it (water) is the Solvent. Water is known as the "Universal Solvent" because it dissolves so many things!',
      explanationMl:
        'പഞ്ചസാര വെള്ളത്തിൽ അലിയിക്കുമ്പോൾ ലായനി (Solution) ഉണ്ടാകുന്നു. അലിയുന്ന വസ്തു ലീനം (Solute), അലിയിക്കുന്ന ദ്രാവകം ലായകവുമാണ് (Solvent).',
      funFactEn: '3D Model: Swirl the 3D Chemistry Glass Beaker with Dissolving Crystal Solute!',
      funFactMl: '3D മോഡൽ: ലായനി തയ്യാറാക്കുന്ന 3D കെമിസ്ട്രി ബീക്കർ!',
      modelType: 'matter_beaker',
    };
  }

  // Science Ch 6: Water & Weather
  if (tLower.includes('water cycle') || tLower.includes('precipitation')) {
    return {
      index,
      title: topic,
      shortLabel: 'The Water Cycle',
      emoji: '💧',
      explanationEn:
        'Earth’s continuous natural recycling journey of water: 1) Evaporation (Sun heats lakes and oceans into vapor), 2) Condensation (cold air high up turns vapor into clouds), 3) Precipitation (clouds release rain, snow or hail back to Earth)!',
      explanationMl:
        'സൂര്യന്റെ ചൂടേറ്റ് ജലം നീരാവിയാകുന്ന ബാഷ്പീകരണവും (Evaporation), അത് തണുത്തുറഞ്ഞ് മേഘങ്ങളാകുന്ന സാന്ദ്രീകരണവും (Condensation), മഴയായി പെയ്യുന്നതും (Precipitation) ചേർന്നതാണ് ജലചക്രം.',
      funFactEn: '3D Model: Explore the 3D Water Cycle Diorama — Ocean, Rising Vapor & Rain Cloud!',
      funFactMl: '3D മോഡൽ: സമുദ്രവും നീരാവിയും മഴമേഘങ്ങളുമുള്ള 3D ജലചക്രം!',
      modelType: 'water_cycle',
    };
  }

  if (tLower.includes('breeze') || tLower.includes('land breeze') || tLower.includes('sea breeze')) {
    return {
      index,
      title: topic,
      shortLabel: 'Land & Sea Breeze',
      emoji: '🏖️',
      explanationEn:
        'Land heats up and cools down much faster than water! By day, warm air over land rises and cool sea air rushes in (Sea Breeze). At night, land cools faster than the sea, so breeze blows from land towards the warm sea (Land Breeze).',
      explanationMl:
        'പകൽ സമയത്ത് കടലിൽ നിന്ന് കരയിലേക്ക് വീശുന്ന കാറ്റാണ് കടൽക്കാറ്റ് (Sea Breeze). രാത്രിയിൽ കരയിൽ നിന്ന് കടലിലേക്ക് വീശുന്ന കാറ്റാണ് കരക്കാറ്റ് (Land Breeze).',
      funFactEn: '3D Model: Inspect the Coastal Beach Diorama with Convection Wind Arrows!',
      funFactMl: '3D മോഡൽ: കാറ്റിന്റെ ഗതി കാണിക്കുന്ന 3D കടൽത്തീര മാതൃക!',
      modelType: 'weather_breeze',
    };
  }

  // Science Ch 7: Force, Work & Energy
  if (tLower.includes('magnet') || tLower.includes('gravity') || tLower.includes('friction')) {
    return {
      index,
      title: topic,
      shortLabel: 'Forces & Magnet',
      emoji: '🧲',
      explanationEn:
        'Forces make things move, stop, or change direction! Gravitational Force pulls everything towards Earth’s center. Frictional Force slows sliding objects down. Magnetic Force attracts iron without even touching it!',
      explanationMl:
        'ഭൂമി വസ്തുക്കളെ താഴേക്ക് വലിക്കുന്ന ഗുരുത്വാകർഷണ ബലവും (Gravity), ചലനത്തെ തടയുന്ന ഘർഷണ ബലവും (Friction), കാന്തിക ബലവും (Magnetism) പ്രധാന ബലങ്ങളാണ്.',
      funFactEn: '3D Model: Rotate the 3D Red-Blue Horseshoe Magnet Attracting Iron Spheres!',
      funFactMl: '3D മോഡൽ: ഇരുമ്പ് തരികളെ ആകർഷിക്കുന്ന 3D കാന്തം!',
      modelType: 'force_magnet',
    };
  }

  if (tLower.includes('solar energy') || (tLower.includes('energy') && !tLower.includes('food'))) {
    return {
      index,
      title: topic,
      shortLabel: 'Solar Energy & Light',
      emoji: '💡',
      explanationEn:
        'Energy is the ability to do work! The Sun is our primary source of Solar Energy. Solar panels convert golden sunlight directly into clean electricity to power homes, streetlights, and glowing lightbulbs!',
      explanationMl:
        'സൗരോർജ്ജം (Solar Energy) ഉപയോഗിച്ച് സൗരോർജ്ജ പാനലുകൾ വഴി വൈദ്യുതി ഉല്പാദിപ്പിച്ച് വീടുകളും തെരുവിളക്കുകളും പ്രകാശിപ്പിക്കാം.',
      funFactEn: '3D Model: Inspect the 3D Solar Panel Capturing Sunlight & Powering Bulb!',
      funFactMl: '3D മോഡൽ: സൂര്യപ്രകാശം സ്വീകരിച്ച് ബൾബ് കത്തിക്കുന്ന 3D സോളാർ പാനൽ!',
      modelType: 'solar_energy',
    };
  }

  // Science Ch 8: Solar System
  if (tLower.includes('planet') || tLower.includes('solar system') || tLower.includes('sun')) {
    return {
      index,
      title: topic,
      shortLabel: 'Sun & 8 Planets',
      emoji: '🪐',
      explanationEn:
        'Our Solar System has 8 planets orbiting the blazing Sun: Mercury, Venus, Earth, Mars, Jupiter (largest!), Saturn (magnificent rings!), Uranus, and Neptune! Earth is the only planet known to support life with oceans and atmosphere.',
      explanationMl:
        'സൂര്യനെ വലംവയ്ക്കുന്ന 8 ഗ്രഹങ്ങൾ: ബുധൻ, ശുക്രൻ, ഭൂമി, ചൊവ്വ, വ്യാഴം, ശനി, യുറാനസ്, നെപ്റ്റ്യൂൺ. ജീവനുള്ള ഒരേയൊരു ഗ്രഹമാണ് നമ്മുടെ ഭൂമി.',
      funFactEn: '3D Model: Explore the 3D Sun, Orbiting Blue Earth & Golden Ringed Saturn!',
      funFactMl: '3D മോഡൽ: തിളങ്ങുന്ന സൂര്യനും ഭൂമിയും വളയങ്ങളുള്ള ശനി ഗ്രഹവും 3D-യിൽ!',
      modelType: 'solar_planets',
    };
  }

  // English Grammar - Parts of Speech
  if (tLower.includes('noun') || tLower.includes('verb') || tLower.includes('adjective') || tLower.includes('grammar') || tLower.includes('sentence')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Grammar Blocks',
      emoji: '🔤',
      explanationEn:
        'Words work together in sentences! Nouns name persons, places, and things (Eadrick, Dog, Castle). Verbs show actions (run, jump, study). Adjectives describe nouns with color and size (Happy, Glowing, Smart)!',
      explanationMl:
        'വ്യാകരണത്തിലെ പ്രധാന ഭാഗങ്ങൾ: നാമം (Noun - വ്യക്തി, സ്ഥലം, വസ്തു), ക്രിയ (Verb - പ്രവർത്തികൾ), നാമവിശേഷണം (Adjective - സ്വഭാവം).',
      funFactEn: '3D Model: Interlock the Colorful 3D Noun, Verb & Adjective Grammar Stage Blocks!',
      funFactMl: '3D മോഡൽ: വർണ്ണാഭമായ 3D വ്യാകരണ ബ്ലോക്കുകൾ!',
      modelType: 'grammar_stage',
    };
  }

  // Malayalam & Hindi Literature
  if (tLower.includes('കവിത') || tLower.includes('കഥ') || tLower.includes('ഭാഷ') || tLower.includes('कविता') || tLower.includes('कहानी') || tLower.includes('hindi') || tLower.includes('malayalam')) {
    return {
      index,
      title: topic,
      shortLabel: 'Golden Book & Letters',
      emoji: '📖',
      explanationEn:
        'Literature and language stories open doors of imagination, culture, and values! Explore classical stories, rich poetry verses, and beautiful scripts with traditional cultural motifs.',
      explanationMl:
        'ഭാഷയും സാഹിത്യവും ഭാവനയുടെ ലോകം തുറക്കുന്നു. കൊച്ചു കഥകളും കവിതകളും മാതൃഭാഷയുടെ മാധുര്യം കുട്ടികളിൽ നിറയ്ക്കുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Open Golden Storybook, Quill Pen & Traditional Oil Lamp!',
      funFactMl: '3D മോഡൽ: തുറന്നുവെച്ച 3D പുസ്തകവും എഴുത്താണിയും നിലവിളക്കും!',
      modelType: 'literature_book',
    };
  }

  // UKG English Phonics
  if (tLower.includes('phonic') || tLower.includes('alphabet') || tLower.includes('letter') || tLower.includes('cvc') || tLower.includes('sight word')) {
    return {
      index,
      title: topic,
      shortLabel: 'Phonics & A-Z Blocks',
      emoji: '🔤',
      explanationEn:
        'Learn the magic sounds of letters! A is for Apple /æ/, B is for Ball /b/, C is for Cat /k/! Reading short three-letter CVC words (c-a-t, b-a-t, s-u-n) turns little kids into super readers!',
      explanationMl:
        'അക്ഷരങ്ങളുടെ ശബ്ദങ്ങൾ (Phonics) കേട്ടു പഠിക്കാം! A for Apple, B for Ball, C for Cat! കൊച്ചു വാക്കുകൾ വായിക്കാൻ കുട്ടികളെ സഹായിക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Wooden Letter Blocks A-B-C with Apple & Bouncing Ball!',
      funFactMl: '3D മോഡൽ: കൊച്ചുകുട്ടികൾക്കായുള്ള 3D അക്ഷര ബ്ലോക്കുകളും ആപ്പിളും!',
      modelType: 'phonics_abc',
    };
  }

  // UKG Math Counting
  if (tLower.includes('count') || tLower.includes('number') || (tLower.includes('math') && !tLower.includes('fraction')) || tLower.includes('addition') || tLower.includes('shape')) {
    return {
      index,
      title: topic,
      shortLabel: 'Counting Abacus & Blocks',
      emoji: '🔢',
      explanationEn:
        'Counting is so much fun! Count 1 to 10 shiny stars and slide colorful beads on the abacus. 1 Apple + 1 Apple = 2 yummy Apples! Spot geometric shapes: Circle ⚪, Triangle 🔺, Square 🟩!',
      explanationMl:
        '1 മുതൽ 10 വരെ എണ്ണാൻ പഠിക്കാം! അബാക്കസിലെ മുത്തുകൾ നിരക്കി എണ്ണലും കൂട്ടലും ലളിതമായി മനസ്സിലാക്കാം.',
      funFactEn: '3D Model: Slide the 3D Colorful Counting Beads on the Wooden Math Abacus!',
      funFactMl: '3D മോഡൽ: വർണ്ണ മുത്തുകളുള്ള 3D കുട്ടികളുടെ അബാക്കസ്!',
      modelType: 'abacus_count',
    };
  }

  // UKG EVS / Senses / Healthy Habits
  if (tLower.includes('body') || tLower.includes('sense') || tLower.includes('myself') || tLower.includes('habit') || tLower.includes('animal')) {
    return {
      index,
      title: topic,
      shortLabel: 'Senses & Healthy Habits',
      emoji: '🖐️',
      explanationEn:
        'Our 5 magical Senses: Eyes to see colors 👁️, Ears to hear sounds 👂, Nose to smell flowers 👃, Tongue to taste sweet fruit 👅, and Hands to touch and feel! Good habits keep our body energetic and smiling!',
      explanationMl:
        'നമ്മുടെ പഞ്ചേന്ദ്രിയങ്ങൾ: കാണാൻ കണ്ണുകൾ, കേൾക്കാൻ കാതുകൾ, മണം അറിയാൻ മൂക്ക്, രുചിക്കാൻ നാവ്, സ്പർശിക്കാൻ കൈകൾ!',
      funFactEn: '3D Model: Explore the 3D Senses Organ Display & Sparkling Healthy Smile!',
      funFactMl: '3D മോഡൽ: പഞ്ചേന്ദ്രിയങ്ങളുടെയും ആരോഗ്യ ശീലങ്ങളുടെയും 3D മാതൃക!',
      modelType: 'ukg_senses',
    };
  }

  // Transport & Communication
  if (tLower.includes('transport') || tLower.includes('highway') || tLower.includes('railway') || tLower.includes('port')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Transport Hub',
      emoji: '🚆',
      explanationEn:
        'India is connected by 4 major modes of transport: 1) Roadways (National Highways & Golden Quadrilateral connecting Delhi, Mumbai, Chennai, Kolkata), 2) Railways (Indian Railways & Metro trains), 3) Waterways (ships & ports like Kochi and Mumbai), and 4) Airways (fastest travel)!',
      explanationMl:
        'ഇന്ത്യയിലെ 4 പ്രധാന ഗതാഗത മാർഗ്ഗങ്ങൾ: റോഡ് ഗതാഗതം (ദേശീയപാതകൾ), റെയിൽവേ (മെട്രോ ഉൾപ്പെടെ), ജലഗതാഗതം (കൊച്ചി, മുംബൈ തുറമുഖങ്ങൾ), വ്യോമഗതാഗതം (വിമാനങ്ങൾ).',
      funFactEn: '3D Model: Inspect the 3D Express Locomotive Train & Railway Track!',
      funFactMl: '3D മോഡൽ: 3D എക്സ്പ്രസ് ട്രെയിനും റെയിൽവേ ട്രാക്കും കറക്കി നോക്കൂ!',
      modelType: 'train_transport',
    };
  }

  if (tLower.includes('communication') || tLower.includes('satellite') || tLower.includes('internet')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Space Satellite',
      emoji: '🛰️',
      explanationEn:
        'Communication lets us share ideas instantly! Personal Communication includes letters, phone calls, and emails between individuals. Mass Communication reaches millions of people at once through Newspapers, Television, Radio, Internet, and Artificial Satellites orbiting high above the Earth!',
      explanationMl:
        'വിവരങ്ങൾ കൈമാറാൻ വ്യക്തിഗത മാധ്യമങ്ങളും (കത്ത്, ഫോൺ, ഇമെയിൽ) ബഹുജന മാധ്യമങ്ങളും (പത്രം, ടിവി, ഇന്റർനെറ്റ്) സഹായിക്കുന്നു. ബഹിരാകാശത്തെ കൃത്രിമോപഗ്രഹങ്ങൾ (Satellites) വാർത്താവിനിമയവും കാലാവസ്ഥാ പ്രവചനവും സാധ്യമാക്കുന്നു.',
      funFactEn: '3D Model: Rotate the 3D Orbiting Communication Satellite with Solar Wings!',
      funFactMl: '3D മോഡൽ: സോളാർ പാനലുകളുള്ള 3D വാർത്താവിനിമയ ഉപഗ്രഹം!',
      modelType: 'satellite',
    };
  }

  // Pollution & 3Rs
  if (tLower.includes('pollution') || tLower.includes('waste') || tLower.includes('biodegradable') || tLower.includes('recycle')) {
    return {
      index,
      title: topic,
      shortLabel: 'Eco 3Rs & Clean Earth',
      emoji: '♻️',
      explanationEn:
        'To protect our planet from Air, Water, Soil, and Noise Pollution, we separate waste into Green Bins (Biodegradable kitchen/plant waste that turns into compost) and Blue Bins (Non-Biodegradable plastic, glass, metal for recycling) and practice the 3 Rs: Reduce, Reuse, and Recycle!',
      explanationMl:
        'പരിസ്ഥിതി മലിനീകരണം തടയാൻ ജൈവ മാലിന്യങ്ങൾ പച്ച ബിന്നിലും (Biodegradable), പ്ലാസ്റ്റിക് പോലുള്ള അജൈവ മാലിന്യങ്ങൾ നീല ബിന്നിലും (Non-Biodegradable) ശേഖരിച്ച് Reduce, Reuse, Recycle എന്നീ 3 Rs ശീലമാക്കാം.',
      funFactEn: '3D Model: Explore the 3D Green & Blue Eco-Bins and Wind Turbine!',
      funFactMl: '3D മോഡൽ: ഹരിത-നീല റീസൈക്ലിംഗ് ബിന്നുകളും കാറ്റാടിയന്ത്രവും 3D-യിൽ!',
      modelType: 'recycle_bin',
    };
  }

  // Math Fractions / Clock / Abacus
  if (tLower.includes('fraction') || tLower.includes('numerator') || tLower.includes('half') || tLower.includes('quarter')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Fraction Pie',
      emoji: '🍕',
      explanationEn:
        'A Fraction represents equal parts of a whole! In a fraction like 3/4, the bottom number (Denominator = 4) tells how many equal slices the whole pizza is cut into, and the top number (Numerator = 3) tells how many slices we have!',
      explanationMl:
        'ഒരു പൂർണ്ണ വസ്തുവിന്റെ തുല്യ ഭാഗങ്ങളെയാണ് ഭിന്നസംഖ്യ (Fraction) എന്ന് വിളിക്കുന്നത്. 3/4 എന്നതിൽ താഴെയുള്ള സംഖ്യ (ഛേദം - Denominator) ആകെ തുല്യ ഭാഗങ്ങളെയും മുകളിലുള്ള സംഖ്യ (അംശം - Numerator) എടുത്ത ഭാഗങ്ങളെയും സൂചിപ്പിക്കുന്നു.',
      funFactEn: '3D Model: Inspect the 3D Sliced Fraction Wheel (Whole, 1/2, 1/4, 3/4)!',
      funFactMl: '3D മോഡൽ: തുല്യ കഷ്ണങ്ങളാക്കിയ 3D ഭിന്നസംഖ്യാ ചക്രം!',
      modelType: 'fraction_pie',
    };
  }

  if (tLower.includes('clock') || tLower.includes('time') || tLower.includes('hour') || tLower.includes('minute')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Analog Clock',
      emoji: '⏰',
      explanationEn:
        'A clock face has 12 hours and 60 minutes! The short hand points to the Hour, and the long hand points to the Minutes (each number from 1 to 12 equals 5 minutes). 1 Hour = 60 Minutes, and 1 Day = 24 Hours (AM from midnight to noon, PM from noon to midnight)!',
      explanationMl:
        'ക്ലോക്കിലെ ചെറിയ സൂചി മണിക്കൂറിനെയും വലിയ സൂചി മിനിറ്റിനെയും സൂചിപ്പിക്കുന്നു. 1 മണിക്കൂർ = 60 മിനിറ്റ്, 1 ദിവസം = 24 മണിക്കൂർ.',
      funFactEn: '3D Model: Rotate the 3D Clock Face with Hour, Minute & Second Hands!',
      funFactMl: '3D മോഡൽ: മണിക്കൂർ-മിനിറ്റ് സൂചികളുള്ള 3D ക്ലോക്ക്!',
      modelType: 'clock',
    };
  }

  if (cLower.includes('math') || tLower.includes('digit') || tLower.includes('place value') || tLower.includes('addition') || tLower.includes('multiplication')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Place Value Abacus',
      emoji: '🧮',
      explanationEn:
        `Mastering "${topic}": Each rod on the 3D Abacus represents a place value column (Ten-Thousands, Thousands, Hundreds, Tens, and Ones). Counting beads on each rod helps us visualize numbers, addition, subtraction, and multiplication patterns effortlessly!`,
      explanationMl:
        `"${topic}" ലളിതമായി പഠിക്കാം: 3D അബാക്കസിലെ ഓരോ തൂണും ഒന്ന്, പത്ത്, നൂറ്, ആയിരം എന്നീ സ്ഥാനവിലകളെ (Place Value) സൂചിപ്പിക്കുന്നു. മുത്തുകൾ എണ്ണി ഗണിതക്രിയകൾ വേഗത്തിൽ മനസ്സിലാക്കാം.`,
      funFactEn: '3D Model: Explore the 3D Multi-Rod Place Value Abacus & Counting Beads!',
      funFactMl: '3D മോഡൽ: മുത്തുകളുള്ള 3D അബാക്കസ് കറക്കി നോക്കൂ!',
      modelType: 'abacus',
    };
  }

  // Cultural Heritage, Dances, Monuments & Festivals
  if (tLower.includes('monument') || tLower.includes('taj mahal') || tLower.includes('dance') || tLower.includes('festival') || tLower.includes('heritage') || tLower.includes('language')) {
    return {
      index,
      title: topic,
      shortLabel: 'Heritage & Monuments',
      emoji: '🕌',
      explanationEn:
        `India’s Unity in Diversity shines through "${topic}"! From world-famous monuments like the Taj Mahal, Red Fort, Sanchi Stupa, and Konark Sun Temple to classical dances (Kathakali, Bharatanatyam) and harvest festivals (Onam, Pongal, Bihu, Baisakhi), our cultural heritage unites every state.`,
      explanationMl:
        `നാനാത്വത്തിൽ ഏകത്വം വിളിച്ചോതുന്ന "${topic}": താജ്മഹൽ, ചെങ്കോട്ട, സാഞ്ചി സ്തൂപം തുടങ്ങിയ ചരിത്രസ്മാരകങ്ങളും കഥകളി, ഭരതനാട്യം തുടങ്ങിയ കലാരൂപങ്ങളും ഓണം, പൊങ്കൽ, ബിഹു തുടങ്ങിയ ഉത്സവങ്ങളും ഇന്ത്യയുടെ അഭിമാനമാണ്.`,
      funFactEn: '3D Model: Rotate the 3D Heritage Dome, Pillars & Archway!',
      funFactMl: '3D മോഡൽ: ചരിത്രസ്മാരക ഗോപുരവും തൂണുകളും 3D-യിൽ കാണാം!',
      modelType: 'monument',
    };
  }

  // Agriculture, Crops, Minerals & Industries
  if (tLower.includes('kharif') || tLower.includes('rabi') || tLower.includes('crop') || tLower.includes('mineral') || tLower.includes('industry') || tLower.includes('revolution')) {
    return {
      index,
      title: topic,
      shortLabel: 'Crops, Minerals & Industry',
      emoji: '🌾',
      explanationEn:
        `Exploring "${topic}": India grows Kharif crops (Rice, Cotton, Maize in monsoon) and Rabi crops (Wheat, Mustard in winter), alongside cash crops like Tea, Coffee, and Kerala Spices. Underground minerals (Iron, Coal, Petroleum) power our Cottage, Small-Scale, and Large-Scale Industries!`,
      explanationMl:
        `"${topic}": മൺസൂൺ കാലത്തെ ഖാരിഫ് വിളകളും (നെല്ല്, പരുത്തി) ശൈത്യകാലത്തെ റാബി വിളകളും (ഗോതമ്പ്), ഇരുമ്പ്-കൽക്കരി ധാതുക്കളും ഇന്ത്യയുടെ കാർഷിക-വ്യവസായ മേഖലകളെ ശക്തിപ്പെടുത്തുന്നു.`,
      funFactEn: '3D Model: Inspect the 3D Agricultural Harvest & Mineral Resource Model!',
      funFactMl: '3D മോഡൽ: കാർഷിക വിളകളുടെയും ധാതുസമ്പത്തിന്റെയും 3D മാതൃക!',
      modelType: tLower.includes('mineral') || tLower.includes('industry') ? 'coins' : 'tree_leaf',
    };
  }

  // Force, Work, Energy & Simple Machines
  if (tLower.includes('force') || tLower.includes('lever') || tLower.includes('pulley') || tLower.includes('machine') || tLower.includes('energy')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Simple Machines',
      emoji: '⚙️',
      explanationEn:
        `Understanding "${topic}": Force is a push or pull, while Friction opposes motion and Gravity pulls objects toward Earth. Simple Machines — Lever, Pulley, Wheel & Axle, Inclined Plane, Wedge, and Screw — make heavy work much easier!`,
      explanationMl:
        `"${topic}": ബലം (Force), ഘർഷണം (Friction), ഗുരുത്വാകർഷണം (Gravity) എന്നിവയും ഉത്തോലകം (Lever), കപ്പി (Pulley), ചരിവുതലം (Inclined Plane) തുടങ്ങിയ ലഘുയന്ത്രങ്ങളും ജോലി എളുപ്പമാക്കുന്നു.`,
      funFactEn: '3D Model: Explore the 3D Lever Seesaw, Fulcrum & Pulley Mechanism!',
      funFactMl: '3D മോഡൽ: ലഘുയന്ത്രങ്ങളുടെ (Lever & Fulcrum) 3D പ്രവർത്തന മാതൃക!',
      modelType: 'lever_machine',
    };
  }

  // Default rich topic explanation grounded in the chapter & topic
  const fallbackModels: TopicDetail['modelType'][] = ['book_stage', 'monument', 'globe', 'tree_leaf', 'compass', 'hourglass'];
  return {
    index,
    title: topic,
    shortLabel: topic.split(':')[0].slice(0, 22),
    emoji: ['📘', '🏛️', '🌍', '🌳', '🧭', '⏳'][index % 6],
    explanationEn: `Key Concept ${index + 1} in "${chapter.title}": ${topic}. ${chapter.summary}`,
    explanationMl: `"${chapter.malayalamTitle}" എന്ന പാഠത്തിലെ പ്രധാന ആശയം (${index + 1}): ${topic}. ${chapter.malayalamSummary}`,
    funFactEn: `3D Interactive Model for: ${topic}`,
    funFactMl: `3D മാതൃക: ${topic}`,
    modelType: fallbackModels[index % fallbackModels.length],
  };
}
