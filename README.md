# Little Genius AI 🦉
> **Learn, Play, Explore, Grow** — Personalized AI Learning Application for Kids (Class 3 & UKG)

A modern, full-stack, 3D-powered educational application built for children aged 5 and 9 following the **Kerala State & ICSE curriculum**. Grounded in actual school textbooks uploaded by parents, with retrieval-augmented generation (RAG), voice interaction, interactive 3D learning worlds, educational games, magic flashcards, and an analytics-driven parent dashboard.

---

## 🌟 Key Capabilities & Features

### 1. Dual Independent Child Profiles
- **Profile A (Aarav, 9 yrs old, Class 3)**: Primary school level with interactive scientific explanations, real-life examples, 3D Solar System exploration, math blitz challenges, grammar, and story quests.
- **Profile B (Diya, 5 yrs old, UKG)**: Kindergarten level with phonics sounds, apple counting, letter/number tracing, picture identification, and gentle positive audio reinforcement.
- **Total Content Separation**: Independent textbooks, syllabi, quiz history, stars, and progress.

### 2. Dual Language Support (English & Malayalam)
- Toggle between **English** and **മലയാളം** at any moment across the entire app.
- Bilingual text-to-speech (TTS) audio narration for lessons, planet facts, and flashcards.

### 3. Dedicated Parent Textbook & Syllabus Upload System
- Upload actual school textbook PDFs, ebooks, worksheets, or notes.
- Automatic text extraction (`pdf-parse`) and semantic chapter structuring.
- Searchable RAG (Retrieval-Augmented Generation) knowledge base ensuring AI teaches from the school textbook and never invents page numbers or facts.
- Parent review & chapter editor before publishing to children.
- Configurable curriculum boards: **ICIC / ICSE / Kerala State / CBSE**.

### 4. Interactive 3D Learning Worlds (Three.js WebGL)
- **3D Science World**: Rotatable, zoomable 3D Solar System with the Sun and 8 planets. Click any planet to pause its orbit and hear bilingual scientific facts.
- **3D Mathematics World**: Interactive 3D blocks and apples where kids tap and drag objects into baskets to solve addition problems and count out loud.
- **3D Phonics & Alphabet World**: Floating 3D letter podiums that bounce, play phonics sounds, and show corresponding real-world objects.
- **3D Virtual Classroom**: Classroom scene with interactive blackboard, floating books, and animated teacher mascot owl Hootie.
- **2D Lightweight Canvas Fallback**: Toggleable at any time for battery saving and low-end hardware.

### 5. Interactive Educational Games
- **Letter & Number Tracing**: Touch/mouse-guided canvas tracing with stroke tracking and star rewards for UKG.
- **Speed Math Blitz**: 30-second rapid multiplication & mental math challenge for Class 3.
- **Memory Card Flip Quest**: Curriculum emoji card matching game with score tracking.
- **Apple Counting Game**: Interactive fruit counting with Web Audio chimes.

### 6. AI Teacher Mascot — Hootie 🦉
- Multi-mode teaching:
  1. *Explain My Lesson*
  2. *Teach Me Like a Story*
  3. *Show Me With Pictures*
  4. *Play a Learning Game*
  5. *Homework Hints* (encouraging explanations, hints, and practice questions — never giving answers away directly)
- Built-in Voice interaction: Web Speech API for voice dictation and high-pitched cheerful teacher narration.
- Child-Safe Guardrails: Polite redirection of non-academic queries; no personal data collection.

### 7. Spaced Repetition Flashcards & AI Quiz Arena
- 3D Flip cards with audio pronunciation, key terms, and "I Know This" mastery tracking.
- Interactive chapter quizzes with multiple choice, true/false, picture identification, hints, instant constructive feedback, stars, and celebratory confetti.

### 8. Protected Parent Zone (PIN-Secured)
- PIN barrier (default `1234`) prevents children from altering settings.
- Analytics charts: learning time, quiz scores, accuracy percentage, topics mastered, and concepts requiring revision.
- Screen time control: Daily study limit (30m, 45m, 60m, 90m).
- AI Provider configuration: Choose between **Smart Built-in Engine**, **Google Gemini**, **OpenAI**, or **Anthropic**.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server-side API routes)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js WebGL Canvas + 2D HTML5 Canvas Fallback
- **Audio & Speech**: Web Audio API (synthetic chimes & star sound effects) + Web Speech API (TTS & STT)
- **Document Processing**: `pdf-parse` for textbook PDF extraction and chapter chunking
- **Database**: Persistent file-backed JSON store with typed relational schema (`src/lib/db/store.ts`)
- **Animation & Effects**: `canvas-confetti`, Tailwind 3D button press and card hover effects

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v24.16.0)
- npm or pnpm

