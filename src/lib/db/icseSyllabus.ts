import { Textbook } from './types';

/**
 * Complete ICSE (CISCE) E-Book Syllabus — Subject-Wise & Chapter-Wise
 * Covers:
 * - Class 4 (4th Standard): Science, Mathematics, English, Malayalam, Social Studies
 * - UKG (Upper Kindergarten): English Phonics, Mathematics, EVS & General Awareness, Malayalam
 */
export const ICSE_EBOOK_TEXTBOOKS: Textbook[] = [

  // 6. Hindi — Udan Khatola 4 (Rachna Sagar)
  {
      "id": "tb-c4-hindi-1",
      "subjectId": "sub-c4-hindi",
      "childId": "child-1",
      "title": "उड़न खटोला 4: हिंदी पाठ्यपुस्तक (Text-Cum-Workbook) — रचना सागर प्रा० लि०",
      "author": "मंजुलिका घोष (वरिष्ठ अध्यापिका, रामजस स्कूल, दिल्ली)",
      "publisher": "रचना सागर प्रा० लि० (Rachna Sagar Pvt. Ltd.)",
      "classGrade": "Class 4",
      "coverImage": "/textbooks/c4-hindi-udan-khatola.jpg",
      "chapters": [
          {
              "id": "chap-c4-hin-1",
              "chapterNumber": 1,
              "title": "पाठ 1: प्रकृति का संदेश (कविता - पर्वत कहता शीश उठाकर)",
              "malayalamTitle": "പ്രകൃതി നൽകുന്ന സന്ദേശം (ഹിന്ദി കവിത)",
              "summary": "सोहनलाल द्विवेदी जी की प्रसिद्ध प्रेरणादायक कविता। पर्वत शीश उठाकर ऊंचा बनने, सागर मन में गहराई लाने, तरंग उमंग से भरने और नभ सारा संसार ढक लेने की सीख देते हैं।",
              "malayalamSummary": "പർവ്വതവും കടലും ആകാശവും മനുഷ്യർക്ക് നൽകുന്ന ഉന്നതമായ സന്ദേശങ്ങൾ വിവരിക്കുന്ന കവിത.",
              "keyTerms": [
                  "पर्वत",
                  "शीश",
                  "सागर",
                  "तरंग",
                  "धैर्य",
                  "नभ",
                  "उमंग"
              ],
              "learningObjectives": [
                  "कविता का सस्वर एवं लयबद्ध वाचन करना",
                  "प्रकृति के तत्वों से धैर्य और उच्च विचारों की प्रेरणा लेना"
              ]
          },
          {
              "id": "chap-c4-hin-2",
              "chapterNumber": 2,
              "title": "पाठ 2: बीरबल की बुद्धिमानी (हास्य-बोध कथा - न्याय और चतुराई)",
              "malayalamTitle": "ബീർബലിന്റെ ബുദ്ധിസാമർത്ഥ്യം (ഹാസ്യകഥ)",
              "summary": "अकबर और बीरबल की बुद्धिमानी पर आधारित रोचक कहानी। बीरबल ने अपनी तीक्ष्ण बुद्धि और हाजिरजवाबी से चोर का पता लगाया और निर्दोष को न्याय दिलाया।",
              "malayalamSummary": "അക്ബറുടെ കൊട്ടാരത്തിലെ ബുദ്ധിമാനായ ബീർബൽ സത്യം വെളിച്ചത്തു കൊണ്ടുവരുന്ന രസകരമായ കഥ.",
              "keyTerms": [
                  "बीरबल",
                  "अकबर",
                  "न्याय",
                  "बुद्धिमानी",
                  "हाजिरजवाबी",
                  "दरबार"
              ],
              "learningObjectives": [
                  "मुश्किल परिस्थितियों में शांत रहकर बुद्धि से समाधान निकालना",
                  "नए हिंदी शब्दों का वाक्यों में सटीक प्रयोग करना"
              ]
          },
          {
              "id": "chap-c4-hin-3",
              "chapterNumber": 3,
              "title": "पाठ 3: उड़न खटोला की रोमांचक सैर (कल्पना-कथा - आकाश यात्रा)",
              "malayalamTitle": "ഉഡൻ ഖടോലയുടെ ആകാശയാത്ര (കഥ)",
              "summary": "उड़न खटोला पुस्तक की मुख्य शीर्षक कथा! दो छोटे बच्चे जादुई उड़न खटोले में बैठकर बादलों, पर्वतों और नदियों की सैर करते हैं और भारत की विविधता को ऊपर से देखते हैं।",
              "malayalamSummary": "മാന്ത്രിക വാഹനത്തിൽ ആകാശത്തിലൂടെ നാടുകാണാൻ പോകുന്ന കുട്ടികളുടെ അത്ഭുതകഥ.",
              "keyTerms": [
                  "उड़न खटोला",
                  "सैर",
                  "बादल",
                  "रोमांच",
                  "पर्वतमाला",
                  "कल्पना"
              ],
              "learningObjectives": [
                  "कल्पनाशक्ति और रचनात्मक वर्णन का विकास",
                  "आकाश यात्रा के माध्यम से भौगोलिक विविधता को समझना"
              ]
          },
          {
              "id": "chap-c4-hin-4",
              "chapterNumber": 4,
              "title": "पाठ 4: पेड़ हमारे सच्चे मित्र (पर्यावरण और वृक्ष संरक्षण)",
              "malayalamTitle": "മരങ്ങൾ നമ്മുടെ ഉത്തമ സുഹൃത്തുക്കൾ",
              "summary": "वृक्ष हमें प्राणवायु (ऑक्सीजन), मीठे फल, छाया, औषधियां और लकड़ी देते हैं। वृक्षारोपण और पर्यावरण संरक्षण का महत्व।",
              "malayalamSummary": "മരങ്ങൾ നൽകുന്ന തണലും ഫലങ്ങളും പ്രാണവായുവും, പരിസ്ഥിതി സംരക്ഷണത്തിന്റെ പ്രാധാന്യവും.",
              "keyTerms": [
                  "पेड़",
                  "प्राणवायु",
                  "छाया",
                  "औषधि",
                  "वृक्षारोपण",
                  "संरक्षण"
              ],
              "learningObjectives": [
                  "पेड़ों से मिलने वाले लाभों की सूची बनाना",
                  "अपने जन्मदिन पर एक पौधा लगाने का संकल्प लेना"
              ]
          },
          {
              "id": "chap-c4-hin-5",
              "chapterNumber": 5,
              "title": "पाठ 5: समय का मोल (अनुशासन और समय-पालन की सीख)",
              "malayalamTitle": "സമയത്തിന്റെ വില (അച്ചടക്ക പാഠം)",
              "summary": "बीता हुआ समय कभी वापस नहीं आता। समय-सारिणी (टाइम टेबल) बनाकर नियमित अध्ययन और खेलकूद करने वाला बच्चा ही जीवन में सफलता प्राप्त करता है।",
              "malayalamSummary": "പോയ സമയം തിരിച്ചു വരില്ല; സമയനിഷ്ഠ പാലിക്കേണ്ടതിന്റെ പ്രാധാന്യം.",
              "keyTerms": [
                  "समय",
                  "अनमोल",
                  "अनुशासन",
                  "नियम",
                  "सफलता",
                  "परिश्रम"
              ],
              "learningObjectives": [
                  "समय प्रबंधन और दैनिक दिनचर्या का पालन करना",
                  "समय के महत्व पर 5 पंक्तियाँ लिखना"
              ]
          },
          {
              "id": "chap-c4-hin-6",
              "chapterNumber": 6,
              "title": "पाठ 6: सच्चा मित्र और एकता की शक्ति (पंचतंत्र की प्रेरक कहानी)",
              "malayalamTitle": "സത്യമുള്ള സുഹൃത്തും ഐക്യത്തിന്റെ ശക്തിയും",
              "summary": "पंचतंत्र की प्रसिद्ध प्रेरक कथा - कबूतरों का जाल लेकर उड़ जाना और चूहे द्वारा जाल काटना। एकता में ही सबसे बड़ी शक्ति होती है।",
              "malayalamSummary": "ഐക്യമത്യം മഹാബലം എന്ന് വ്യക്തമാക്കുന്ന പ്രാവിൻകൂട്ടത്തിന്റെയും എലിയുടെയും കഥ.",
              "keyTerms": [
                  "मित्रता",
                  "एकता",
                  "संगठन",
                  "शिकारी",
                  "संकट",
                  "सद्भावना"
              ],
              "learningObjectives": [
                  "कठिन समय में मिलकर काम करने का महत्व समझना",
                  "कहानी का नैतिक संदेश अपने शब्दों में व्यक्त करना"
              ]
          },
          {
              "id": "chap-c4-hin-7",
              "chapterNumber": 7,
              "title": "पाठ 7: हिंदी व्याकरण उपवन: संज्ञा, सर्वनाम, विशेषण, क्रिया और विलोम शब्द",
              "malayalamTitle": "ഹിന്ദി വ്യാകരണം: നാമം, സർവ്വനാമം, ക്രിയ & വിപരീത പദങ്ങൾ",
              "summary": "संज्ञा (किसी व्यक्ति, वस्तु, स्थान का नाम), सर्वनाम (मैं, तुम, वह), विशेषण (गुण बताने वाले शब्द), क्रिया (काम का होना)। विलोम शब्द (दिन-रात, अच्छा-बुरा, मित्र-शत्रु)।",
              "malayalamSummary": "ഹിന്ദിയിലെ നാമം, സർവ്വനാമം, വിശേഷണം, ക്രിയ, വിപരീത പദങ്ങൾ എന്നിവയുടെ ലളിതമായ വിവരണം.",
              "keyTerms": [
                  "संज्ञा",
                  "सर्वनाम",
                  "विशेषण",
                  "क्रिया",
                  "विलोम शब्द",
                  "पर्यायवाची"
              ],
              "learningObjectives": [
                  "संज्ञा, सर्वनाम और क्रिया की सही पहचान करना",
                  "विलोम और पर्यायवाची शब्दों का अभ्यास करना"
              ]
          }
      ]
  },

  // 7. English Literature — FOCUS 4 (Ratna Sagar)
  {
      "id": "tb-c4-focus-1",
      "subjectId": "sub-c4-focus-eng",
      "childId": "child-1",
      "title": "FOCUS Book 4 Preparatory: A Complete English Course — Ratna Sagar",
      "author": "Christine Dacosta, Manaswini Sridhar, Sujatha Jayaprakash, Inderpreet Kaur",
      "publisher": "Ratna Sagar",
      "classGrade": "Class 4",
      "coverImage": "/textbooks/c4-eng-focus-4.jpg",
      "chapters": [
          {
              "id": "chap-c4-foc-1",
              "chapterNumber": 1,
              "title": "The Key to the Garden (Prose - Discovery & The Secret Garden)",
              "malayalamTitle": "പൂന്തോട്ടത്തിലേക്കുള്ള താക്കോൽ (കഥ)",
              "summary": "Adapted from Frances Hodgson Burnett's beloved classic 'The Secret Garden'. Mary Lennox discovers a rusted brass key buried in the earth and uncovers the ivy-covered door to a forgotten magical garden, finding hope, friendship, and nature's healing magic.",
              "malayalamSummary": "പ്രകൃതിയുടെ മാന്ത്രികതയും സൗഹൃദത്തിന്റെ പ്രാധാന്യവും വ്യക്തമാക്കുന്ന രഹസ്യ പൂന്തോട്ടത്തിന്റെ കഥ.",
              "keyTerms": [
                  "Secret Garden",
                  "Ivy",
                  "Robin Bird",
                  "Brass Key",
                  "Discovery",
                  "Curiosity"
              ],
              "learningObjectives": [
                  "Develop descriptive reading and inference skills",
                  "Identify character motivations and descriptive vocabulary"
              ]
          },
          {
              "id": "chap-c4-foc-2",
              "chapterNumber": 2,
              "title": "The Pied Piper of Hamelin (Classic Legend of Hamelin Town)",
              "malayalamTitle": "ഹാംലിനിലെ പൈഡ് പൈപ്പർ (ഐതിഹ്യ കഥ)",
              "summary": "Robert Browning's famous tale of Hamelin town overrun by rats. A mysterious piper dressed in half yellow and half red promises to rid the town of rats using his magical pipe. When the greedy Mayor refuses to pay the promised 1,000 guilders, the piper teaches the town an unforgettable lesson on honoring promises.",
              "malayalamSummary": "വാക്കുപാലിക്കേണ്ടതിന്റെ ആവശ്യകതയും അത്യാഗ്രഹത്തിന്റെ ദൂഷ്യഫലങ്ങളും പഠിപ്പിക്കുന്ന പ്രസിദ്ധ കഥ.",
              "keyTerms": [
                  "Pied Piper",
                  "Hamelin",
                  "Guilders",
                  "Promise",
                  "Magic Flute",
                  "Integrity"
              ],
              "learningObjectives": [
                  "Appreciate rhythm, setting, and dramatic storytelling",
                  "Understand the moral value of keeping one's promise"
              ]
          },
          {
              "id": "chap-c4-foc-3",
              "chapterNumber": 3,
              "title": "The Rocket Women of India (ISRO Mars Orbiter Mission - Mangalyaan)",
              "malayalamTitle": "ഭാരതത്തിന്റെ റോക്കറ്റ് വനിതകൾ (ശാസ്ത്ര നേട്ടം)",
              "summary": "The inspiring true story of the brilliant women scientists at ISRO (Indian Space Research Organisation) who spearheaded the Mars Orbiter Mission (Mangalyaan). How hard work, teamwork, and indigenous science placed India in Mars orbit on the very first attempt at minimal cost.",
              "malayalamSummary": "ഇന്ത്യയുടെ അഭിമാനമായ മംഗൾയാൻ ദൗത്യത്തിന് പിന്നിൽ പ്രവർത്തിച്ച വനിതാ ശാസ്ത്രജ്ഞരുടെ പ്രചോദനാത്മക കഥ.",
              "keyTerms": [
                  "ISRO",
                  "Mangalyaan",
                  "Mars Orbit",
                  "Rocket Science",
                  "Perseverance",
                  "Innovation"
              ],
              "learningObjectives": [
                  "Gain appreciation for Indian scientific achievements and space exploration",
                  "Learn factual comprehension and biographical reading"
              ]
          },
          {
              "id": "chap-c4-foc-4",
              "chapterNumber": 4,
              "title": "Tom Paints the Fence (Mark Twain's The Adventures of Tom Sawyer)",
              "malayalamTitle": "ടോം വേലിക്ക് പെയിന്റടിക്കുന്നു (ഹാസ്യ കഥ)",
              "summary": "Mark Twain's humorous episode where mischievous Tom Sawyer is punished with whitewashing a thirty-yard wooden fence on a sunny Saturday. By pretending that painting the fence is a grand, artistic privilege, Tom cleverly convinces his friends to give him their treasures just for a chance to paint!",
              "malayalamSummary": "ടോം സോയറിന്റെ രസകരമായ തന്ത്രവും ബുദ്ധിസാമർത്ഥ്യവും വരച്ചുകാട്ടുന്ന കഥ.",
              "keyTerms": [
                  "Tom Sawyer",
                  "Whitewash",
                  "Aunt Polly",
                  "Clever Trick",
                  "Humour",
                  "Playfulness"
              ],
              "learningObjectives": [
                  "Identify irony and light-hearted humor in classic literature",
                  "Expand vocabulary with colloquial dialogue and idioms"
              ]
          },
          {
              "id": "chap-c4-foc-5",
              "chapterNumber": 5,
              "title": "Out with the Goats (Johanna Spyri's Classic 'Heidi')",
              "malayalamTitle": "മലമുകളിലെ ആട്ടിടയൻ (ഹെയ്ഡിയുടെ കഥ)",
              "summary": "Little orphan Heidi accompanies Peter the goatherd up the breathtaking Swiss Alps. Surrounded by golden eagles, yellow rock-roses, and whispering fir trees, Heidi discovers the joy of simple, pure life in the mountains.",
              "malayalamSummary": "ആൽപ്സ് പർവ്വതനിരകളിലെ ശുദ്ധമായ പ്രകൃതിയും ആട്ടിൻകൂട്ടങ്ങളും നിറഞ്ഞ ഹെയ്ഡിയുടെ അനുഭവം.",
              "keyTerms": [
                  "Swiss Alps",
                  "Goatherd",
                  "Pasture",
                  "Mountain Breeze",
                  "Nature",
                  "Contentment"
              ],
              "learningObjectives": [
                  "Analyze sensory imagery describing nature and wildlife",
                  "Express personal reactions through creative writing"
              ]
          },
          {
              "id": "chap-c4-foc-6",
              "chapterNumber": 6,
              "title": "Young Kalam: The Boy from Rameswaram (APJ Abdul Kalam Biography)",
              "malayalamTitle": "കൊച്ചു കലാം: രാമേശ്വരത്തെ മിടുക്കൻ",
              "summary": "The childhood of Dr. A.P.J. Abdul Kalam, from delivering newspapers at dawn at Rameswaram railway station to his dream of flying like sea birds. How curiosity, dedication to studies, and parental values molded him into India's beloved 'Missile Man' and President.",
              "malayalamSummary": "ഡോ. എ.പി.ജെ. അബ്ദുൾ കലാമിന്റെ ബാല്യകാല പോരാട്ടങ്ങളും സ്വപ്നങ്ങളും.",
              "keyTerms": [
                  "Dr. APJ Abdul Kalam",
                  "Rameswaram",
                  "Dedication",
                  "Dream High",
                  "Missile Man",
                  "Humility"
              ],
              "learningObjectives": [
                  "Draw inspiration from Kalam's resilience and thirst for knowledge",
                  "Write a short character sketch using descriptive adjectives"
              ]
          },
          {
              "id": "chap-c4-foc-7",
              "chapterNumber": 7,
              "title": "The Magic Pot (Folk Tale of Kindness & Contentment)",
              "malayalamTitle": "മാന്ത്രിക പാത്രം (നാടോടിക്കഥ)",
              "summary": "A poor, hardworking farmer finds a magical copper pot buried in his field that duplicates whatever is placed inside it. When he drops his spade in, two spades appear. But when a greedy village landlord tries to seize it, greed leads to hilarious and rightful consequences.",
              "malayalamSummary": "അത്യാഗ്രഹം വിനാശത്തിന് കാരണമാകും എന്ന് വ്യക്തമാക്കുന്ന മാന്ത്രിക പാത്രത്തിന്റെ നാടോടിക്കഥ.",
              "keyTerms": [
                  "Magic Pot",
                  "Farmer",
                  "Duplication",
                  "Greed",
                  "Justice",
                  "Contentment"
              ],
              "learningObjectives": [
                  "Understand story structure: Beginning, Problem, Climax, and Resolution",
                  "Discuss the ethical theme that true wealth lies in contentment"
              ]
          }
      ]
  },

  // 8. Coding & AI — Coding Capers 4 (KIPS Learning)
  {
      "id": "tb-c4-coding-1",
      "subjectId": "sub-c4-coding",
      "childId": "child-1",
      "title": "Coding Capers 4: Empowering NexGen with AI-Robotics and Coding — KIPS Learning",
      "author": "Kips Editorial Team",
      "publisher": "KIPS LEARNING PVT. LTD.",
      "classGrade": "Class 4",
      "coverImage": "/textbooks/c4-comp-coding-capers-4.jpg",
      "chapters": [
          {
              "id": "chap-c4-cod-1",
              "chapterNumber": 1,
              "title": "Computer Memory & Storage: Bits, Bytes, RAM, ROM & Secondary Disks",
              "malayalamTitle": "കമ്പ്യൂട്ടർ മെമ്മറിയും സ്റ്റോറേജും: ബിറ്റുകൾ, ബൈറ്റുകൾ & ഹാർഡ് ഡിസ്ക്",
              "summary": "How computers store digital data. Binary digits (0 and 1) make up Bits and Bytes (8 bits = 1 Byte; 1024 Bytes = 1 KB; 1024 KB = 1 MB; 1024 MB = 1 GB). Internal memory: RAM (Random Access Memory - volatile) and ROM (Read Only Memory - non-volatile). Secondary storage: Hard Disk, SSD, USB Flash Pen Drive, Cloud Storage.",
              "malayalamSummary": "കമ്പ്യൂട്ടർ വിവരങ്ങൾ സൂക്ഷിക്കുന്ന രീതി, ബിറ്റ്, ബൈറ്റ്, റാം (RAM), റോം (ROM), പെൻഡ്രൈവ്, ഹാർഡ് ഡിസ്ക്.",
              "keyTerms": [
                  "Bit",
                  "Byte",
                  "RAM",
                  "ROM",
                  "Volatile Memory",
                  "Hard Disk",
                  "Pen Drive",
                  "Cloud Storage"
              ],
              "learningObjectives": [
                  "Understand units of digital memory from bytes to gigabytes",
                  "Distinguish primary internal memory (RAM/ROM) from secondary storage"
              ]
          },
          {
              "id": "chap-c4-cod-2",
              "chapterNumber": 2,
              "title": "Operating System & Desktop Management: Windows, Files & Folders",
              "malayalamTitle": "ഓപ്പറേറ്റിംഗ് സിസ്റ്റവും ഡെസ്ക്ടോപ്പ് മാനേജ്മെന്റും",
              "summary": "The Operating System as an interface between user and computer hardware. Windows 11 GUI desktop features: Taskbar, Start Menu, System Tray, Desktop Icons. Creating, renaming, moving, copying, and deleting files and folders. Personalizing wallpaper and screen savers. The Recycle Bin.",
              "malayalamSummary": "വിൻഡോസ് ഓപ്പറേറ്റിംഗ് സിസ്റ്റം, ഫയലുകളും ഫോൾഡറുകളും ഉണ്ടാക്കൽ, ഡെസ്ക്ടോപ്പ് ക്രമീകരിക്കൽ.",
              "keyTerms": [
                  "Operating System",
                  "GUI",
                  "Taskbar",
                  "File",
                  "Folder",
                  "Recycle Bin",
                  "Shortcuts"
              ],
              "learningObjectives": [
                  "Organize computer files efficiently into structured folders",
                  "Navigate Windows taskbar and system settings with confidence"
              ]
          },
          {
              "id": "chap-c4-cod-3",
              "chapterNumber": 3,
              "title": "Word Processing Tools: Formatting, Font Styling & Alignment",
              "malayalamTitle": "വേർഡ് പ്രോസസ്സിംഗ് ടൂളുകൾ: ഫോർമാറ്റിംഗും അലൈൻമെന്റും",
              "summary": "Creating and editing documents in Word. Font formatting: Typeface, Font Size, Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U), Text Color, and Highlight. Text Alignment: Align Left, Center, Align Right, Justify. Line spacing, Bulleted and Numbered lists. Using Find and Replace.",
              "malayalamSummary": "വേർഡ് പ്രോസസ്സറിലെ ടെക്സ്റ്റ് എഡിറ്റിംഗ്, ഫോണ്ട് മാറ്റൽ, ബുള്ളറ്റ് പോയിന്റുകൾ, അലൈൻമെന്റ്.",
              "keyTerms": [
                  "Word Processor",
                  "Font",
                  "Alignment",
                  "Bullets",
                  "Find and Replace",
                  "Cut-Copy-Paste"
              ],
              "learningObjectives": [
                  "Format creative school essays with stylish fonts and proper paragraph alignment",
                  "Master essential keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+Z)"
              ]
          },
          {
              "id": "chap-c4-cod-4",
              "chapterNumber": 4,
              "title": "Step-wise Algorithmic Thinking: Logic, Sequencing & Flowcharts",
              "malayalamTitle": "ഘട്ടംഘട്ടമായുള്ള ചിന്താരീതിയും അൽഗോരിതവും",
              "summary": "Breaking down complex problems into step-by-step logical instructions (Algorithms). Daily life algorithms (brushing teeth, making lemonade, packing school bag). Flowcharts: Start/Stop oval, Input/Output parallelogram, Process rectangle, Decision diamond, Flow lines.",
              "malayalamSummary": "പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നതിനുള്ള ഘട്ടംഘട്ടമായുള്ള വഴികൾ (അൽഗോരിതം), ഫ്ലോചാർട്ട് ചിഹ്നങ്ങൾ.",
              "keyTerms": [
                  "Algorithm",
                  "Flowchart",
                  "Sequence",
                  "Input-Process-Output",
                  "Decision Box"
              ],
              "learningObjectives": [
                  "Formulate precise step-by-step instructions for daily and math tasks",
                  "Interpret and draw simple flowcharts using standard geometric blocks"
              ]
          },
          {
              "id": "chap-c4-cod-5",
              "chapterNumber": 5,
              "title": "Introduction to Presentation Software: Slides, Themes & Transitions",
              "malayalamTitle": "ഡിജിറ്റൽ പ്രസന്റേഷൻ: സ്ലൈഡുകളും ആനിമേഷനും",
              "summary": "Basics of digital presentations (PowerPoint / Google Slides). What is a Slide? Adding Title and Subtitle, inserting colorful images, shapes, and text boxes. Applying design templates and background themes. Slide Transitions and running a Slide Show (F5 key).",
              "malayalamSummary": "സ്ലൈഡുകൾ ഉണ്ടാക്കൽ, ചിത്രങ്ങൾ ചേർക്കൽ, തീമുകൾ, സ്ലൈഡ് ഷോ (Slide Show) പ്രവർത്തിപ്പിക്കൽ.",
              "keyTerms": [
                  "Slide",
                  "Presentation",
                  "Theme",
                  "Transition",
                  "Slide Show",
                  "Placeholder"
              ],
              "learningObjectives": [
                  "Build a 3-slide visual presentation on a favorite topic",
                  "Deliver a digital slide show with smooth transition effects"
              ]
          },
          {
              "id": "chap-c4-cod-6",
              "chapterNumber": 6,
              "title": "Visual Block Coding & Loops: Sprites, Motion & Events",
              "malayalamTitle": "ബ്ലോക്ക് കോഡിംഗും ലൂപ്പുകളും: സ്പ്രൈറ്റും ചലനങ്ങളും",
              "summary": "Introduction to block-based visual coding (Scratch / Blockly environment). The Stage and Sprites. Palette blocks: Motion (Move 10 steps, Turn 15 degrees), Looks (Say Hello!, Change Costume), Sound (Play Meow), Events (When Green Flag Clicked), and Control (Repeat 10 times loop, Wait 1 sec).",
              "malayalamSummary": "ബ്ലോക്ക് കോഡിംഗ്, സ്പ്രൈറ്റുകൾ, ചലനങ്ങൾ, ഗ്രീൻ ഫ്ലാഗ് ക്ലിക്ക് ചെയ്യുമ്പോൾ ആരംഭിക്കുന്ന ആനിമേഷനുകൾ.",
              "keyTerms": [
                  "Block Coding",
                  "Sprite",
                  "Stage",
                  "Green Flag",
                  "Loops",
                  "Event Trigger"
              ],
              "learningObjectives": [
                  "Snap together coding blocks to animate an interactive moving character",
                  "Use repeat loops to eliminate repetitive code lines"
              ]
          },
          {
              "id": "chap-c4-cod-7",
              "chapterNumber": 7,
              "title": "AI & Robotics Pioneers: Sensors, Smart Machines & Future Technology",
              "malayalamTitle": "ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസും റോബോട്ടിക്സും: സ്മാർട്ട് മെഷീനുകൾ",
              "summary": "What is Artificial Intelligence (AI)? How AI machines learn from data examples. Natural vs Artificial Intelligence. Smart machines around us: Face recognition, Voice assistants (Siri, Alexa), Self-driving cars, Vacuum cleaning robots. Components of a Robot: Sensors (Eyes/Ears), Controller (Brain), Actuators (Motors/Arms).",
              "malayalamSummary": "എന്താണ് ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് (AI), റോബോട്ടുകളുടെ ഭാഗങ്ങൾ (സെൻസർ, മോട്ടോർ), സ്മാർട്ട് സാങ്കേതികവിദ്യ.",
              "keyTerms": [
                  "Artificial Intelligence",
                  "Robotics",
                  "Sensors",
                  "Actuators",
                  "Voice Assistant",
                  "Smart Automation"
              ],
              "learningObjectives": [
                  "Recognize AI in everyday gadgets and applications",
                  "Understand how robots sense, think, and take action in physical environments"
              ]
          }
      ]
  },

  // 9. Value Education — Joy of Better Living 4 (Arrow Publications)
  {
      "id": "tb-c4-moral-1",
      "subjectId": "sub-c4-moral",
      "childId": "child-1",
      "title": "Joy of Better Living Book-4: For the Curious Minds — Arrow Publications",
      "author": "Dr. Martin Mallath CMI & Editorial Team",
      "publisher": "Arrow Publications Pvt. Ltd.",
      "classGrade": "Class 4",
      "coverImage": "/textbooks/c4-moral-joy-of-better-living-4.jpg",
      "chapters": [
          {
              "id": "chap-c4-mor-1",
              "chapterNumber": 1,
              "title": "Gratitude & Prayer: Counting Our Daily Blessings",
              "malayalamTitle": "നന്ദിയും പ്രാർത്ഥനയും: അനുഗ്രഹങ്ങളെ തിരിച്ചറിയൽ",
              "summary": "Learning to appreciate the gift of life, loving parents, teachers, good health, and nature. Saying 'Thank You' genuinely. Starting each morning with a peaceful prayer and a cheerful heart.",
              "malayalamSummary": "ജീവിതത്തിലെ നന്മകൾക്കും മാതാപിതാക്കളുടെ സ്നേഹത്തിനും നന്ദി പറയുന്ന നല്ല ശീലം.",
              "keyTerms": [
                  "Gratitude",
                  "Blessings",
                  "Thankfulness",
                  "Prayer",
                  "Peace"
              ],
              "learningObjectives": [
                  "Cultivate an attitude of genuine gratitude towards family and helpers",
                  "Express thankfulness through daily positive affirmations"
              ]
          },
          {
              "id": "chap-c4-mor-2",
              "chapterNumber": 2,
              "title": "The Gift of Honesty: Truthfulness in Words and Actions",
              "malayalamTitle": "സത്യസന്ധത എന്ന സുകൃതം: വാക്കിലും പ്രവർത്തിയിലും",
              "summary": "Why honesty is the cornerstone of trust. Admitting mistakes courageously without fear. The story of Abraham Lincoln walking miles to return extra pennies. A peaceful conscience is the best pillow to sleep on.",
              "malayalamSummary": "ധൈര്യത്തോടെ സത്യം പറയാനും തെറ്റുകൾ തിരുത്താനുമുള്ള സന്നദ്ധത.",
              "keyTerms": [
                  "Honesty",
                  "Truth",
                  "Integrity",
                  "Courage",
                  "Trustworthiness"
              ],
              "learningObjectives": [
                  "Understand why truth builds lifelong trust and respect",
                  "Practice honesty in school tests, games, and home chores"
              ]
          },
          {
              "id": "chap-c4-mor-3",
              "chapterNumber": 3,
              "title": "Empathy and Kindness: Caring for Elders, Friends & Animals",
              "malayalamTitle": "സഹാനുഭൂതിയും ദയയും: മുതിർന്നവരെയും ജീവികളെയും സ്നേഹിക്കൽ",
              "summary": "Putting yourself in someone else's shoes. Helping elderly grandparents, welcoming new classmates, standing up against bullying, and treating stray animals with tender compassion.",
              "malayalamSummary": "മറ്റുള്ളവരുടെ സങ്കടങ്ങൾ മനസ്സിലാക്കി സ്നേഹത്തോടെ സഹായിക്കാനുള്ള മനസ്സ്.",
              "keyTerms": [
                  "Empathy",
                  "Kindness",
                  "Compassion",
                  "Respect for Elders",
                  "Inclusion"
              ],
              "learningObjectives": [
                  "Practice small acts of unexpected kindness every day",
                  "Demonstrate respect and affection for grandparents and helpers"
              ]
          },
          {
              "id": "chap-c4-mor-4",
              "chapterNumber": 4,
              "title": "Teamwork & Cooperation: Together Everyone Achieves More",
              "malayalamTitle": "ഒരുമയും കൂട്ടായ്മയും: ഐക്യമത്യം മഹാബലം",
              "summary": "The power of working harmoniously as a team. Listening to others, sharing responsibilities, celebrating group victories, and supporting friends when they fall. A bunch of sticks cannot be broken!",
              "malayalamSummary": "ഒരുമിച്ച് നിന്ന് പ്രവർത്തിക്കുമ്പോൾ ലഭിക്കുന്ന വലിയ വിജയം.",
              "keyTerms": [
                  "Teamwork",
                  "Cooperation",
                  "Sharing",
                  "Unity",
                  "Sportsmanship"
              ],
              "learningObjectives": [
                  "Cooperate happily in group projects and playground sports",
                  "Value every member's contribution regardless of differences"
              ]
          },
          {
              "id": "chap-c4-mor-5",
              "chapterNumber": 5,
              "title": "Respect for Nature: Green Earth, Clean Water & No Waste",
              "malayalamTitle": "പ്രകൃതിയോടുള്ള ആദരവ്: പരിസ്ഥിതി സംരക്ഷണം",
              "summary": "Nature is God's grandest home. Avoiding single-use plastics, turning off running water taps, switching off unused lights, planting saplings, and keeping school grounds litter-free.",
              "malayalamSummary": "ഭൂമിയെയും ജലത്തെയും സംരക്ഷിക്കേണ്ടത് നമ്മുടെ ഓരോരുത്തരുടെയും കടമയാണ്.",
              "keyTerms": [
                  "Clean Earth",
                  "Conservation",
                  "Plastic Free",
                  "Save Water",
                  "Eco Warrior"
              ],
              "learningObjectives": [
                  "Adopt eco-friendly habits in personal daily routine",
                  "Participate actively in planting trees and conserving water"
              ]
          },
          {
              "id": "chap-c4-mor-6",
              "chapterNumber": 6,
              "title": "Courage & Perseverance: Never Giving Up on Good Goals",
              "malayalamTitle": "ആത്മധൈര്യവും സ്ഥിരോത്സാഹവും: പരാജയങ്ങളിൽ തളരാതിരിക്കൽ",
              "summary": "Mistakes and failures are stepping stones to success. The story of King Bruce and the persevering spider. Cultivating a growth mindset: 'I can do it with practice!'",
              "malayalamSummary": "ലക്ഷ്യത്തിലെത്തും വരെ പ്രയത്നിക്കാനുള്ള ആത്മധൈര്യം.",
              "keyTerms": [
                  "Perseverance",
                  "Determination",
                  "Growth Mindset",
                  "Courage",
                  "Resilience"
              ],
              "learningObjectives": [
                  "Develop resilience in tackling difficult school subjects and challenges",
                  "Maintain optimistic spirit when things do not go as planned"
              ]
          }
      ]
  },

  // ============================================================================
  // CLASS 4 (4TH STANDARD) — 5 SUBJECT E-BOOKS
  // ============================================================================

  // 1. Class 4 — Science & EVS
  {
    id: 'tb-c4-sci-1',
    childId: 'child-1',
    subjectId: 'sub-c3-science',
    title: 'ICSE Oxford Interactive Science: Class 4 E-Book',
    academicYear: '2026-2027',
    classGrade: 'Class 4',
    fileName: 'ICSE_Class4_Science_Full_EBook.pdf',
    fileSize: '6.4 MB',
    pageCount: 164,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-c4-sci-1',
        chapterNumber: 1,
        title: 'Food We Eat & Balanced Nutrition',
        malayalamTitle: 'നമ്മുടെ ആഹാരവും സമീകൃതാഹാരവും',
        summary: 'Nutrients in food: Carbohydrates (energy-giving), Proteins (body-building), Fats, Vitamins & Minerals (protective foods), Roughage, Water, Balanced Diet, and Food Preservation.',
        malayalamSummary: 'കാർബോഹൈഡ്രേറ്റ്, പ്രോട്ടീൻ, കൊഴുപ്പ്, വിറ്റാമിനുകൾ, ധാതുക്കൾ, സമീകൃതാഹാരം, ആഹാര സംരക്ഷണ രീതികൾ എന്നിവയെക്കുറിച്ച് പഠിക്കാം.',
        topics: [
          'Energy-giving Foods (Carbohydrates & Fats)',
          'Body-building Foods (Proteins)',
          'Protective Foods (Vitamins & Minerals)',
          'Balanced Diet & Food Pyramid',
          'Methods of Food Preservation (Drying, Freezing, Salting)',
        ],
        keyTerms: ['Nutrients', 'Carbohydrates', 'Proteins', 'Vitamins', 'Balanced Diet', 'Roughage'],
        pageNumber: 5,
      },
      {
        id: 'chap-c4-sci-2',
        chapterNumber: 2,
        title: 'My Teeth & The Digestive System',
        malayalamTitle: 'പല്ലുകളും ദഹനവ്യവസ്ഥയും',
        summary: 'Sets of teeth (Milk teeth & Permanent teeth), 4 types of teeth (Incisors, Canines, Premolars, Molars), structure of a tooth (Enamel, Dentine, Pulp), dental care, and organs of the human digestive system.',
        malayalamSummary: 'പാൽപ്പല്ലുകളും സ്ഥിരമായ പല്ലുകളും, 4 തരം പല്ലുകൾ, പല്ലിന്റെ ഘടന, ദഹനവ്യവസ്ഥയിലെ പ്രധാന അവയവങ്ങൾ.',
        topics: [
          'Milk Teeth (20) & Permanent Teeth (32)',
          'Four Types of Teeth: Incisors, Canines, Premolars, Molars',
          'Parts of a Tooth: Crown, Root, Enamel, Dentine, Pulp',
          'The Human Digestive Journey: Mouth → Food Pipe → Stomach → Intestines',
          'Healthy Dental Care Habits & Microbes',
        ],
        keyTerms: ['Incisors', 'Canines', 'Premolars', 'Molars', 'Enamel', 'Digestion', 'Saliva'],
        pageNumber: 24,
      },
      {
        id: 'chap-c4-sci-3',
        chapterNumber: 3,
        title: 'Plant Life: Adaptations & Photosynthesis',
        malayalamTitle: 'സസ്യജീവിതം: അനുകൂലനങ്ങളും പ്രകാശസംശ്ലേഷണവും',
        summary: 'How green leaves make food through Photosynthesis using sunlight, water, carbon dioxide, and chlorophyll. Terrestrial plants (mountains, plains, deserts) and Aquatic plants (floating, fixed, underwater).',
        malayalamSummary: 'ഇലകൾ സൂര്യപ്രകാശം ഉപയോഗിച്ച് പ്രകാശസംശ്ലേഷണത്തിലൂടെ ആഹാരം നിർമ്മിക്കുന്ന വിധവും കരയിലെയും ജലത്തിലെയും സസ്യങ്ങളുടെ സവിശേഷതകളും.',
        topics: [
          'Parts of a Leaf: Leaf Blade, Midrib, Veins & Stomata',
          'Photosynthesis: Sunlight + Water + Carbon Dioxide → Glucose + Oxygen',
          'Terrestrial Plants: Desert Cactus, Pine Trees on Hills, Mangrove Breathing Roots',
          'Aquatic Plants: Floating (Duckweed), Fixed (Lotus), Underwater (Hydrilla)',
          'Insectivorous Plants (Venus Flytrap & Pitcher Plant)',
        ],
        keyTerms: ['Photosynthesis', 'Chlorophyll', 'Stomata', 'Adaptation', 'Terrestrial', 'Aquatic'],
        pageNumber: 46,
      },
      {
        id: 'chap-c4-sci-4',
        chapterNumber: 4,
        title: 'Adaptations in Animals',
        malayalamTitle: 'മൃഗങ്ങളിലെ അനുകൂലനങ്ങൾ (വാസസ്ഥലങ്ങൾ)',
        summary: 'How animals adapt to habitats: Terrestrial, Aquatic, Amphibians, Arboreal, and Aerial animals. Adaptation for food (Herbivores, Carnivores, Omnivores) and protection (Camouflage, Hibernation, Migration).',
        malayalamSummary: 'മൃഗങ്ങളുടെ വാസസ്ഥലങ്ങൾ, ആഹാരരീതികൾ (സസ്യഭുക്കുകൾ, മാംസഭുക്കുകൾ), സ്വയം രക്ഷയ്ക്കുള്ള നിറംമാറ്റം (Camouflage), ദേശാടനം.',
        topics: [
          'Terrestrial, Aquatic, Amphibian, Arboreal & Aerial Animals',
          'Camel (Ship of the Desert) & Polar Bear Adaptations',
          'Herbivores, Carnivores, Omnivores & Scavengers',
          'Camouflage (Chameleon, Tiger Stripes, Stick Insect)',
          'Hibernation (Winter Sleep) & Bird Migration',
        ],
        keyTerms: ['Habitat', 'Amphibian', 'Arboreal', 'Camouflage', 'Hibernation', 'Migration'],
        pageNumber: 68,
      },
      {
        id: 'chap-c4-sci-5',
        chapterNumber: 5,
        title: 'States of Matter: Solids, Liquids, Gases & Solutions',
        malayalamTitle: 'ദ്രവ്യത്തിന്റെ അവസ്ഥകൾ: ഖരം, ദ്രാവകം, വാതകം',
        summary: 'Molecular arrangement in Solids, Liquids, and Gases. Change of states (Melting, Evaporation, Condensation, Freezing). Solute, Solvent, and Solution.',
        malayalamSummary: 'ഖരം, ദ്രാവകം, വാതകം എന്നിവയിലെ തന്മാത്രകളുടെ ക്രമീകരണവും അവസ്ഥാമാറ്റങ്ങളും ലായനികളും.',
        topics: [
          'What is Matter? Molecules & Atoms',
          'Properties of Solids, Liquids, and Gases',
          'Melting, Freezing, Evaporation & Condensation',
          'Solute + Solvent = Solution (Soluble & Insoluble Substances)',
        ],
        keyTerms: ['Matter', 'Molecule', 'Solid', 'Liquid', 'Gas', 'Solute', 'Solvent', 'Solution'],
        pageNumber: 92,
      },
      {
        id: 'chap-c4-sci-6',
        chapterNumber: 6,
        title: 'Force, Work, Energy & Simple Machines',
        malayalamTitle: 'ബലം, പ്രവൃത്തി, ഊർജ്ജം, ലഘുയന്ത്രങ്ങൾ',
        summary: 'Push and Pull forces, Gravity, Friction, Muscular & Magnetic forces. Renewable energy (Solar, Wind, Hydro) and 6 Simple Machines (Lever, Pulley, Wheel & Axle, Inclined Plane, Wedge, Screw).',
        malayalamSummary: 'തള്ളലും വലിക്കലും, ഗുരുത്വാകർഷണ ബലം, ഘർഷണം, സൗരോർജ്ജം, ജോലി എളുപ്പമാക്കുന്ന ലഘുയന്ത്രങ്ങൾ.',
        topics: [
          'Force: Push & Pull, Effects of Force',
          'Gravity & Friction in Daily Life',
          'Forms of Energy: Solar, Wind, Water, Heat & Electrical Energy',
          'Simple Machines: Lever, Pulley, Inclined Plane, Wheel & Axle',
        ],
        keyTerms: ['Force', 'Gravity', 'Friction', 'Work', 'Energy', 'Lever', 'Pulley'],
        pageNumber: 118,
      },
      {
        id: 'chap-c4-sci-7',
        chapterNumber: 7,
        title: 'Our Solar System, Earth, Air & Light',
        malayalamTitle: 'സൗരയൂഥം, ഭൂമി, വായു, പ്രകാശം',
        summary: 'The Sun and 8 Planets, Earth’s Rotation (Day & Night) and Revolution (Seasons), Water Cycle, Sea Breeze & Land Breeze, Luminous and Non-luminous objects, and Shadows.',
        malayalamSummary: 'സൂര്യനും 8 ഗ്രഹങ്ങളും, ഭൂമിയുടെ ഭ്രമണവും പരിക്രമണവും, ജലചക്രം, കടൽകാറ്റും കരക്കാറ്റും, പ്രകാശവും നിഴലും.',
        topics: [
          'The Sun & 8 Planets in Order',
          'Rotation (24 Hours = Day/Night) & Revolution (365¼ Days = Seasons)',
          'The Water Cycle & Weather',
          'Luminous vs Non-Luminous Objects, Transparent, Translucent & Opaque',
        ],
        keyTerms: ['Orbit', 'Rotation', 'Revolution', 'Evaporation', 'Luminous', 'Opaque'],
        pageNumber: 142,
      },
    ],
  },

  // 2. Class 4 — Mathematics
  {
    id: 'tb-c4-math-1',
    childId: 'child-1',
    subjectId: 'sub-c3-math',
    title: 'ICSE Foundation Mathematics: Class 4 E-Book',
    academicYear: '2026-2027',
    classGrade: 'Class 4',
    fileName: 'ICSE_Class4_Mathematics_Full_EBook.pdf',
    fileSize: '5.8 MB',
    pageCount: 180,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-c4-math-1',
        chapterNumber: 1,
        title: 'Large Numbers & Place Value (5 & 6-Digit Numbers)',
        malayalamTitle: 'വലിയ സംഖ്യകളും സ്ഥാനവിലയും (5, 6 അക്ക സംഖ്യകൾ)',
        summary: 'Reading and writing 5-digit and 6-digit numbers up to Lakhs, Indian vs International Place Value Chart, Face Value & Place Value, Expanded Form, Rounding Off, and Roman Numerals (I to C).',
        malayalamSummary: 'അഞ്ചക്ക, ആറക്ക സംഖ്യകൾ, ഇന്ത്യൻ-അന്താരാഷ്ട്ര സ്ഥാനവില പട്ടിക, വിപുലീകൃത രൂപം, റോമൻ സംഖ്യകൾ.',
        topics: [
          '5-Digit & 6-Digit Numbers (Ones, Tens, Hundreds, Thousands, Ten Thousands, Lakhs)',
          'Place Value vs Face Value & Expanded Form',
          'Comparing, Ascending & Descending Order of Numbers',
          'Roman Numerals (I, V, X, L, C)',
        ],
        keyTerms: ['Place Value', 'Face Value', 'Lakh', 'Expanded Form', 'Successor', 'Predecessor', 'Roman Numerals'],
        pageNumber: 6,
      },
      {
        id: 'chap-c4-math-2',
        chapterNumber: 2,
        title: 'Addition & Subtraction of Large Numbers',
        malayalamTitle: 'വലിയ സംഖ്യകളുടെ കൂട്ടലും കുറയ്ക്കലും',
        summary: '4-digit and 5-digit addition with regrouping (carrying), subtraction with borrowing, checking subtraction using addition, and real-life story word problems.',
        malayalamSummary: 'വലിയ സംഖ്യകളുടെ കൂട്ടലും കുറയ്ക്കലും, ദൈനംദിന ജീവിതത്തിലെ കണക്ക് ചോദ്യങ്ങളും.',
        topics: [
          'Adding 4-Digit and 5-Digit Numbers with Regrouping',
          'Properties of Addition (Zero Property, Order Property)',
          'Subtracting Large Numbers with Borrowing',
          'Two-Step Word Problems in Addition & Subtraction',
        ],
        keyTerms: ['Addend', 'Sum', 'Minuend', 'Subtrahend', 'Difference', 'Regrouping'],
        pageNumber: 28,
      },
      {
        id: 'chap-c4-math-3',
        chapterNumber: 3,
        title: 'Multiplication & Division Mastery',
        malayalamTitle: 'ഗുണനവും ഹരണവും',
        summary: 'Multiplication tables 2 to 20, multiplying by 2-digit and 3-digit numbers, multiplying by 10, 100, 1000, equal grouping division (e.g., How many 5s in 20), and long division with remainder.',
        malayalamSummary: 'ഗുണന പട്ടികകൾ, 2-3 അക്ക സംഖ്യകൾ കൊണ്ടുള്ള ഗുണനം, ഹരണം, ശിഷ്ടം കണ്ടെത്തൽ.',
        topics: [
          'Multiplying 3-Digit & 4-Digit Numbers by 2-Digit Numbers',
          'Shortcut Multiplication by 10, 100, and 1000',
          'Division as Equal Grouping & Repeated Subtraction',
          'Long Division: Dividend = Divisor × Quotient + Remainder',
        ],
        keyTerms: ['Multiplicand', 'Multiplier', 'Product', 'Dividend', 'Divisor', 'Quotient', 'Remainder'],
        pageNumber: 54,
      },
      {
        id: 'chap-c4-math-4',
        chapterNumber: 4,
        title: 'Factors & Multiples (HCF & LCM)',
        malayalamTitle: 'ഘടകങ്ങളും ഗുണിതങ്ങളും (HCF & LCM)',
        summary: 'Understanding factors and multiples, Prime and Composite numbers, Prime Factorization using Factor Trees, Divisibility Rules (by 2, 3, 5, 9, 10), Common Factors (HCF) and Common Multiples (LCM).',
        malayalamSummary: 'ഘടകങ്ങൾ, ഗുണിതങ്ങൾ, അഭാജ്യ സംഖ്യകൾ (Prime Numbers), ഭാജ്യ സംഖ്യകൾ, ഹരണ നിയമങ്ങൾ.',
        topics: [
          'Finding All Factors of a Number',
          'Prime Numbers vs Composite Numbers (1 to 100)',
          'Divisibility Tests for 2, 3, 5, 6, 9, and 10',
          'Highest Common Factor (HCF) & Least Common Multiple (LCM)',
        ],
        keyTerms: ['Factor', 'Multiple', 'Prime Number', 'Composite Number', 'HCF', 'LCM'],
        pageNumber: 82,
      },
      {
        id: 'chap-c4-math-5',
        chapterNumber: 5,
        title: 'Fractions & Introduction to Decimals',
        malayalamTitle: 'ഭിന്നസംഖ്യകളും ദശാംശസംഖ്യകളും',
        summary: 'Like and Unlike Fractions, Unit Fractions, Proper, Improper and Mixed Fractions, Equivalent Fractions, Adding and Subtracting Like Fractions, and Tenths/Hundredths in Decimals.',
        malayalamSummary: 'തുല്യ ഭിന്നസംഖ്യകൾ, വിഷമ ഭിന്നങ്ങൾ, മിശ്ര ഭിന്നങ്ങൾ, ഭിന്നസംഖ്യകളുടെ കൂട്ടൽ, ദശാംശ സംഖ്യകൾ.',
        topics: [
          'Numerator & Denominator, Equivalent Fractions',
          'Proper, Improper & Mixed Fractions Conversion',
          'Addition & Subtraction of Like Fractions',
          'Introduction to Decimals (Tenths 0.1 & Hundredths 0.01)',
        ],
        keyTerms: ['Numerator', 'Denominator', 'Equivalent Fraction', 'Proper Fraction', 'Mixed Number', 'Decimal'],
        pageNumber: 108,
      },
      {
        id: 'chap-c4-math-6',
        chapterNumber: 6,
        title: 'Geometry, Symmetry, Perimeter & Area',
        malayalamTitle: 'ജ്യാമിതി, രൂപങ്ങൾ, ചുറ്റളവും വിസ്തീർണ്ണവും',
        summary: 'Point, Line, Line Segment, Ray, Types of Angles (Acute, Right, Obtuse, Straight), Triangles, Quadrilaterals, Circles (Radius, Diameter, Center), Symmetry, and Perimeter & Area of Squares and Rectangles.',
        malayalamSummary: 'വരകൾ, കോണുകൾ, വൃത്തത്തിന്റെ ആരവും വ്യാസവും, ചതുരത്തിന്റെയും സമചതുരത്തിന്റെയും ചുറ്റളവും വിസ്തീർണ്ണവും.',
        topics: [
          'Lines, Rays & Angles (Acute, Right, Obtuse)',
          'Parts of a Circle: Center, Radius, Diameter & Chord (Diameter = 2 × Radius)',
          'Perimeter of Square (4 × side) & Rectangle (2 × (L + B))',
          'Area of Square (side × side) & Symmetry',
        ],
        keyTerms: ['Angle', 'Radius', 'Diameter', 'Perimeter', 'Area', 'Symmetry', 'Polygon'],
        pageNumber: 136,
      },
      {
        id: 'chap-c4-math-7',
        chapterNumber: 7,
        title: 'Measurement, Money, Time & Data Handling',
        malayalamTitle: 'അളവുകൾ, പണം, സമയം, ചിത്രഗ്രാഫുകൾ',
        summary: 'Metric units of Length (km, m, cm), Weight (kg, g), and Capacity (L, mL). Indian Currency (Rupees & Paise), 12-Hour and 24-Hour Clock, Calendar, Pictographs, and Bar Graphs.',
        malayalamSummary: 'നീളം, ഭാരം, ഉള്ളളവ് എന്നിവയുടെ അളവുകൾ, രൂപയും പൈസയും, 24 മണിക്കൂർ ക്ലോക്ക്, ബാർ ഗ്രാഫുകൾ.',
        topics: [
          'Conversions: 1 km = 1000 m, 1 kg = 1000 g, 1 L = 1000 mL',
          'Money Bills, Profit & Loss Basics (₹ and Paise)',
          'Reading Time: AM/PM, 24-Hour Clock & Time Duration',
          'Pictographs & Bar Graphs Interpretation',
        ],
        keyTerms: ['Kilometre', 'Kilogram', 'Litre', '24-Hour Clock', 'Pictograph', 'Bar Graph'],
        pageNumber: 160,
      },
    ],
  },

  // 3. Class 4 — English Language & Literature
  {
    id: 'tb-c4-eng-1',
    childId: 'child-1',
    subjectId: 'sub-c3-english',
    title: 'ICSE New Mulberry English Grammar & Literature: Class 4',
    academicYear: '2026-2027',
    classGrade: 'Class 4',
    fileName: 'ICSE_Class4_English_Full_EBook.pdf',
    fileSize: '4.9 MB',
    pageCount: 152,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-c4-eng-1',
        chapterNumber: 1,
        title: 'Nouns: Common, Proper, Collective & Countable/Uncountable',
        malayalamTitle: 'നാമങ്ങൾ (Nouns): തരങ്ങളും ഉപയോഗവും',
        summary: 'Identifying Common Nouns, Proper Nouns, Collective Nouns (a pride of lions, a fleet of ships, a bouquet of flowers), Abstract Nouns, Countable vs Uncountable Nouns, and Singular/Plural rules.',
        malayalamSummary: 'പൊതുനാമം, ദ്രവ്യനാമം, കൂട്ടനാമം (Collective Nouns), ഏകവചനവും ബഹുവചനവും.',
        topics: [
          'Common, Proper & Abstract Nouns',
          'Collective Nouns (Flock, Herd, Pride, Shoal, Constellation)',
          'Countable & Uncountable Nouns (Much vs Many, A Little vs A Few)',
          'Singular to Plural Rules & Gender Nouns',
        ],
        keyTerms: ['Proper Noun', 'Collective Noun', 'Abstract Noun', 'Countable', 'Plural'],
        pageNumber: 8,
      },
      {
        id: 'chap-c4-eng-2',
        chapterNumber: 2,
        title: 'Pronouns, Adjectives & Degrees of Comparison',
        malayalamTitle: 'സർവ്വനാമങ്ങളും വിശേഷണങ്ങളും (Adjectives)',
        summary: 'Personal, Possessive, and Demonstrative Pronouns. Adjectives of Quality, Quantity, and Number. Degrees of Comparison: Positive (Tall), Comparative (Taller), and Superlative (Tallest).',
        malayalamSummary: 'സർവ്വനാമങ്ങൾ, നാമവിശേഷണങ്ങൾ, താരതമ്യ രൂപങ്ങൾ (Positive, Comparative, Superlative).',
        topics: [
          'Personal & Possessive Pronouns (I, Mine, Yours, Ours, Theirs)',
          'Adjectives of Quality, Quantity & Number',
          'Degrees of Comparison (-er / -est, More / Most, Good-Better-Best)',
          'Use of Articles: A, An, and The',
        ],
        keyTerms: ['Pronoun', 'Adjective', 'Comparative', 'Superlative', 'Article'],
        pageNumber: 32,
      },
      {
        id: 'chap-c4-eng-3',
        chapterNumber: 3,
        title: 'Verbs, Tenses & Subject-Verb Agreement',
        malayalamTitle: 'ക്രിയകളും കാലങ്ങളും (Verbs & Tenses)',
        summary: 'Action Verbs and Helping Verbs (is, am, are, was, were, has, have). Simple Present, Simple Past, Simple Future, and Present/Past Continuous Tenses.',
        malayalamSummary: 'പ്രവർത്തന പദങ്ങൾ (Verbs), വർത്തമാനകാലം, ഭൂതകാലം, ഭാവികാലം എന്നിവയുടെ ഇംഗ്ലീഷ് പ്രയോഗം.',
        topics: [
          'Main Verbs & Auxiliary (Helping) Verbs',
          'Simple Present, Simple Past & Simple Future Tenses',
          'Present Continuous & Past Continuous (-ing forms)',
          'Subject-Verb Agreement Rules',
        ],
        keyTerms: ['Verb', 'Present Tense', 'Past Tense', 'Future Tense', 'Continuous'],
        pageNumber: 58,
      },
      {
        id: 'chap-c4-eng-4',
        chapterNumber: 4,
        title: 'Sentence Structure: Subject, Predicate, Adverbs & Prepositions',
        malayalamTitle: 'വാക്യഘടന: ആഖ്യയും ആഖ്യാതവും, ക്രിയാവിശേഷണങ്ങളും',
        summary: '4 types of sentences (Declarative, Interrogative, Imperative, Exclamatory), Subject and Predicate, Adverbs of Manner/Time/Place, Prepositions, and Conjunctions (and, but, because, although).',
        malayalamSummary: 'വാക്യങ്ങളുടെ തരങ്ങൾ, Subject & Predicate, Adverbs, Prepositions, Conjunctions.',
        topics: [
          'Subject and Predicate in Sentences',
          'Adverbs of Manner (-ly), Time & Place',
          'Prepositions of Position, Time & Movement (in, on, at, between, among)',
          'Conjunctions (Joining Words) & Punctuation Marks',
        ],
        keyTerms: ['Subject', 'Predicate', 'Adverb', 'Preposition', 'Conjunction'],
        pageNumber: 84,
      },
      {
        id: 'chap-c4-eng-5',
        chapterNumber: 5,
        title: 'ICSE Literature Reader: The Story of Dr. Dolittle & Ekalavya',
        malayalamTitle: 'ഇംഗ്ലീഷ് സാഹിത്യ കഥകൾ: ഡോ. ഡൂലിറ്റിലും ഏകലവ്യനും',
        summary: 'Classic ICSE prose stories: How kind Dr. Dolittle learned the language of animals with Polynesia the parrot, and the inspiring story of Ekalavya’s dedication and focus.',
        malayalamSummary: 'മൃഗങ്ങളുടെ ഭാഷ പഠിച്ച ദയയുള്ള ഡോ. ഡൂലിറ്റിലിന്റെ കഥയും ഏകലവ്യന്റെ കഠിനാധ്വാനത്തിന്റെ കഥയും.',
        topics: [
          'The Story of Dr. Dolittle (Kindness to Animals)',
          'The Story of Ekalavya (Dedication & Respect)',
          'Vocabulary: Synonyms, Antonyms & Homophones',
          'Reading Comprehension & Story Writing',
        ],
        keyTerms: ['Compassion', 'Dedication', 'Synonym', 'Antonym', 'Homophone'],
        pageNumber: 112,
      },
      {
        id: 'chap-c4-eng-6',
        chapterNumber: 6,
        title: 'Poetry & Creative Writing: A Night in June & The Moon',
        malayalamTitle: 'കവിതകളും രചനാ വൈഭവവും',
        summary: 'Appreciating nature poetry by William Wordsworth ("A Night in June") and Robert Louis Stevenson ("The Moon"), rhyming schemes, picture composition, and informal letter writing.',
        malayalamSummary: 'പ്രകൃതി കവിതകളുടെ ആസ്വാദനം, കത്തെഴുത്ത്, ചിത്രം നോക്കി കഥയെഴുതൽ.',
        topics: [
          'Poem: A Night in June (William Wordsworth)',
          'Poem: The Moon (R.L. Stevenson) & Rhyming Schemes',
          'Informal Letter Writing & Paragraph Writing',
        ],
        keyTerms: ['Stanza', 'Rhyme', 'Imagery', 'Poet', 'Composition'],
        pageNumber: 134,
      },
    ],
  },

  // 4. Class 4 — Malayalam (കേരള പാഠാവലി)
  {
    id: 'tb-c4-mal-1',
    childId: 'child-1',
    subjectId: 'sub-c3-malayalam',
    title: 'ICSE കേരള മലയാള പാഠാവലി (Malayalam Reader): Class 4',
    academicYear: '2026-2027',
    classGrade: 'Class 4',
    fileName: 'ICSE_Class4_Malayalam_Padavali.pdf',
    fileSize: '4.1 MB',
    pageCount: 112,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-c4-mal-1',
        chapterNumber: 1,
        title: 'കേരളത്തിന്റെ പ്രകൃതിയും കവിതകളും (Nature & Malayalam Poetry)',
        malayalamTitle: 'കേരളത്തിന്റെ പ്രകൃതിയും കവിതകളും',
        summary: 'മലയാളത്തിലെ പ്രശസ്ത പ്രകൃതി കവിതകൾ, കുഞ്ഞുണ്ണി മാഷിന്റെ വരികൾ, വള്ളത്തോൾ, കുമാരനാശാൻ എന്നിവരുടെ കവിതകളിലൂടെ മാതൃഭാഷാ സൗന്ദര്യം.',
        malayalamSummary: 'മലയാളത്തിലെ പ്രശസ്ത പ്രകൃതി കവിതകൾ, കുഞ്ഞുണ്ണി മാഷിന്റെ വരികൾ, മാതൃഭാഷാ സൗന്ദര്യം എന്നിവ പഠിക്കാം.',
        topics: [
          'വായിച്ചാലും വായിച്ചാലും തീരാത്ത പുസ്തകം (കുഞ്ഞുണ്ണി മാഷ്)',
          'മഴവില്ലും പൂക്കളും — പ്രകൃതി വർണ്ണന',
          'പര്യായപദങ്ങളും വിപരീതപദങ്ങളും (Synonyms & Opposites in Malayalam)',
        ],
        keyTerms: ['കവിത', 'പര്യായം', 'വിപരീതം', 'പ്രകൃതി', 'മാതൃഭാഷ'],
        pageNumber: 5,
      },
      {
        id: 'chap-c4-mal-2',
        chapterNumber: 2,
        title: 'മലയാള വ്യാകരണം: നാമം, ക്രിയ, വിശേഷണം, വാക്യരചന',
        malayalamTitle: 'മലയാള വ്യാകരണം: നാമം, ക്രിയ, വിശേഷണം',
        summary: 'മലയാള വ്യാകരണത്തിന്റെ അടിസ്ഥാനം: നാമം (Noun), ക്രിയ (Verb), നാമവിശേഷണം, ക്രിയാവിശേഷണം, ലിംഗം, വചനം, വിഭക്തി പ്രത്യയങ്ങൾ, പഴഞ്ചൊല്ലുകൾ.',
        malayalamSummary: 'നാമം, ക്രിയ, വിശേഷണം, ഏകവചനം-ബഹുവചനം, പഴഞ്ചൊല്ലുകൾ, ശൈലികൾ എന്നിവ ലളിതമായി പഠിക്കാം.',
        topics: [
          'നാമവും ക്രിയയും തിരിച്ചറിയൽ',
          'ഏകവചനവും ബഹുവചനവും, സ്ത്രീലിംഗം - പുല്ലിംഗം',
          'സന്ധിയും സമാസവും (അടിസ്ഥാന പരിചയം)',
          'മലയാള പഴഞ്ചൊല്ലുകളും അർത്ഥവും (Proverbs)',
        ],
        keyTerms: ['നാമം', 'ക്രിയ', 'വിശേഷണം', 'വചനം', 'പഴഞ്ചൊല്ല്'],
        pageNumber: 34,
      },
      {
        id: 'chap-c4-mal-3',
        chapterNumber: 3,
        title: 'കേരള സംസ്കാരവും ഉത്സവങ്ങളും കലാരൂപങ്ങളും',
        malayalamTitle: 'കേരള സംസ്കാരവും ഉത്സവങ്ങളും കലാരൂപങ്ങളും',
        summary: 'ഓണം, വിഷു, തിരുവാതിര, വള്ളംകളി, കഥകളി, ഓട്ടൻതുള്ളൽ, മോഹിനിയാട്ടം, തെയ്യം തുടങ്ങിയ കേരളത്തിന്റെ തനത് കലാരൂപങ്ങളും സാംസ്കാരിക പൈതൃകവും.',
        malayalamSummary: 'കേരളത്തിലെ ഉത്സവങ്ങളും കഥകളി, ഓട്ടൻതുള്ളൽ, മോഹിനിയാട്ടം തുടങ്ങിയ കലാരൂപങ്ങളും.',
        topics: [
          'ഓണവും വള്ളംകളിയും പൂക്കളവും',
          'കേരളീയ കലാരൂപങ്ങൾ: കഥകളി, ഓട്ടൻതുള്ളൽ (കുഞ്ചൻ നമ്പ്യാർ)',
          'കേരളത്തിലെ നദികളും ജില്ലകളും',
        ],
        keyTerms: ['കഥകളി', 'ഓട്ടൻതുള്ളൽ', 'വള്ളംകളി', 'പൈതൃകം', 'സാംസ്കാരികം'],
        pageNumber: 68,
      },
    ],
  },

  // 5. Class 4 — Social Science / Social Studies (Evergreen Publications India Ltd.)
  {
    id: 'tb-c4-soc-1',
    childId: 'child-1',
    subjectId: 'sub-c3-social',
    title: 'Candid ICSE New Trends in Social Studies: Class 4 (Evergreen Publications India Ltd.)',
    academicYear: '2026-2027',
    classGrade: 'Class 4',
    fileName: 'Evergreen_New_Trends_In_Social_Studies_Class4_EBook.pdf',
    fileSize: '7.2 MB',
    pageCount: 156,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-c4-soc-1',
        chapterNumber: 1,
        title: 'The Story of the Past & Evidences in History',
        malayalamTitle: 'ഭൂതകാലത്തിന്റെ കഥയും ചരിത്ര തെളിവുകളും',
        summary: 'What is History and why we study the past. Division of history into Ancient, Medieval, and Modern periods. Archaeological Sources (monuments, coins, inscriptions, artifacts) and Literary Sources (manuscripts, palm leaves, books). Role of Historians and Archaeologists.',
        malayalamSummary: 'ചരിത്രം എന്നാൽ എന്ത്, പ്രാചീന-മധ്യകാല-ആധുനിക യുഗങ്ങൾ, പുരാവസ്തു തെളിവുകൾ (നാണയങ്ങൾ, സ്മാരകങ്ങൾ, ലിഖിതങ്ങൾ), താളിയോല ഗ്രന്ഥങ്ങൾ, ചരിത്രകാരന്മാരും പുരാവസ്തു ഗവേഷകരും.',
        topics: [
          'What is History & Why We Study the Past (Family vs National History)',
          'Three Periods of Indian History: Ancient, Medieval & Modern',
          'Archaeological Sources: Monuments, Coins, Artifacts & Inscriptions',
          'Literary Sources: Palm-leaf Manuscripts, Religious & Secular Literature',
          'The Role of an Archaeologist and a Historian',
        ],
        keyTerms: ['History', 'Archaeologist', 'Historian', 'Manuscripts', 'Inscriptions', 'Monuments', 'Artifacts'],
        pageNumber: 5,
      },
      {
        id: 'chap-c4-soc-2',
        chapterNumber: 2,
        title: 'Almanac, Calendars & Timelines in History',
        malayalamTitle: 'പഞ്ചാംഗം (Almanac), കലണ്ടറുകൾ, ചരിത്ര കാലഗണന (Timelines)',
        summary: 'How time is measured and arranged in history. Understanding an Almanac, Gregorian Calendar vs Saka National Calendar, Leap Years, and sequencing historical events on a Timeline using BCE (BC) and CE (AD).',
        malayalamSummary: 'ചരിത്രത്തിൽ കാലം അളക്കുന്ന രീതി, കലണ്ടറുകൾ (ഗ്രിഗോറിയൻ & ശകവർഷ കലണ്ടർ), പഞ്ചാംഗം (Almanac), ബി.സി.ഇ (BCE), സി.ഇ (CE) എന്നിവ ഉപയോഗിച്ചുള്ള ടൈംലൈൻ.',
        topics: [
          'What is an Almanac & How Calendars Measure Time',
          'Gregorian Calendar vs Saka National Calendar of India',
          'Understanding Leap Year (366 Days every 4 Years)',
          'Chronological Order & Drawing a Timeline: BCE (BC) and CE (AD)',
        ],
        keyTerms: ['Almanac', 'Timeline', 'Chronology', 'Gregorian Calendar', 'Saka Calendar', 'BCE', 'CE'],
        pageNumber: 17,
      },
      {
        id: 'chap-c4-soc-3',
        chapterNumber: 3,
        title: 'Responsibilities of a Good Citizen & Civic Sense',
        malayalamTitle: 'നല്ലൊരു പൗരന്റെ ഉത്തരവാദിത്തങ്ങളും പൗരബോധവും (Civics)',
        summary: 'Understanding Civics and who is a citizen. Responsibilities of a good citizen towards school, neighbors, society, and nation. Caring for public property (parks, buses, trains, historical monuments), obeying traffic and civic laws, and participating in elections.',
        malayalamSummary: 'ആരാണ് പൗരൻ, നല്ലൊരു പൗരന്റെ കടമകൾ, പൊതുമുതൽ സംരക്ഷണം (പാർക്കുകൾ, ബസുകൾ, ചരിത്രസ്മാരകങ്ങൾ), നിയമങ്ങൾ പാലിക്കൽ, തിരഞ്ഞെടുപ്പും ജനാധിപത്യവും.',
        topics: [
          'Who is a Citizen & What is Civic Sense?',
          'Duties of a Good Citizen: Obeying Laws, Helping Others & Paying Taxes',
          'Protecting Public Property vs Private Property (Monuments, Parks, Trains)',
          'Our Government, Voting in Elections & Our National Symbols',
        ],
        keyTerms: ['Citizen', 'Civic Sense', 'Public Property', 'Democracy', 'Election', 'Volunteer'],
        pageNumber: 29,
      },
      {
        id: 'chap-c4-soc-4',
        chapterNumber: 4,
        title: 'The Earth — Movements, Four Domains & Major Landforms',
        malayalamTitle: 'ഭൂമിയുടെ ചലനങ്ങൾ, നാല് മണ്ഡലങ്ങൾ, പ്രധാന ഭൂരൂപങ്ങൾ',
        summary: 'Movements of the Earth: Rotation on its axis (24 hours causing Day and Night) and Revolution around the Sun (365¼ days causing Seasons). The 4 Domains of Earth (Lithosphere, Hydrosphere, Atmosphere, Biosphere) and Major Landforms (Mountains, Plateaus, Plains, Deserts, Valleys).',
        malayalamSummary: 'ഭൂമിയുടെ ഭ്രമണവും (രാവും പകലും) പരിക്രമണവും (ഋതുക്കൾ), കരമണ്ഡലം, ജലമണ്ഡലം, വായുമണ്ഡലം, ജീവമണ്ഡലം, പർവ്വതങ്ങൾ, പീഠഭൂമികൾ, സമതലങ്ങൾ.',
        topics: [
          'Rotation of the Earth (Day & Night) & Revolution of the Earth (Seasons)',
          'Four Domains of the Earth: Lithosphere, Hydrosphere, Atmosphere, Biosphere',
          'Major Landforms: Mountains, Plateaus, Plains, Deserts, Valleys & Islands',
          'Continents (7) and Oceans (5) of the World',
        ],
        keyTerms: ['Rotation', 'Revolution', 'Lithosphere', 'Hydrosphere', 'Atmosphere', 'Biosphere', 'Plateau'],
        pageNumber: 42,
      },
      {
        id: 'chap-c4-soc-5',
        chapterNumber: 5,
        title: 'Globes, Maps & Directions',
        malayalamTitle: 'ഗ്ലോബും ഭൂപടങ്ങളും ദിശകളും (Maps & Directions)',
        summary: 'Difference between a 3D Globe and a flat 2D Map. Types of Maps (Political, Physical, Thematic) and Book of Maps (Atlas). Four Cardinal Directions, Four Intermediate Directions, and Language of a Map (Title, Scale, Legend/Key, Colours, Conventional Symbols).',
        malayalamSummary: 'ഗ്ലോബും ഭൂപടവും തമ്മിലുള്ള വ്യത്യാസം, അറ്റ്ലസ്, നാല് പ്രധാന ദിശകൾ, ഭൂപടത്തിന്റെ ഭാഷ: സ്കെയിൽ, നിറങ്ങൾ, ചിഹ്നങ്ങൾ (Symbols & Legend).',
        topics: [
          'Globe vs Map & What is an Atlas?',
          'Political Maps, Physical Maps & Thematic Maps',
          'Cardinal Directions (North, South, East, West) & Intermediate Directions',
          'Reading a Map: Scale, Colours, Legend (Key) & Conventional Symbols',
        ],
        keyTerms: ['Globe', 'Atlas', 'Political Map', 'Physical Map', 'Cardinal Directions', 'Scale', 'Legend'],
        pageNumber: 55,
      },
      {
        id: 'chap-c4-soc-6',
        chapterNumber: 6,
        title: 'Our Country India — Political & Physical Divisions',
        malayalamTitle: 'നമ്മുടെ ഇന്ത്യ — സംസ്ഥാനങ്ങളും ഭൂപ്രകൃതി വിഭാഗങ്ങളും',
        summary: 'India’s 28 States and 8 Union Territories with Capitals, neighboring countries, and 6 Physical Divisions: The Northern Mountains (Himalayas — Himadri, Himachal, Shiwalik), The Northern Plains, The Great Indian Desert (Thar), The Southern Plateaus (Deccan & Central Highlands), The Coastal Plains, and The Islands.',
        malayalamSummary: 'ഇന്ത്യയിലെ 28 സംസ്ഥാനങ്ങളും 8 കേന്ദ്രഭരണ പ്രദേശങ്ങളും, അയൽരാജ്യങ്ങൾ, ഹിമാലയ പർവ്വതനിരകൾ, ഉത്തരമഹാസമതലം, താർ മരുഭൂമി, ഡെക്കാൻ പീഠഭൂമി, തീരസമതലങ്ങൾ, ദ്വീപുകൾ.',
        topics: [
          'India: 28 States, 8 Union Territories & Neighbouring Countries',
          'The Northern Mountains: Three Ranges of the Himalayas (Himadri, Himachal, Shiwalik)',
          'The Fertile Northern Plains (Indus, Ganga & Brahmaputra Basins) & The Thar Desert',
          'The Peninsular Plateau (Malwa, Chota Nagpur, Deccan), Coastal Plains & Islands',
        ],
        keyTerms: ['Himalayas', 'Himadri', 'Northern Plains', 'Thar Desert', 'Deccan Plateau', 'Archipelago'],
        pageNumber: 68,
      },
      {
        id: 'chap-c4-soc-7',
        chapterNumber: 7,
        title: 'Climate, Seasons & Water Resources of India',
        malayalamTitle: 'ഇന്ത്യയിലെ കാലാവസ്ഥ, ഋതുക്കൾ, ജലവിഭവങ്ങൾ',
        summary: 'Difference between Weather and Climate. Four seasons of India: Summer (Loo winds), Rainy/Monsoon (South-West & North-East Monsoon), Retreating Monsoon, and Winter. Sources of water, Perennial vs Seasonal Rivers, Dams (Multi-purpose Projects), and Rainwater Harvesting.',
        malayalamSummary: 'കാലാവസ്ഥയും ദിനാന്തരീക്ഷസ്ഥിതിയും, വേനൽക്കാലം, മൺസൂൺ മഴക്കാലം, ശൈത്യകാലം, നദികളും അണക്കെട്ടുകളും (Dams), മഴവെള്ള സംഭരണം.',
        topics: [
          'Weather vs Climate & Factors Affecting India’s Climate',
          'Seasons of India: Summer, Monsoon (Rainy Season) & Winter',
          'Himalayan (Snow-fed) Rivers vs Peninsular (Rain-fed) Rivers',
          'Multi-purpose River Valley Projects (Bhakra Nangal, Hirakud, Idukki) & Rainwater Harvesting',
        ],
        keyTerms: ['Weather', 'Climate', 'Monsoon', 'Loo', 'Hydroelectricity', 'Rainwater Harvesting'],
        pageNumber: 84,
      },
      {
        id: 'chap-c4-soc-8',
        chapterNumber: 8,
        title: 'Soils, Forests & Wildlife Wealth of India',
        malayalamTitle: 'ഇന്ത്യയിലെ മണ്ണിനങ്ങൾ, വനങ്ങൾ, വന്യജീവി സമ്പത്ത്',
        summary: 'Six major types of soil in India: Alluvial, Black (Regur/Lava), Red, Laterite, Desert (Sandy), and Mountain soil. Soil erosion and conservation. Five types of Forests (Evergreen, Deciduous/Monsoon, Thorn, Coniferous, Tidal/Mangrove — Sundarbans) and National Parks & Wildlife Sanctuaries.',
        malayalamSummary: 'ഇന്ത്യയിലെ 6 തരം മണ്ണുകൾ (എക്കൽ മണ്ണ്, കറുത്ത മണ്ണ്, ചെങ്കൽ മണ്ണ്), മണ്ണൊലിപ്പ് തടയൽ, നിത്യഹരിത വനങ്ങൾ, കണ്ടൽക്കാടുകൾ (സുന്ദർബൻസ്), വന്യജീവി സങ്കേതങ്ങൾ.',
        topics: [
          'Six Types of Soil: Alluvial, Black (Cotton Soil), Red, Laterite, Desert & Mountain Soil',
          'Soil Erosion & Methods of Soil Conservation (Afforestation, Terrace Farming)',
          'Types of Forests: Evergreen, Deciduous, Coniferous, Thorn & Mangrove (Sundarbans)',
          'Wildlife Conservation: National Parks & Sanctuaries (Periyar, Kaziranga, Gir, Corbett)',
        ],
        keyTerms: ['Alluvial Soil', 'Black Regur Soil', 'Afforestation', 'Deciduous', 'Sundarbans', 'Sanctuary'],
        pageNumber: 98,
      },
      {
        id: 'chap-c4-soc-9',
        chapterNumber: 9,
        title: 'Agriculture, Mineral Wealth & Industries of India',
        malayalamTitle: 'കൃഷിയും ധാതുസമ്പത്തും വ്യവസായങ്ങളും',
        summary: 'Agricultural seasons in India: Kharif crops (Rice, Maize, Cotton, Jute) and Rabi crops (Wheat, Gram, Mustard). Cash crops (Sugarcane, Tea, Coffee, Spices of Kerala). Green Revolution. Metallic Minerals (Iron, Copper, Gold) & Non-Metallic Minerals (Coal, Petroleum). Cottage, Small-Scale, and Large-Scale Industries.',
        malayalamSummary: 'ഖാരിഫ്-റാബി വിളകൾ, ഭക്ഷ്യവിളകളും നാണ്യവിളകളും, ഹരിതവിപ്ലവം, ലോഹ-അലോഹ ധാതുക്കൾ (ഇരുമ്പ്, കൽക്കരി, പെട്രോളിയം), കുടിൽ വ്യവസായങ്ങളും വൻകിട വ്യവസായങ്ങളും.',
        topics: [
          'Kharif Crops vs Rabi Crops, Food Crops (Rice, Wheat) & Cash Crops (Tea, Spices, Cotton)',
          'The Green Revolution & Livestock Rearing (White Revolution)',
          'Metallic Minerals (Iron Ore, Bauxite, Gold) & Fossil Fuels (Coal, Petroleum, Natural Gas)',
          'Cottage Industries, Small-Scale Industries & Large-Scale Industries (Iron & Steel, IT)',
        ],
        keyTerms: ['Kharif', 'Rabi', 'Green Revolution', 'Minerals', 'Fossil Fuels', 'Cottage Industry'],
        pageNumber: 112,
      },
      {
        id: 'chap-c4-soc-10',
        chapterNumber: 10,
        title: 'Means of Transport & Communication',
        malayalamTitle: 'ഗതാഗതവും വാർത്താവിനിമയ സംവിധാനങ്ങളും',
        summary: 'Lifelines of the economy: Roadways (National Highways, State Highways, Expressways), Railways (Passenger, Goods, Metro Trains), Waterways (Inland Waterways & Major Seaports like Kochi, Mumbai), and Airways. Personal Communication (Post, Telephone, Email) and Mass Communication (Newspapers, TV, Radio, Satellites).',
        malayalamSummary: 'റോഡ്, റെയിൽവേ, ജലഗതാഗതം (കൊച്ചി, മുംബൈ തുറമുഖങ്ങൾ), വ്യോമഗതാഗതം, വ്യക്തിഗത വാർത്താവിനിമയവും ബഹുജന മാധ്യമങ്ങളും (പത്രം, ടിവി, ഇന്റർനെറ്റ്, കൃത്രിമോപഗ്രഹങ്ങൾ).',
        topics: [
          'Land Transport: National Highways, Golden Quadrilateral & Indian Railways / Metro',
          'Water Transport (Inland Waterways & Major Ports) and Air Transport',
          'Personal Communication: Postal Service, Speed Post, Mobile Phones & Internet',
          'Mass Communication: Print Media, Electronic Media & Artificial Satellites',
        ],
        keyTerms: ['National Highway', 'Metro Rail', 'Seaport', 'Mass Communication', 'Satellite'],
        pageNumber: 124,
      },
      {
        id: 'chap-c4-soc-11',
        chapterNumber: 11,
        title: 'Our Rich Cultural Heritage & Unity in Diversity',
        malayalamTitle: 'നമ്മുടെ സാംസ്കാരിക പൈതൃകവും നാനാത്വത്തിൽ ഏകത്വവും',
        summary: 'India’s Unity in Diversity: 22 Scheduled Languages, traditional dresses, Classical Dances (Kathakali & Mohiniyattam of Kerala, Bharatanatyam, Kathak, Odissi, Kuchipudi) and Folk Dances (Bhangra, Garba), Classical Music, Famous Monuments (Taj Mahal, Red Fort, Sanchi Stupa, Konark Sun Temple), and National, Religious & Harvest Festivals (Onam, Pongal, Bihu, Baisakhi).',
        malayalamSummary: 'നാനാത്വത്തിൽ ഏകത്വം: ഇന്ത്യയിലെ ഭാഷകൾ, ക്ലാസിക്കൽ നൃത്തങ്ങൾ (കഥകളി, മോഹിനിയാട്ടം, ഭരതനാട്യം), നാടൻ കലകൾ, ചരിത്രസ്മാരകങ്ങൾ, ദേശീയ-വിളവെടുപ്പ് ഉത്സവങ്ങൾ (ഓണം, പൊങ്കൽ, ബിഹു).',
        topics: [
          'Languages, Traditional Dresses & Regional Cuisines of India',
          'Classical Dances (Kathakali, Bharatanatyam, Kathak) & Folk Dances (Bhangra, Garba)',
          'Historical Monuments & Architecture (Taj Mahal, Red Fort, Qutub Minar, Konark, Sanchi)',
          'National Festivals, Religious Festivals & Harvest Festivals (Onam, Pongal, Bihu, Baisakhi)',
        ],
        keyTerms: ['Unity in Diversity', 'Classical Dance', 'Kathakali', 'Heritage', 'Harvest Festival', 'Onam'],
        pageNumber: 136,
      },
      {
        id: 'chap-c4-soc-12',
        chapterNumber: 12,
        title: 'Pollution — Impact on Environment & Waste Management',
        malayalamTitle: 'പരിസ്ഥിതി മലിനീകരണവും മാലിന്യ സംസ്കരണവും (3 Rs)',
        summary: 'Understanding our environment and the 4 types of Pollution: Air Pollution, Water Pollution, Land/Soil Pollution, and Noise Pollution — their causes, effects on health, and prevention. Global Warming, Biodegradable vs Non-Biodegradable Waste, Composting, and the 3 Rs: Reduce, Reuse, and Recycle.',
        malayalamSummary: 'വായു, ജലം, മണ്ണ്, ശബ്ദ മലിനീകരണങ്ങൾ — കാരണങ്ങളും പരിഹാരങ്ങളും, ജൈവ മാലിന്യങ്ങളും അജൈവ മാലിന്യങ്ങളും, പരിസ്ഥിതി സംരക്ഷണത്തിനായുള്ള 3 Rs (Reduce, Reuse, Recycle).',
        topics: [
          'Four Types of Pollution: Air, Water, Soil & Noise Pollution',
          'Global Warming, Green Energy (Solar & Wind) & Tree Plantation',
          'Biodegradable Waste (Green Bin) vs Non-Biodegradable Waste (Blue Bin)',
          'The 3 Rs of Eco-Friendly Living: Reduce, Reuse & Recycle',
        ],
        keyTerms: ['Pollution', 'Biodegradable', 'Non-Biodegradable', 'Reduce', 'Reuse', 'Recycle', 'Compost'],
        pageNumber: 146,
      },
    ],
  },

  // ============================================================================
  // UKG (UPPER KINDERGARTEN) — 4 SUBJECT E-BOOKS
  // ============================================================================

  // 6. UKG — Kindergarten Skills: ENGLISH READER (LEARNWAREi Edutech Pvt. Ltd. — KG2 ENGLISH 2, Foundation Stage 3, NCF-FS)
  {
    id: 'tb-ukg-phonics-1',
    childId: 'child-2',
    subjectId: 'sub-ukg-phonics',
    title: 'Kindergarten Skills: ENGLISH READER — KG2 ENGLISH 2 (LEARNWAREi Edutech Pvt. Ltd., Foundation Stage 3, NCF-FS)',
    academicYear: '2026-2027',
    classGrade: 'UKG',
    fileName: 'LEARNWAREi_UKG_KG2_English_Reader_NCF_FS.pdf',
    fileSize: '4.2 MB',
    pageCount: 76,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-ukg-phonics-1',
        chapterNumber: 1,
        title: 'Alphabet Phonics Sounds (A–Z) & Capital / Small Letters',
        malayalamTitle: 'ഇംഗ്ലീഷ് അക്ഷരമാല (A–Z) വലിയ-ചെറിയ അക്ഷരങ്ങളും ശബ്ദങ്ങളും',
        summary: 'Joyful phonics sounds from A to Z with colorful pictures: A for Apple (/æ/), B for Ball (/b/), C for Cat (/k/), D for Dog (/d/) all the way to Z for Zebra (/z/). Match capital and small letters (A-a, B-b, C-c).',
        malayalamSummary: 'A മുതൽ Z വരെയുള്ള വലിയ അക്ഷരങ്ങളും ചെറിയ അക്ഷരങ്ങളും അവയുടെ ഉച്ചാരണ ശബ്ദങ്ങളും ചിത്രങ്ങളും.',
        topics: [
          'Capital Letters A to Z & Small Letters a to z Matching',
          'Beginning Letter Phonics Sounds (/a/ to /z/)',
          'Alphabet Tracing & Phonics Song',
          'Picture-to-Letter Identification (Apple, Ball, Cat, Drum, Elephant)',
        ],
        keyTerms: ['Apple', 'Ball', 'Cat', 'Dog', 'Elephant', 'Zebra', 'Alphabet'],
        pageNumber: 2,
      },
      {
        id: 'chap-ukg-phonics-2',
        chapterNumber: 2,
        title: 'Short Vowels (a, e, i, o, u) & 3-Letter CVC Words',
        malayalamTitle: '5 സ്വരാക്ഷരങ്ങളും മൂന്നക്ഷര CVC വാക്കുകളും',
        summary: 'Master the 5 short vowels (a, e, i, o, u) and blend sounds to read 3-letter CVC words: cat, bat, mat, pen, hen, ten, pin, tin, bin, pot, dot, hot, sun, bun, tub.',
        malayalamSummary: 'a, e, i, o, u എന്നീ സ്വരങ്ങൾ ചേർത്ത് Cat, Pen, Pin, Pot, Sun തുടങ്ങിയ മൂന്നക്ഷര വാക്കുകൾ വായിക്കാം.',
        topics: [
          'Short "a" Family: cat, bat, hat, mat, rat, fan, pan, van',
          'Short "e" Family: pen, hen, ten, bed, red, net, pet',
          'Short "i" Family: pin, tin, bin, win, pig, wig, sit, kit',
          'Short "o" & "u" Families: pot, hot, cot, dog, log, box, sun, bun, run, cup, tub',
        ],
        keyTerms: ['Vowel', 'CVC Word', 'Cat', 'Pen', 'Pin', 'Pot', 'Sun'],
        pageNumber: 16,
      },
      {
        id: 'chap-ukg-phonics-3',
        chapterNumber: 3,
        title: 'Sight Words & First Reading Sentences',
        malayalamTitle: 'സൈറ്റ് വേർഡുകളും കൊച്ചു വാക്യങ്ങളും',
        summary: 'Learn high-frequency kindergarten sight words: I, see, a, the, is, it, in, on, at, he, she, my, we, like, can. Read sweet first sentences: "I see a cat.", "The cat is on the mat."',
        malayalamSummary: 'I, see, a, the, is, in, on, my, we തുടങ്ങിയ വാക്കുകൾ പഠിച്ച് ലളിതമായ ഇംഗ്ലീഷ് വാക്യങ്ങൾ വായിക്കാം.',
        topics: [
          'Kindergarten Sight Words: I, see, a, the, is, my, like, can, we',
          'Position Sight Words: in, on, under, at, to',
          'Read-Along Sentences: "I see a big red apple.", "The dog is in the tub."',
          'Sight Word Flashcard Recognition',
        ],
        keyTerms: ['I', 'See', 'The', 'Is', 'In', 'On', 'My', 'Like', 'Can'],
        pageNumber: 32,
      },
      {
        id: 'chap-ukg-phonics-4',
        chapterNumber: 4,
        title: 'Rhyming Word Families & Word Ladders',
        malayalamTitle: 'പ്രാസമുള്ള വാക്കുകളും വേർഡ് ലാഡറുകളും',
        summary: 'Playful rhyming word families: -at (cat, bat, hat), -an (fan, man, pan), -en (pen, hen, men), -in (pin, tin, win), -op (hop, mop, pop), -ug (bug, mug, jug). Build fun word ladders!',
        malayalamSummary: 'ഒരേ ശബ്ദത്തിൽ അവസാനിക്കുന്ന പ്രാസമുള്ള വാക്കുകളും വാക്ക് ഗോവണികളും.',
        topics: [
          'Rhyming Families: -at, -an, -ap, -en, -et, -in, -ig, -op, -ot, -ug',
          'Spot the Odd Word Out (cat, bat, sun -> sun is odd)',
          'Building Word Ladders by Changing the First Letter',
        ],
        keyTerms: ['Rhyme', 'Family', 'Cat-Hat', 'Pen-Hen', 'Sun-Bun'],
        pageNumber: 48,
      },
      {
        id: 'chap-ukg-phonics-5',
        chapterNumber: 5,
        title: 'Long Vowel Sounds & The Magic "e" (Silent e)',
        malayalamTitle: 'ദീർഘ സ്വരങ്ങളും മാജിക് "e" നിയമവും',
        summary: 'Discover the superpower of Magic "e"! When silent "e" lands at the end, the vowel says its name: cap becomes cape, pin becomes pine, rob becomes robe, tub becomes tube!',
        malayalamSummary: 'വാക്കിന്റെ അവസാനം "e" വരുമ്പോൾ സ്വരത്തിന്റെ ശബ്ദം മാറുന്നത് പഠിക്കാം (Cap -> Cape, Pin -> Pine, Tub -> Tube).',
        topics: [
          'Magic "e" Rule: a_e (cake, bake, lake, wave)',
          'Magic "e" Rule: i_e (bike, kite, lime, five)',
          'Magic "e" Rule: o_e & u_e (bone, rose, home, tube, cute)',
          'Vowel Digraphs introduction: ee (tree, bee, see), oo (moon, book)',
        ],
        keyTerms: ['Magic e', 'Long Vowel', 'Cake', 'Kite', 'Rose', 'Tube', 'Tree'],
        pageNumber: 60,
      },
      {
        id: 'chap-ukg-phonics-6',
        chapterNumber: 6,
        title: 'Short Stories & Picture Comprehension (Faidan & The Family)',
        malayalamTitle: 'ചിത്രകഥകളും വായനാ മനസ്സിലാക്കലും',
        summary: 'Read delightful kindergarten illustrated stories featuring Faidan, his big brother Eadrick, Papa Manoj, and Mummy Tessy: "A Sunny Day in the Garden", "Faidan’s Red Ball", and "The Clever Little Ant".',
        malayalamSummary: 'ഫൈദാനും ഏദ്രിക്കും പപ്പ മനോജും മമ്മി ടെസ്സിയും ചേർന്നുള്ള കൊച്ചു ചിത്രകഥകൾ വായിക്കുകയും ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുകയും ചെയ്യാം.',
        topics: [
          'Story 1: "Faidan and the Red Ball" (Reading & Picture Clues)',
          'Story 2: "Eadrick and the Garden Tree" (Who, What, Where)',
          'Story 3: "The Clever Ant and the Leaf"',
          'Answering Simple Story Questions (True/False & Circle the Answer)',
        ],
        keyTerms: ['Story', 'Garden', 'Ball', 'Family', 'Reading'],
        pageNumber: 68,
      },
    ],
  },

  // 6b. UKG — Kindergarten Skills: ENGLISH LISTEN & SPEAK (LEARNWAREi Edutech Pvt. Ltd. — KG2 ENGLISH LISTEN & SPEAK 2)
  {
    id: 'tb-ukg-listen-1',
    childId: 'child-2',
    subjectId: 'sub-ukg-english-listen',
    title: 'Kindergarten Skills: ENGLISH LISTEN & SPEAK — KG2 ENGLISH LISTEN & SPEAK 2 (LEARNWAREi Edutech Pvt. Ltd., Foundation Stage 3, NCF-FS)',
    academicYear: '2026-2027',
    classGrade: 'UKG',
    fileName: 'LEARNWAREi_UKG_KG2_English_Listen_And_Speak_NCF_FS.pdf',
    fileSize: '4.0 MB',
    pageCount: 72,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-ukg-listen-1',
        chapterNumber: 1,
        title: 'Greetings, Self Introductions & Golden Magic Words',
        malayalamTitle: 'അഭിവാദനങ്ങൾ, എന്നെ പരിചയപ്പെടുത്തൽ, നല്ല വാക്കുകൾ',
        summary: 'Learn warm greetings: "Good Morning Teacher!", "Good Afternoon!", "How are you? I am fine, thank you!". Introduce yourself: "My name is Faidan Bryan M. I am in UKG Div A." Golden Magic Words: Please, Thank you, Excuse me, and I am Sorry.',
        malayalamSummary: 'ഗുഡ് മോണിംഗ്, ഹലോ, എന്റെ പേര് ഫൈദാൻ, പ്ലീസ്, താങ്ക് യു, സോറി തുടങ്ങിയ നല്ല ഇംഗ്ലീഷ് വാക്കുകൾ പറയാൻ പഠിക്കാം.',
        topics: [
          'Daily Greetings: Good Morning, Good Afternoon, Good Evening & Good Night',
          'Self Introduction: "Hello, my name is Faidan Bryan M. I am 5 years old."',
          'Golden Magic Words: Please, Thank You, Welcome, Excuse Me & Sorry',
          'Greeting Papa Manoj, Mummy Tessy, Brother Eadrick, Teachers & Friends',
        ],
        keyTerms: ['Good Morning', 'Hello', 'Thank You', 'Please', 'Sorry', 'Welcome'],
        pageNumber: 2,
      },
      {
        id: 'chap-ukg-listen-2',
        chapterNumber: 2,
        title: 'Listening to Action Songs, Nursery Rhymes & Phonics Chants',
        malayalamTitle: 'കുട്ടിപ്പാട്ടുകൾ കേൾക്കലും ആംഗ്യപ്പാട്ടുകളും',
        summary: 'Listen carefully, clap to the rhythm, and sing along to favorite kindergarten action rhymes: "The Wheels on the Bus", "Twinkle Twinkle Little Star", "If You\'re Happy and You Know It", and "Baa Baa Black Sheep".',
        malayalamSummary: 'പാട്ടുകൾ ശ്രദ്ധിച്ചു കേൾക്കാനും താളത്തിൽ കൈയ്യടിക്കാനും ഒപ്പം പാടാനും പഠിക്കാം.',
        topics: [
          'Rhyme 1: "The Wheels on the Bus Go Round and Round" (Action & Sounds)',
          'Rhyme 2: "Twinkle, Twinkle, Little Star" (Listening & Pronunciation)',
          'Rhyme 3: "If You\'re Happy and You Know It, Clap Your Hands!"',
          'Rhyme 4: "Two Little Dicky Birds Sitting on a Wall"',
        ],
        keyTerms: ['Rhyme', 'Sing', 'Clap', 'Bus', 'Star', 'Happy'],
        pageNumber: 14,
      },
      {
        id: 'chap-ukg-listen-3',
        chapterNumber: 3,
        title: 'Asking & Answering Questions (What, Where, Who, How Many)',
        malayalamTitle: 'ചോദ്യങ്ങൾ ചോദിക്കാനും ഉത്തരം പറയാനും പഠിക്കാം',
        summary: 'Practice lively speaking dialogues: "What is this? It is an umbrella.", "Where is your book? On my table.", "Who is he? He is my brother Eadrick.", "How many apples do you see? I see five apples."',
        malayalamSummary: 'ഇതെന്താണ്? എവിടെയാണ്? ആരാണ്? എത്രയെണ്ണം ഉണ്ട്? തുടങ്ങിയ ഇംഗ്ലീഷ് ചോദ്യങ്ങൾക്ക് ഉത്തരം പറയാം.',
        topics: [
          'Question Word "What": What is this? / What is your favourite colour?',
          'Question Word "Where": Where is the cat? (In, On, Under)',
          'Question Word "Who": Who is driving the car? Who is your teacher?',
          'Question Word "How Many": Counting objects in full sentences',
        ],
        keyTerms: ['What', 'Where', 'Who', 'How Many', 'Answer', 'Question'],
        pageNumber: 26,
      },
      {
        id: 'chap-ukg-listen-4',
        chapterNumber: 4,
        title: 'Describing Pictures: Colors, Sizes, Emotions & Positions',
        malayalamTitle: 'ചിത്രങ്ങൾ കണ്ട് ഇംഗ്ലീഷിൽ സംസാരിക്കാം',
        summary: 'Look at vibrant illustrations and describe them aloud! Colors (red apple, blue sky, yellow sun), Sizes (big elephant, tiny mouse), Feelings (happy smile, sleepy yawn), and Positions (over the moon, under the tree).',
        malayalamSummary: 'നിറങ്ങൾ, വലിപ്പങ്ങൾ, ഭാവങ്ങൾ എന്നിവ ചിത്രങ്ങൾ കണ്ട് ഇംഗ്ലീഷ് വാക്യങ്ങളിലൂടെ വിവരിക്കാം.',
        topics: [
          'Colour & Size Descriptions: "This is a big green tree."',
          'Feelings & Emotions: Happy 😊, Sad 😢, Surprised 😲, Sleepy 😴',
          'Position & Movement: "The puppy is jumping over the log."',
          'Pair Speaking Activity: Describing a Toy to a Friend',
        ],
        keyTerms: ['Big', 'Small', 'Green', 'Happy', 'Puppy', 'Describe'],
        pageNumber: 40,
      },
      {
        id: 'chap-ukg-listen-5',
        chapterNumber: 5,
        title: 'Daily Conversations at Home, Classroom & Playground',
        malayalamTitle: 'വീട്ടിലും ക്ലാസിലും കളിസ്ഥലത്തുമുള്ള ഇംഗ്ലീഷ് സംഭാഷണങ്ങൾ',
        summary: 'Real-world dialogues: At Home with Papa Manoj ("Papa, can we read a story?"), Mummy Tessy ("Mummy, the food is delicious!"), Brother Eadrick ("Let\'s play catch!"), and In Classroom ("May I drink water, Teacher?").',
        malayalamSummary: 'വീട്ടിൽ അച്ഛനോടും അമ്മയോടും ചേട്ടനോടും സംസാരിക്കാനും സ്കൂളിൽ ടീച്ചറോടും കൂട്ടുകാരോടും സംസാരിക്കാനും പഠിക്കാം.',
        topics: [
          'Home Talk: Asking for water, fruit, bedtime stories & playtime',
          'Classroom Talk: "May I come in?", "May I drink water?", "I have finished!"',
          'Playground Talk: "Let\'s share the swing!", "Your turn, my turn!"',
          'Polite manners and turn-taking in English',
        ],
        keyTerms: ['May I', 'Please', 'Delicious', 'Share', 'Play', 'Teacher'],
        pageNumber: 52,
      },
      {
        id: 'chap-ukg-listen-6',
        chapterNumber: 6,
        title: 'Action Words (Verbs) & Show-and-Tell Presentations',
        malayalamTitle: 'പ്രവൃത്തികൾ (Action Words) & കുട്ടി പ്രസംഗം (Show-and-Tell)',
        summary: 'Act out lively action words: Walk, Run, Jump, Hop, Dance, Sing, Eat, Drink, Sleep, Read, Write! Practice a 3-sentence Show-and-Tell presentation with your favourite toy: "This is my blue car. It goes vroom vroom! I love my car."',
        malayalamSummary: 'Jump, Run, Sing, Dance തുടങ്ങിയ പ്രവൃത്തികൾ ചെയ്യാനും ഇഷ്ടപ്പെട്ട കളിപ്പാട്ടത്തെക്കുറിച്ച് ഇംഗ്ലീഷിൽ സംസാരിക്കാനും പഠിക്കാം.',
        topics: [
          'Action Words (Verbs): Jump, Run, Clap, Fly, Swim, Read, Sleep',
          'Simon Says Game with English Action Verbs',
          'Show-and-Tell Step-by-Step (Holding an object and speaking 3 sentences)',
          'Confidence building and clear speaking voice',
        ],
        keyTerms: ['Jump', 'Run', 'Clap', 'Dance', 'Sing', 'Show and Tell'],
        pageNumber: 64,
      },
    ],
  },

  // 7. UKG — Kindergarten Skills: FUN WITH NUMBERS (LEARNWAREi Edutech Pvt. Ltd. — KG2 MATH, Foundation Stage 3, NCF-FS)
  {
    id: 'tb-ukg-math-1',
    childId: 'child-2',
    subjectId: 'sub-ukg-math',
    title: 'Kindergarten Skills: FUN WITH NUMBERS — KG2 MATH (LEARNWAREi Edutech Pvt. Ltd., Foundation Stage 3, NCF-FS)',
    academicYear: '2026-2027',
    classGrade: 'UKG',
    fileName: 'LEARNWAREi_UKG_KG2_Math_Fun_With_Numbers_NCF_FS.pdf',
    fileSize: '4.6 MB',
    pageCount: 88,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-ukg-math-1',
        chapterNumber: 1,
        title: 'Pre-Math Concepts: Big & Small, Tall & Short, Heavy & Light, In & Out',
        malayalamTitle: 'പ്രീ-മാത്സ് സങ്കല്പങ്ങൾ (വലുതും ചെറുതും, ഭാരമുള്ളതും നേർത്തതും)',
        summary: 'Explore foundational visual math comparisons: Big Elephant vs Small Mouse, Tall Giraffe vs Short Rabbit, Heavy Watermelon vs Light Feather, Inside the basket vs Outside the basket, and More vs Less.',
        malayalamSummary: 'വലുത്-ചെറുത്, നീളമുള്ളത്-കുറിയത്, ഭാരമുള്ളത്-ഭാരം കുറഞ്ഞത്, അകത്തും പുറത്തും, കൂടുതൽ-കുറവ് എന്നീ സങ്കല്പങ്ങൾ.',
        topics: [
          'Big vs Small & Biggest vs Smallest',
          'Tall vs Short & Long vs Short',
          'Heavy vs Light (Comparing weights with see-saw balance)',
          'In vs Out, Top vs Bottom, Far vs Near, More vs Less',
        ],
        keyTerms: ['Big', 'Small', 'Tall', 'Short', 'Heavy', 'Light', 'More', 'Less'],
        pageNumber: 2,
      },
      {
        id: 'chap-ukg-math-2',
        chapterNumber: 2,
        title: 'Numbers 1 to 50 & Number Names (One to Twenty)',
        malayalamTitle: '1 മുതൽ 50 വരെ എണ്ണലും സംഖ്യാ നാമങ്ങളും (One to Twenty)',
        summary: 'Count colorful stars, fruits, and crayons from 1 to 50! Spell number names ONE (1) to TWENTY (20), practice backward counting 20 to 1, and count on a ten-frame grid.',
        malayalamSummary: '1 മുതൽ 50 വരെ വസ്തുക്കൾ എണ്ണാനും 1 മുതൽ 20 വരെയുള്ള സംഖ്യകളുടെ ഇംഗ്ലീഷ് പേരുകൾ എഴുതാനും 20 മുതൽ 1 വരെ പുറകോട്ട് എണ്ണാനും പഠിക്കാം.',
        topics: [
          'Forward Counting 1 to 50 with Pictures & Ten-Frames',
          'Number Names: One (1), Two (2), Three (3)... up to Twenty (20)',
          'Backward Rocket Countdown: 20, 19, 18... 3, 2, 1, Blast off! 🚀',
          'Tens and Ones Introduction (12 = 1 Ten + 2 Ones)',
        ],
        keyTerms: ['One', 'Two', 'Five', 'Ten', 'Fifteen', 'Twenty', 'Fifty', 'Tens', 'Ones'],
        pageNumber: 16,
      },
      {
        id: 'chap-ukg-math-3',
        chapterNumber: 3,
        title: 'What Comes Before, After, Between & Greater/Less Than (> < =)',
        malayalamTitle: 'മുമ്പും ശേഷവും ഇടയിലുമുള്ള സംഖ്യകളും (> < =)',
        summary: 'Number sequencing: What comes just BEFORE 8? (7). What comes AFTER 14? (15). What is BETWEEN 19 and 21? (20). Feed the Hungry Crocodile mouth with Greater Than (>), Less Than (<), and Equal To (=)!',
        malayalamSummary: 'സംഖ്യകൾക്ക് തൊട്ടുമുമ്പും ശേഷവുമുള്ള സംഖ്യകൾ, ഇടയിലുള്ള സംഖ്യ, മുതലക്കുഞ്ഞിന്റെ വായ തുറക്കുന്ന വലിയ സംഖ്യ (> < =).',
        topics: [
          'What Comes Before? (e.g. _ 9 -> 8)',
          'What Comes After? (e.g. 15 _ -> 16)',
          'What Comes In Between? (e.g. 11 _ 13 -> 12)',
          'Comparing Numbers: Greater Than (>), Less Than (<), and Equal (=)',
        ],
        keyTerms: ['Before', 'After', 'Between', 'Greater Than', 'Less Than', 'Equal To'],
        pageNumber: 30,
      },
      {
        id: 'chap-ukg-math-4',
        chapterNumber: 4,
        title: 'Fun with Addition (+) up to 10 & 20 (Like 5 + 2 = 7 on Our Cover!)',
        malayalamTitle: 'ചിത്രങ്ങളിലൂടെ കൂട്ടൽ (+) — കവർ ചിത്രത്തിലെപ്പോലെ 5 + 2 = 7!',
        summary: 'Just like the cover of Faidan’s KG2 Math book where the girl writes "5 + 2 = 7" on the chalkboard! Combine 5 yellow apples and 2 green apples to get 7 juicy apples! Master addition on fingers, number lines, and picture addition up to 10 and 20.',
        malayalamSummary: 'പുസ്തകത്തിന്റെ പുറംചട്ടയിലെപ്പോലെ 5 + 2 = 7 ചിത്രങ്ങൾ ചേർത്തുവെച്ച് കൂട്ടാനും (+) വിരലുകൾ കൊണ്ടും നമ്പർ ലൈൻ കൊണ്ടും കൂട്ടാൻ പഠിക്കാം.',
        topics: [
          'Concept of Addition: Putting Things Together (Part + Part = Whole)',
          'Cover Equation: 5 + 2 = 7 with Apples, Stars & Balls 🍎⭐',
          'Adding on the Number Line (Start at 4, jump forward 3 -> 7)',
          'Adding Zero: 6 + 0 = 6 (Zero adds nothing!)',
          'Number Bonds of 10: 1+9, 2+8, 3+7, 4+6, 5+5',
        ],
        keyTerms: ['Plus', 'Add', 'Sum', 'Total', 'Together', '5 + 2 = 7', 'Number Line'],
        pageNumber: 44,
      },
      {
        id: 'chap-ukg-math-5',
        chapterNumber: 5,
        title: 'Taking Away: Subtraction (-) with Pictures & Cross-Outs up to 10',
        malayalamTitle: 'കുറയ്ക്കൽ (-) ചിത്രങ്ങൾ വെട്ടിമാറ്റി കുറയ്ക്കാം',
        summary: 'Understand Subtraction as Taking Away! If you have 6 balloons and 2 fly away, cross them out: 6 - 2 = 4 balloons left. Practice jumping backward on the number line and subtracting zero.',
        malayalamSummary: '6 ബലൂണുകളിൽ നിന്ന് 2 എണ്ണം പറന്നുപോയാൽ ബാക്കി 4: 6 - 2 = 4. ചിത്രങ്ങൾ വെട്ടിമാറ്റി കുറയ്ക്കാൻ പഠിക്കാം.',
        topics: [
          'Concept of Subtraction: Taking Away & Crossing Out (❌)',
          'Picture Subtraction: 7 Carrots - 3 Carrots eaten = 4 Carrots 🥕',
          'Jumping Backward on the Number Line: 8 - 3 = 5',
          'Subtracting Zero: 5 - 0 = 5 | Subtracting Same Number: 4 - 4 = 0',
        ],
        keyTerms: ['Minus', 'Subtract', 'Take Away', 'Left', 'Difference', 'Cross Out'],
        pageNumber: 58,
      },
      {
        id: 'chap-ukg-math-6',
        chapterNumber: 6,
        title: '2D & 3D Shapes, Colors, Sorting & Repeating Patterns',
        malayalamTitle: 'രൂപങ്ങളും നിറങ്ങളും പാറ്റേണുകളും തരംതിരിക്കലും',
        summary: 'Explore flat 2D shapes: Circle ⭕, Square 🟦, Triangle 🔺, Rectangle ▭, Oval, Star ⭐, and Heart ❤️. Introduction to 3D shapes: Ball (Sphere), Box (Cube), Can (Cylinder). Complete colorful repeating patterns!',
        malayalamSummary: 'വൃത്തം, സമചതുരം, ത്രികോണം, ദീർഘചതുരം, നക്ഷത്രം, സിലിണ്ടർ എന്നീ രൂപങ്ങളും നിറങ്ങളുടെ ആവർത്തന പാറ്റേണുകളും.',
        topics: [
          '2D Flat Shapes: Circle (round), Square (4 sides), Triangle (3 corners), Rectangle',
          '3D Solid Shapes Around Us: Sphere (ball), Cube (dice), Cylinder (water bottle)',
          'Sorting Objects by Shape, Colour and Size',
          'Repeating Patterns: 🔴🟢🔴🟢...? / 🔺🟦🔺🟦...?',
        ],
        keyTerms: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Pattern', 'Sphere'],
        pageNumber: 68,
      },
      {
        id: 'chap-ukg-math-7',
        chapterNumber: 7,
        title: 'Skip Counting by 2s, 5s & 10s up to 50',
        malayalamTitle: '2, 5, 10 വീതം ചാടി എണ്ണാം (Skip Counting)',
        summary: 'Bunny hops and frog jumps! Skip count by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20. Skip count by 5s with your hand fingers: 5, 10, 15, 20, 25, 30. Skip count by 10s: 10, 20, 30, 40, 50!',
        malayalamSummary: 'മുയൽക്കുഞ്ഞ് ചാടുന്നതുപോലെ 2, 4, 6, 8 എന്നും കൈവിരലുകൾ കൊണ്ട് 5, 10, 15, 20 എന്നും 10, 20, 30 എന്നും എണ്ണാൻ പഠിക്കാം.',
        topics: [
          'Skip Counting by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 (Pairs of Shoes)',
          'Skip Counting by 5s: 5, 10, 15, 20, 25, 30 (Five Fingers on a Hand)',
          'Skip Counting by 10s: 10, 20, 30, 40, 50 (Ten-Sticks)',
        ],
        keyTerms: ['Skip Counting', 'Twos', 'Fives', 'Tens', 'Jump', 'Pairs'],
        pageNumber: 76,
      },
      {
        id: 'chap-ukg-math-8',
        chapterNumber: 8,
        title: 'Time & Clock (O’clock), Days of the Week & Indian Coins/Rupees',
        malayalamTitle: 'സമയവും ക്ലോക്കും ആഴ്ചയിലെ ദിവസങ്ങളും ഇന്ത്യൻ നാണയങ്ങളും',
        summary: 'Read analog clock full hours (O’clock): 9 o’clock school time, 1 o’clock lunch time! Sing the 7 Days of the Week song. Meet Indian coins and notes: ₹1, ₹2, ₹5, ₹10, ₹20!',
        malayalamSummary: 'ക്ലോക്കിലെ സമയം (9 O’clock), ആഴ്ചയിലെ 7 ദിവസങ്ങൾ, ₹1, ₹2, ₹5, ₹10, ₹20 നാണയങ്ങളും നോട്ടുകളും.',
        topics: [
          'Clock Face: Short Hand (Hour Hand) & Long Hand (Minute Hand pointing to 12)',
          'Daily Routines & O’clock: 7 o’clock wake up, 9 o’clock school, 8 o’clock bedtime',
          '7 Days of the Week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
          'Indian Coins & Currency: 1 Rupee, 2 Rupees, 5 Rupees, 10 Rupees coin',
        ],
        keyTerms: ['Clock', 'Hour Hand', 'O clock', 'Monday', 'Sunday', 'Rupee', 'Coin'],
        pageNumber: 82,
      },
    ],
  },

  // 8. UKG — Kindergarten Skills: GENERAL AWARENESS (LEARNWAREi Edutech Pvt. Ltd. — KG2 GA, Foundation Stage 3, NCF-FS)
  {
    id: 'tb-ukg-evs-1',
    childId: 'child-2',
    subjectId: 'sub-ukg-general',
    title: 'Kindergarten Skills: GENERAL AWARENESS — KG2 GA (LEARNWAREi Edutech Pvt. Ltd., Foundation Stage 3, NCF-FS)',
    academicYear: '2026-2027',
    classGrade: 'UKG',
    fileName: 'LEARNWAREi_UKG_KG2_GA_General_Awareness_NCF_FS.pdf',
    fileSize: '4.8 MB',
    pageCount: 84,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-ukg-evs-1',
        chapterNumber: 1,
        title: 'All About Me, My Body Parts & 5 Sense Organs',
        malayalamTitle: 'ഞാനും എന്റെ ശരീരഭാഗങ്ങളും 5 പഞ്ചേന്ദ്രിയങ്ങളും',
        summary: 'Learn all about yourself (Name: Faidan Bryan M, Class: UKG Div A), parts of our body, our 5 wonderful Sense Organs (Eyes to see 👀, Ears to hear 👂, Nose to smell 👃, Tongue to taste 👅, Skin to feel 🖐️), and daily good habits!',
        malayalamSummary: 'എന്നെക്കുറിച്ചും ശരീരഭാഗങ്ങളെക്കുറിച്ചും നമ്മുടെ 5 പഞ്ചേന്ദ്രിയങ്ങളെയും (കണ്ണ്, ചെവി, മൂക്ക്, നാക്ക്, ത്വക്ക്) നല്ല ശീലങ്ങളെയും കുറിച്ച് പഠിക്കാം.',
        topics: [
          'All About Me: My Name, My Age, My Class (UKG Div A) & My Favourite Things',
          'External Parts of the Body: Head, Eyes, Ears, Hands, Fingers, Legs & Toes',
          'Our 5 Sense Organs: Eyes (See), Ears (Hear), Nose (Smell), Tongue (Taste), Skin (Feel)',
          'Personal Hygiene & Good Habits: Brushing Twice Daily, Washing Hands & Bathing',
        ],
        keyTerms: ['Eyes', 'Ears', 'Nose', 'Tongue', 'Skin', 'Sense Organs', 'Hygiene'],
        pageNumber: 4,
      },
      {
        id: 'chap-ukg-evs-2',
        chapterNumber: 2,
        title: 'My Family, My Sweet Home & My School',
        malayalamTitle: 'എന്റെ കുടുംബം, എന്റെ വീട്, എന്റെ വിദ്യാലയം',
        summary: 'Understanding small and large families (Father, Mother, Brother, Sister, Grandparents), rooms in a house (Living Room, Bedroom, Kitchen, Bathroom), and places in our school (Classroom, Playground, Library, Principal’s Office).',
        malayalamSummary: 'കുടുംബാംഗങ്ങൾ (അച്ഛൻ, അമ്മ, സഹോദരൻ, മുത്തശ്ശൻ, മുത്തശ്ശി), വീട്ടിലെ മുറികൾ, സ്കൂളിലെ ക്ലാസ് മുറിയും കളിസ്ഥലവും.',
        topics: [
          'My Family Members: Father, Mother, Brother, Sister, Grandfather & Grandmother',
          'Rooms in My Sweet Home: Living Room, Bedroom, Kitchen, Dining Room & Bathroom',
          'My School & Classroom: Teacher, Classmates, Blackboard, Books & Playground',
          'Golden Magic Words: Please, Thank You, Sorry, Excuse Me & Good Morning',
        ],
        keyTerms: ['Family', 'Parents', 'Grandparents', 'Kitchen', 'Bedroom', 'Classroom', 'Playground'],
        pageNumber: 14,
      },
      {
        id: 'chap-ukg-evs-3',
        chapterNumber: 3,
        title: 'Yummy Fruits, Healthy Vegetables & Nutritious Food',
        malayalamTitle: 'പഴങ്ങളും പച്ചക്കറികളും ആരോഗ്യകരമായ ഭക്ഷണവും',
        summary: 'Identify juicy fruits (Apple, Mango, Banana, Orange, Grapes, Papaya, Watermelon), fresh vegetables (Carrot, Tomato, Potato, Peas, Brinjal, Spinach), and learn why healthy home food makes us strong while junk food should be avoided.',
        malayalamSummary: 'മധുരമുള്ള പഴങ്ങൾ, പച്ചക്കറികൾ (ക്യാരറ്റ്, തക്കാളി, ഉരുളക്കിഴങ്ങ്, ചീര), പാൽ, മുട്ട തുടങ്ങിയ ആരോഗ്യകരമായ ഭക്ഷണങ്ങൾ.',
        topics: [
          'One-Seed & Many-Seed Fruits: Mango, Apple, Banana, Papaya, Watermelon & Orange',
          'Root & Leafy Vegetables: Carrot, Potato, Onion, Spinach, Cabbage & Tomato',
          'Raw vs Cooked Vegetables & Washing Fruits Before Eating',
          'Healthy Food (Milk, Eggs, Dal, Fruits, Nuts) vs Junk Food (Burger, Soda, Chips)',
        ],
        keyTerms: ['Fruit', 'Vegetable', 'Mango', 'Carrot', 'Spinach', 'Healthy Food', 'Milk'],
        pageNumber: 24,
      },
      {
        id: 'chap-ukg-evs-4',
        chapterNumber: 4,
        title: 'Green Plants, Trees, Seeds & Beautiful Flowers',
        malayalamTitle: 'സസ്യങ്ങളും മരങ്ങളും വിത്തുകളും മനോഹരമായ പൂക്കളും',
        summary: 'Just like the kids watering plants on the KG2 GA cover! Learn how a tiny seed grows into a green plant with Sunlight, Water, Air, and Soil. Explore parts of a plant (Root, Stem, Leaf, Bud, Flower, Fruit) and fragrant flowers!',
        malayalamSummary: 'മണ്ണും വെള്ളവും സൂര്യപ്രകാശവും വായുവും ചേർന്ന് വിത്ത് മുളച്ച് ചെടിയാകുന്നതും, ചെടിയുടെ ഭാഗങ്ങളും (വേര്, തണ്ട്, ഇല, പൂവ്, കായ്) പൂക്കളും.',
        topics: [
          'How a Plant Grows & Care for Plants: Watering Plants, Sunlight, Air & Soil',
          'Parts of a Plant: Roots, Stem, Green Leaf, Bud, Flower & Fruit',
          'Big Trees (Banyan, Coconut, Mango) vs Small Plants, Shrubs & Climbers',
          'Beautiful Flowers Around Us: Rose, Lotus, Sunflower, Hibiscus, Jasmine & Marigold',
        ],
        keyTerms: ['Root', 'Stem', 'Leaf', 'Flower', 'Seed', 'Sunlight', 'Lotus', 'Sunflower'],
        pageNumber: 36,
      },
      {
        id: 'chap-ukg-evs-5',
        chapterNumber: 5,
        title: 'World of Animals, Birds, Insects, Babies & Homes',
        malayalamTitle: 'മൃഗങ്ങളും പക്ഷികളും പ്രാണികളും അവയുടെ കുഞ്ഞുങ്ങളും വാസസ്ഥലങ്ങളും',
        summary: 'Discover Wild Animals (Lion, Tiger, Elephant, Zebra, Giraffe), Domestic & Farm Animals (Cow, Goat, Horse, Sheep, Hen), Pet Animals (Dog, Cat, Rabbit), Water Animals (Fish, Dolphin, Octopus, Frog), Birds, Insects, Animal Babies, and Homes!',
        malayalamSummary: 'കാട്ടുമൃഗങ്ങൾ, വളർത്തുമൃഗങ്ങൾ, ജലജീവികൾ, പക്ഷികൾ, പൂമ്പാറ്റ, തേനീച്ച, മൃഗങ്ങളുടെ കുഞ്ഞുങ്ങളും വീടുകളും.',
        topics: [
          'Wild Animals in the Jungle vs Domestic, Farm & Pet Animals at Home',
          'Water / Aquatic Animals (Fish, Octopus, Whale) & Amphibians (Frog, Tortoise)',
          'Animal Babies & Homes: Dog→Puppy (Kennel), Cow→Calf (Shed), Lion→Cub (Den), Bird→Nest',
          'Colorful Birds (Peacock, Parrot, Owl, Duck) & Tiny Insects (Butterfly, Honeybee, Ant, Ladybug)',
        ],
        keyTerms: ['Wild Animal', 'Domestic Animal', 'Puppy', 'Calf', 'Cub', 'Kennel', 'Nest', 'Butterfly'],
        pageNumber: 48,
      },
      {
        id: 'chap-ukg-evs-6',
        chapterNumber: 6,
        title: 'Our Community Helpers & Neighbourhood Places',
        malayalamTitle: 'നമ്മെ സഹായിക്കുന്നവരും ചുറ്റുപാടുമുള്ള സ്ഥാപനങ്ങളും',
        summary: 'Meet the wonderful people who help us every day — Teacher, Doctor, Nurse, Policeman, Firefighter, Farmer, Postman, Baker, Carpenter, and Tailor — plus important places in our neighbourhood (Hospital, School, Post Office, Fire Station, Park, Market).',
        malayalamSummary: 'അധ്യാപകർ, ഡോക്ടർ, നഴ്സ്, പോലീസ്, ഫയർഫോഴ്സ്, കർഷകൻ, തപാൽക്കാരൻ തുടങ്ങിയ സഹായികളും ആശുപത്രി, സ്കൂൾ, ചന്ത തുടങ്ങിയ സ്ഥലങ്ങളും.',
        topics: [
          'People Who Help Us: Teacher (School), Doctor & Nurse (Hospital), Farmer (Fields)',
          'Safety & Service Helpers: Policeman, Firefighter, Postman, Soldier & Traffic Police',
          'Skilled Helpers & Their Tools: Carpenter, Tailor, Cobbler, Baker & Barber',
          'Important Neighbourhood Places: Hospital, Police Station, Bank, Market & Park',
        ],
        keyTerms: ['Doctor', 'Teacher', 'Farmer', 'Firefighter', 'Policeman', 'Postman', 'Hospital'],
        pageNumber: 60,
      },
      {
        id: 'chap-ukg-evs-7',
        chapterNumber: 7,
        title: 'Means of Transport, Vehicles & Traffic Safety Rules',
        malayalamTitle: 'ഗതാഗത മാർഗ്ഗങ്ങളും വാഹനങ്ങളും ട്രാഫിക് സുരക്ഷാ നിയമങ്ങളും',
        summary: 'Explore Land Transport (Bicycle, Auto-rickshaw, Car, Bus, Truck, Train, Metro), Water Transport (Boat, Ship, Yacht, Submarine), Air Transport (Aeroplane, Helicopter, Hot Air Balloon), Emergency Vehicles (Ambulance, Fire Engine), and Traffic Lights!',
        malayalamSummary: 'കരയിലൂടെയും വെള്ളത്തിലൂടെയും വായുവിലൂടെയും സഞ്ചരിക്കുന്ന വാഹനങ്ങൾ, ആംബുലൻസ്, ഫയർ എഞ്ചിൻ, ട്രാഫിക് ലൈറ്റ് നിയമങ്ങൾ.',
        topics: [
          'Land Transport: Road Vehicles (Car, Bus, Cycle) & Rail Vehicles (Train, Metro)',
          'Water Transport (Boat, Ship, Steamer) & Air Transport (Aeroplane, Helicopter, Rocket)',
          'Emergency Vehicles with Sirens: Ambulance, Fire Engine & Police Van',
          'Traffic Lights & Road Safety: Red (Stop), Yellow (Wait), Green (Go) & Zebra Crossing',
        ],
        keyTerms: ['Land Transport', 'Aeroplane', 'Ship', 'Train', 'Ambulance', 'Traffic Light', 'Zebra Crossing'],
        pageNumber: 70,
      },
      {
        id: 'chap-ukg-evs-8',
        chapterNumber: 8,
        title: 'Seasons, Sky, Festivals & Our Country India',
        malayalamTitle: 'കാലാവസ്ഥയും ആകാശവും ഉത്സവങ്ങളും നമ്മുടെ ഇന്ത്യയും',
        summary: 'Learn about Sunny Summer, Monsoon Rainy Season (Umbrella, Raincoat, Rainbow), Cold Winter, Day & Night Sky (Sun, Moon, Stars, Clouds), joyful festivals (Onam, Diwali, Eid, Christmas), and India’s National Symbols!',
        malayalamSummary: 'വേനൽക്കാലം, മഴക്കാലം, തണുപ്പുകാലം, സൂര്യനും ചന്ദ്രനും നക്ഷത്രങ്ങളും, ഓണം, ദീപാവലി, പെരുന്നാൾ, ക്രിസ്മസ്, ഇന്ത്യയുടെ ദേശീയ ചിഹ്നങ്ങൾ.',
        topics: [
          'Three Main Seasons & Clothes We Wear: Summer (Cotton), Rainy (Raincoat/Umbrella), Winter (Woollen)',
          'Day Sky vs Night Sky: Bright Sun, Clouds, Rainbow, Moon & Twinkling Stars',
          'Sources of Water (Rain, River, Well) & Saving Every Drop of Water',
          'Festivals We Celebrate & National Symbols of India: Tiranga Flag, Peacock, Tiger, Lotus, Mango',
        ],
        keyTerms: ['Summer', 'Rainy Season', 'Winter', 'Rainbow', 'Tiranga', 'Peacock', 'Lotus', 'Onam'],
        pageNumber: 78,
      },
    ],
  },

  // 9. UKG — ചങ്ങാതി പഠനപ്രവർത്തനങ്ങൾ BOOK-B (Poorna Academia / Poorna Publications, Kozhikode — ISBN 978-81-300-2559-9)
  {
    id: 'tb-ukg-mal-1',
    childId: 'child-2',
    subjectId: 'sub-ukg-malayalam',
    title: 'ചങ്ങാതി — പഠനപ്രവർത്തനങ്ങൾ BOOK-B (Poorna Academia / Poorna Publications, Kozhikode)',
    academicYear: '2026-2027',
    classGrade: 'UKG',
    fileName: 'Poorna_Academia_Changathi_Padanapravarthanangal_Book_B_UKG.pdf',
    fileSize: '4.4 MB',
    pageCount: 68,
    uploadDate: '2026-11-03',
    chapters: [
      {
        id: 'chap-ukg-mal-1',
        chapterNumber: 1,
        title: 'സ്വരാക്ഷരങ്ങൾ — അ മുതൽ അഃ വരെ (Malayalam Vowels & Picture Activities)',
        malayalamTitle: 'സ്വരാക്ഷരങ്ങൾ — അ മുതൽ അഃ വരെ (പഠനപ്രവർത്തനങ്ങൾ)',
        summary: 'Learn Malayalam Vowels (സ്വരാക്ഷരങ്ങൾ) with picture matching and tracing activities from Changathi Book-B: അ - അമ്മ (Mother) / അണ്ണാൻ (Squirrel), ആ - ആന (Elephant) / ആമ (Tortoise), ഇ - ഇല (Leaf), ഈ - ഈച്ച (Fly), ഉ - ഉറുമ്പ് (Ant), ഊ - ഊഞ്ഞാൽ (Swing), ഋ - ഋഷി, എ - എലി (Rat), ഏ - ഏണി (Ladder), ഐ - ഐരാവതം, ഒ - ഒട്ടകം (Camel) / ഒച്ച് (Snail), ഓ - ഓണം / ഓന്ത്, ഔ - ഔഷധം.',
        malayalamSummary: 'ചങ്ങാതി ബുക്ക്-B യിലെ ചിത്രങ്ങളിലൂടെ സ്വരാക്ഷരങ്ങൾ (അ - അമ്മ, ആ - ആന, ഇ - ഇല, ഈ - ഈച്ച, ഉ - ഉറുമ്പ്, ഊ - ഊഞ്ഞാൽ, എ - എലി, ഏ - ഏണി, ഒ - ഒച്ച്/ഒട്ടകം, ഓ - ഓണം) പഠിക്കുകയും എഴുതി ശീലിക്കുകയും ചെയ്യാം.',
        topics: [
          'അ - അമ്മ, അണ്ണാൻ | ആ - ആന, ആമ, ആട്ടിൻകുട്ടി',
          'ഇ - ഇല, ഇഞ്ചി | ഈ - ഈച്ച, ഈന്തപ്പഴം | ഉ - ഉറുമ്പ്, ഉരൽ | ഊ - ഊഞ്ഞാൽ',
          'ഋ - ഋഷി | എ - എലി, എണ്ണ | ഏ - ഏണി, ഏലയ്ക്ക | ഐ - ഐരാവതം',
          'ഒ - ഒച്ച് (Snail), ഒട്ടകം | ഓ - ഓണം, ഓടക്കുഴൽ | ഔ - ഔഷധം | അം - അംബുജം',
        ],
        keyTerms: ['അമ്മ', 'ആന', 'ഇല', 'ഈച്ച', 'ഉറുമ്പ്', 'ഊഞ്ഞാൽ', 'എലി', 'ഏണി', 'ഒച്ച്', 'ഒട്ടകം'],
        pageNumber: 4,
      },
      {
        id: 'chap-ukg-mal-2',
        chapterNumber: 2,
        title: 'വ്യഞ്ജനാക്ഷരങ്ങൾ (ഭാഗം 1): ക മുതൽ ന വരെ (Consonants Part 1 & Words)',
        malayalamTitle: 'വ്യഞ്ജനാക്ഷരങ്ങൾ (ഭാഗം 1): ക മുതൽ ന വരെ',
        summary: 'Explore the first set of Malayalam Consonants (കവർഗ്ഗം, ചവർഗ്ഗം, ടവർഗ്ഗം, തവർഗ്ഗം) with Changathi Book-B activity words: ക - കാക്ക (Crow) / കപ്പൽ (Ship), കിളി (Bird), കുട (Umbrella), പൂച്ച (Cat), ചെടി (Plant), ത - താമര (Lotus) / തത്ത (Parrot) / തുമ്പി (Dragonfly) / തേനീച്ച (Honeybee), ന - നായ (Dog) / നക്ഷത്രം (Star).',
        malayalamSummary: 'ക - കാക്ക, കുട, ച - ചെടി, ത - താമര, തത്ത, തുമ്പി, തേനീച്ച, ന - നായ, നക്ഷത്രം തുടങ്ങിയ വ്യഞ്ജനാക്ഷരങ്ങളും ചിത്രപ്പൊരുത്തവും.',
        topics: [
          'ക - കാക്ക, കപ്പൽ, കണ്ണ്, കുട, കൂൺ (Mushroom)',
          'ച - ചെടി, ചക്രം, ചന്ദ്രൻ | ജ - ജലം, ജനൽ',
          'ത - താമര, തത്ത, തുമ്പി (Dragonfly), തേനീച്ച (Honeybee), തല',
          'ദ - ദീപം | ധ - ധനുസ്സ് | ന - നായ, നക്ഷത്രം, നാരങ്ങ',
        ],
        keyTerms: ['കാക്ക', 'കുട', 'കൂൺ', 'ചെടി', 'താമര', 'തത്ത', 'തുമ്പി', 'തേനീച്ച', 'നായ'],
        pageNumber: 16,
      },
      {
        id: 'chap-ukg-mal-3',
        chapterNumber: 3,
        title: 'വ്യഞ്ജനാക്ഷരങ്ങൾ (ഭാഗം 2): പ മുതൽ റ വരെ & ചില്ലക്ഷരങ്ങൾ',
        malayalamTitle: 'വ്യഞ്ജനാക്ഷരങ്ങൾ (ഭാഗം 2): പ മുതൽ റ വരെ & ചില്ലക്ഷരങ്ങൾ',
        summary: 'Master Malayalam Consonants from പ to റ and Chillaksharangal (ൽ, ൻ, ർ, ൾ, ൺ): പ - പശു (Cow) / പന്ത് (Ball) / പൂമ്പാറ്റ (Butterfly), ഫ - ഫലം, ബ - ബസ്സ്, മ - മരം (Tree) / മയിൽ (Peacock) / മഴ (Rain) / മണ്ണിര (Earthworm), യ - യന്ത്രം, ര - രഥം, ല - ലഡ്ഡു, വ - വണ്ടി (Cart) / വിമാനം, ശ - ശംഖ്, സ - സൂര്യൻ (Sun), ഹ - ഹംസം (Swan), ള - കളി, ഴ - മഴ, റ - തറ.',
        malayalamSummary: 'പ - പശു, പൂമ്പാറ്റ, മ - മരം, മയിൽ, മഴ, മണ്ണിര, വ - വണ്ടി, സ - സൂര്യൻ, ഹ - ഹംസം എന്നിവയും ചില്ലക്ഷരങ്ങളും (ൺ, ൻ, ർ, ൽ, ൾ).',
        topics: [
          'പ - പശു, പന്ത്, പൂച്ച, പൂമ്പാറ്റ (Butterfly) | ബ - ബസ്സ്',
          'മ - മരം, മയിൽ, മഴ, മീൻ, മണ്ണിര (Earthworm)',
          'യ - യന്ത്രം | ര - രഥം | ല - ലഡ്ഡു | വ - വണ്ടി, വീട്, വിമാനം',
          'ശ - ശംഖ് | സ - സൂര്യൻ | ഹ - ഹംസം | ഴ - മഴ, പഴം | ചില്ലക്ഷരങ്ങൾ: ൺ, ൻ, ർ, ൽ, ൾ',
        ],
        keyTerms: ['പശു', 'പൂമ്പാറ്റ', 'മരം', 'മയിൽ', 'മഴ', 'മണ്ണിര', 'വണ്ടി', 'സൂര്യൻ', 'ഹംസം'],
        pageNumber: 28,
      },
      {
        id: 'chap-ukg-mal-4',
        chapterNumber: 4,
        title: 'സ്വരചിഹ്നങ്ങളും കൊച്ചു വാക്കുകളും (Vowel Signs: ാ, ി, ീ, ു, ൂ, െ, േ, ൊ, ോ)',
        malayalamTitle: 'സ്വരചിഹ്നങ്ങളും രണ്ടക്ഷര-മൂന്നക്ഷര വാക്കുകളും',
        summary: 'Learn how Malayalam vowel signs (സ്വരചിഹ്നങ്ങൾ: കാ, കി, കീ, കു, കൂ, കെ, കേ, കൈ, കൊ, കോ, കൗ) join with consonants to make simple 2-letter and 3-letter words like കാട് (Forest), പാൽ (Milk), കിളി (Bird), മീൻ (Fish), കുട (Umbrella), പൂവ് (Flower), ചെടി (Plant), തേൻ (Honey), and കോഴി (Hen).',
        malayalamSummary: 'ാ, ി, ീ, ു, ൂ, െ, േ, ൊ, ോ തുടങ്ങിയ സ്വരചിഹ്നങ്ങൾ ചേർത്ത് കാട്, കിളി, മീൻ, കുട, പൂവ്, ചെടി, തേൻ, കോഴി തുടങ്ങിയ കൊച്ചു വാക്കുകൾ വായിക്കാനും എഴുതാനും പഠിക്കാം.',
        topics: [
          'ദീർഘം (ാ): ക + ാ = കാ (കാട്, നാട്, പാൽ, മാവ്)',
          'വള്ളി (ി, ീ): ക + ി = കി (കിളി, മിഴി) | മ + ീ = മീ (മീൻ, വീട്)',
          'കുനിപ്പ് (ു, ൂ): ക + ു = കു (കുട, പുലി) | പ + ൂ = പൂ (പൂവ്, കൂൺ)',
          'പുള്ളി (െ, േ, ൊ, ോ): ചെടി, തേൻ, തേനീച്ച, കൊക്ക്, കോഴി, തോണി',
        ],
        keyTerms: ['കാട്', 'കിളി', 'മീൻ', 'കുട', 'പൂവ്', 'ചെടി', 'തേൻ', 'കോഴി', 'തോണി'],
        pageNumber: 40,
      },
      {
        id: 'chap-ukg-mal-5',
        chapterNumber: 5,
        title: 'ചങ്ങാതിയും പ്രകൃതിയിലെ കൂട്ടുകാരും (Nature Friends on Our Cover!)',
        malayalamTitle: 'ചങ്ങാതിയും പ്രകൃതിയിലെ കൂട്ടുകാരും (പൂന്തോട്ടവും ജീവികളും)',
        summary: 'Meet the cute garden friends from the cover of Faidan Bryan’s Changathi Book-B! തുമ്പി (Dragonfly), തേനീച്ച (Honeybee), ഒച്ച് (Snail), ഉറുമ്പ് (Ant), മണ്ണിര (Earthworm), പൂമ്പാറ്റ (Butterfly), കൂൺ (Mushroom house), plus Malayalam names of Birds (തത്ത, മയിൽ, കാക്ക, കുയിൽ) and Animals (ആന, പശു, പൂച്ച, നായ, മുയൽ, അണ്ണാൻ).',
        malayalamSummary: 'ചങ്ങാതി പുസ്തകത്തിന്റെ പുറംചട്ടയിലെ കൂട്ടുകാരായ തുമ്പി, തേനീച്ച, ഒച്ച്, ഉറുമ്പ്, മണ്ണിര, പൂമ്പാറ്റ, കൂൺ എന്നിവയെയും പക്ഷിമൃഗാദികളെയും പരിചയപ്പെടാം.',
        topics: [
          'ചങ്ങാതിയുടെ പൂന്തോട്ടത്തിലെ കൂട്ടുകാർ: തുമ്പി (Dragonfly), തേനീച്ച (Honeybee) & പൂമ്പാറ്റ (Butterfly)',
          'മണ്ണിലെ കൊച്ചു കൂട്ടുകാർ: ഒച്ച് (Snail), ഉറുമ്പ് (Ant), മണ്ണിര (Earthworm) & കൂൺ (Mushroom)',
          'പക്ഷികൾ (Birds): മയിൽ (Peacock), തത്ത (Parrot), കാക്ക (Crow), കുയിൽ (Cuckoo), കൊക്ക് (Crane)',
          'മൃഗങ്ങൾ (Animals): ആന (Elephant), പശു (Cow), പൂച്ച (Cat), നായ (Dog), മുയൽ (Rabbit), അണ്ണാൻ (Squirrel)',
        ],
        keyTerms: ['തുമ്പി', 'തേനീച്ച', 'ഒച്ച്', 'ഉറുമ്പ്', 'മണ്ണിര', 'പൂമ്പാറ്റ', 'കൂൺ', 'അണ്ണാൻ', 'മുയൽ'],
        pageNumber: 50,
      },
      {
        id: 'chap-ukg-mal-6',
        chapterNumber: 6,
        title: 'നിറങ്ങളും സംഖ്യകളും പഴങ്ങളും പച്ചക്കറികളും (Colors, Numbers & Fruits in Malayalam)',
        malayalamTitle: 'നിറങ്ങളും സംഖ്യകളും (1–10) പഴങ്ങളും പച്ചക്കറികളും',
        summary: 'Workbook activities from Changathi Book-B on Colors in Malayalam (ചുവപ്പ് Red, നീല Blue, പച്ച Green, മഞ്ഞ Yellow, വെള്ള White, കറുപ്പ് Black), Counting 1 to 10 in Malayalam (ഒന്ന് മുതൽ പത്ത് വരെ), and Malayalam names of Fruits & Vegetables (മാമ്പഴം, വാഴപ്പഴം, ചക്ക, ആപ്പിൾ, തക്കാളി, ക്യാരറ്റ്, വെണ്ടയ്ക്ക).',
        malayalamSummary: 'നിറങ്ങളുടെ മലയാളം പേരുകൾ, ഒന്ന് മുതൽ പത്ത് വരെ മലയാളത്തിൽ എണ്ണൽ, പഴങ്ങളുടെയും പച്ചക്കറികളുടെയും മലയാളം പേരുകൾ.',
        topics: [
          'നിറങ്ങൾ (Colors): ചുവപ്പ് (Red), പച്ച (Green), മഞ്ഞ (Yellow), നീല (Blue), വെള്ള (White), കറുപ്പ് (Black)',
          'സംഖ്യകൾ (Numbers 1–10): ഒന്ന് (1), രണ്ട് (2), മൂന്ന് (3), നാല് (4), അഞ്ച് (5), ആറ് (6), ഏഴ് (7), എട്ട് (8), ഒമ്പത് (9), പത്ത് (10)',
          'പഴങ്ങൾ (Fruits): മാമ്പഴം (Mango), വാഴപ്പഴം (Banana), ചക്ക (Jackfruit), പപ്പായ (Papaya), മുന്തിരി (Grapes)',
          'പച്ചക്കറികൾ (Vegetables): തക്കാളി (Tomato), ഉരുളക്കിഴങ്ങ് (Potato), വെണ്ടയ്ക്ക (Ladyfinger), മത്തൻ (Pumpkin), പാവയ്ക്ക',
        ],
        keyTerms: ['ചുവപ്പ്', 'പച്ച', 'മഞ്ഞ', 'ഒന്ന്', 'പത്ത്', 'മാമ്പഴം', 'വാഴപ്പഴം', 'ചക്ക', 'തക്കാളി'],
        pageNumber: 58,
      },
      {
        id: 'chap-ukg-mal-7',
        chapterNumber: 7,
        title: 'മലയാളം കുട്ടിപ്പാട്ടുകളും പഠനപ്രവർത്തനങ്ങളും (Action Rhymes & Workbook Activities)',
        malayalamTitle: 'കുട്ടിപ്പാട്ടുകളും ചിത്രം വരയ്ക്കലും പഠനപ്രവർത്തനങ്ങളും',
        summary: 'Sing along to classic Malayalam kindergarten action rhymes and complete Changathi Book-B matching, dot-joining, coloring, and good-habit activities: തത്തമ്മേ പൂച്ച പൂച്ച, അണ്ണാറക്കണ്ണാ വാ, ഉറുമ്പേ ഉറുമ്പേ, മഴേ മഴേ വാ വാ, and polite Malayalam greetings!',
        malayalamSummary: 'തത്തമ്മേ പൂച്ച പൂച്ച, അണ്ണാറക്കണ്ണാ വാ, മഴേ മഴേ വാ വാ തുടങ്ങിയ കുട്ടിപ്പാട്ടുകളും വരയ്ക്കലും നിറം കൊടുക്കലും നല്ല ശീലങ്ങളും.',
        topics: [
          'കുട്ടിപ്പാട്ടുകൾ (Rhymes): തത്തമ്മേ പൂച്ച പൂച്ച & അണ്ണാറക്കണ്ണാ വാ പൂവാലാ',
          'പ്രകൃതിപ്പാട്ടുകൾ: മഴേ മഴേ വാ വാ & പൂമ്പാറ്റേ പൂമ്പാറ്റേ',
          'പഠനപ്രവർത്തനങ്ങൾ (Activities): അക്ഷരം ചേർക്കാം, ചിത്രം കണ്ട് പേരെഴുതാം, നിറം നൽകാം',
          'നല്ല ശീലങ്ങളും കുടുംബബന്ധങ്ങളും: അച്ഛൻ, അമ്മ, ചേട്ടൻ, ചേച്ചി, നന്ദി, നമസ്കാരം',
        ],
        keyTerms: ['തത്തമ്മ', 'അണ്ണാറക്കണ്ണൻ', 'പൂമ്പാറ്റ', 'മഴ', 'അച്ഛൻ', 'അമ്മ', 'നമസ്കാരം'],
        pageNumber: 64,
      },
    ],
  },
];

