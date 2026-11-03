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

  // Teeth & Digestion
  if (tLower.includes('teeth') || tLower.includes('tooth') || tLower.includes('incisor') || tLower.includes('digest')) {
    return {
      index,
      title: topic,
      shortLabel: '3D Tooth & Digestion',
      emoji: '🦷',
      explanationEn:
        'Humans have 4 types of teeth: 8 flat Incisors (for biting/cutting), 4 sharp Canines (for tearing), 8 broad Premolars (for cracking), and 12 big Molars (for grinding food). Every tooth has a hard white outer Enamel crown, Dentine layer, and inner Pulp with nerves!',
      explanationMl:
        'മനുഷ്യരിൽ 4 തരം പല്ലുകളുണ്ട്: കടിച്ചുമുറിക്കാൻ ഉളിപ്പല്ലുകൾ (Incisors), കീറിമുറിക്കാൻ ദംഷ്ട്രകൾ (Canines), ചവച്ചരയ്ക്കാൻ അഗ്രചർവണകങ്ങളും ചർവണകങ്ങളും (Premolars & Molars). പല്ലിന്റെ പുറംപാളിയാണ് Enamel.',
      funFactEn: '3D Model: Rotate the 3D Molar Tooth Crown, Roots & Enamel Cross-Section!',
      funFactMl: '3D മോഡൽ: പല്ലിന്റെ ക്രൗൺ, ഇനാമൽ, വേരുകൾ എന്നിവയുടെ 3D മോഡൽ!',
      modelType: 'tooth',
    };
  }

  // Nutrition & Food
  if (tLower.includes('carbohydrate') || tLower.includes('protein') || tLower.includes('vitamin') || tLower.includes('diet') || tLower.includes('food')) {
    return {
      index,
      title: topic,
      shortLabel: 'Balanced Diet 3D',
      emoji: '🥗',
      explanationEn:
        'A Balanced Diet gives our body all 5 essential nutrients in the right amount: Carbohydrates & Fats (energy-giving rice, wheat, butter), Proteins (body-building milk, pulses, eggs, fish), and Vitamins & Minerals (protective fresh fruits and green vegetables) plus plenty of water!',
      explanationMl:
        'ശരീരത്തിന് ആവശ്യമായ കാർബോഹൈഡ്രേറ്റ് (ഊർജ്ജം), പ്രോട്ടീൻ (വളർച്ചയ്ക്ക്), വിറ്റാമിനുകളും ധാതുക്കളും (രോഗപ്രതിരോധത്തിന്), നാരുകൾ, ജലം എന്നിവ ശരിയായ അളവിൽ അടങ്ങിയതാണ് സമീകൃതാഹാരം (Balanced Diet).',
      funFactEn: '3D Model: Explore the 3D Balanced Nutrition Plate & Food Pyramid!',
      funFactMl: '3D മോഡൽ: സമീകൃതാഹാര പ്ലേറ്റും ഫുഡ് പിരമിഡും 3D-യിൽ!',
      modelType: 'food_plate',
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