### Installation
1. Clone or navigate into the project directory:
   ```bash
   cd "c:\xampp\htdocs\Little Genius AI"
   ```

2. Dependencies are already installed. If running on a new machine:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🔑 AI API Configuration (Optional)

Little Genius AI includes a **Smart Built-in Pedagogical Engine** that works immediately without any external API keys or network calls.

If you wish to enable Google Gemini or OpenAI for generative conversational tutoring:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Set your API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   OPENAI_API_KEY=your_actual_openai_key_here
   ```
3. Alternatively, you can configure the API key directly within the **Parent Settings** page in the application. All keys are stored securely on the server and never exposed to the frontend.

---

## 📁 Project Directory Structure

```
Little Genius AI/
├── data/
│   └── database.json          # Persistent database store
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with AppProvider & Navbar
│   │   ├── page.tsx           # Landing page with child selection & feature tour
│   │   ├── globals.css        # Tailwind styles & 3D card/button effects
│   │   ├── api/
│   │   │   ├── chat/          # AI Teacher conversation API with RAG grounding
│   │   │   ├── upload/        # PDF upload & semantic chapter extractor
│   │   │   ├── lesson/        # AI lesson generator
│   │   │   ├── quiz/          # AI quiz generator
│   │   │   ├── flashcards/    # AI flashcards generator
│   │   │   └── data/          # Profiles, subjects, textbooks, progress, settings
│   │   ├── child/
│   │   │   ├── dashboard/     # Student home dashboard (UKG / Class 3 modes)
│   │   │   ├── subjects/      # Subject browser with textbook links
│   │   │   ├── chapters/      # Chapter list and lesson shortcuts
│   │   │   ├── lesson/        # Multi-mode lesson viewer with audio narration
│   │   │   ├── ai-teacher/    # Conversational chat with Hootie the Owl
│   │   │   ├── world3d/       # 3D Learning Worlds (Solar System, Math, A-Z, Classroom)
│   │   │   ├── flashcards/    # Spaced repetition flashcards with flip animation
│   │   │   ├── games/         # Educational games (Tracing, Math Blitz, Memory)
│   │   │   ├── quiz/          # Interactive quiz runner with immediate feedback
│   │   │   ├── story/         # Curriculum illustrated audio stories
│   │   │   └── progress/      # Badges, stars, streak, and achievements
│   │   └── parent/
│   │       ├── login/         # Security PIN gate (default: 1234)
│   │       ├── dashboard/     # Analytics, study time, accuracy, revision needs
│   │       ├── upload/        # Textbook & syllabus uploader
│   │       ├── library/       # Textbook library with chapter viewer & RAG search
│   │       ├── syllabus/      # Syllabus & subject configuration (ICIC/ICSE/State)
│   │       └── settings/      # AI provider selection, PIN, screen time limits
│   ├── components/
│   │   ├── 3d/                # Three.js 3D Worlds & 2D fallback
│   │   ├── games/             # Canvas tracing, speed math blitz, memory flip
│   │   └── ui/                # Navbar, Mascot Owl, Voice TTS & STT, PIN Modal
│   └── lib/
│       ├── ai/                # Gemini client, RAG retriever, pedagogical engine
│       ├── audio/             # Web Audio sound effects & Web Speech API
│       ├── db/                # Store, relational types, and rich seed data
│       ├── i18n/              # English & Malayalam translation dictionaries
│       └── pdf/               # PDF text extraction & chapter parsing engine
```

---

## 🔒 Child Safety & Privacy Guarantees

- **No Public Profiles & No Social Features**: Complete privacy for both children.
- **Zero Ads & Zero In-App Purchases**: Pure educational focus without distractions.
- **PIN Protected Settings**: Children cannot access parent settings or upload tools.
- **Strict Content Filtering**: Safe AI responses that gently redirect non-academic or inappropriate questions.

#   L e i t t l e - G e n i u s - A I  
 