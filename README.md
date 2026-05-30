<div align="center">

# ✨ AffirmAI

**Personalized affirmations, motivation, and mindset growth.**

*An AI-powered wellness platform that delivers daily affirmations tailored to your goals, tracks your mindset journey, and generates personalized affirmations using advanced language models.*

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Live Demo](#) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [Architecture](#-architecture)

</div>

---

## 🎯 Overview

AffirmAI is a production-ready, mobile-first web application designed to help users build positive mindset habits through personalized daily affirmations. Unlike generic affirmation apps, AffirmAI uses AI to generate affirmations tailored to your specific situation, tracks your engagement streaks, and adapts to your personal goals and mood preferences.

**Built for the 8x Engineer Challenge** — showcasing modern full-stack architecture, premium UI design, and AI integration.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Email/password auth with Supabase, auto-profile creation, session management via cookies |
| **🎯 Personalized Onboarding** | 2-step animated flow — select focus areas (7 categories) and mood preferences (8 options) |
| **📱 Daily Affirmation Feed** | Swipeable card carousel with category-based gradient designs, drag gestures, and share support |
| **🤖 AI Generator** | Enter your feelings → receive 3 personalized "I am" affirmations powered by Llama 3.3 70B via Groq |
| **❤️ Favorites** | Save, search, and filter your favorite affirmations with optimistic UI updates |
| **🔥 Streak Tracking** | Daily visit tracking, current/longest streak stats, and 7-day activity heatmap |
| **📊 Insights Dashboard** | Visual streak statistics with motivational messages based on progress |
| **👤 Profile** | View stats, manage goals, and account settings |
| **🌙 Dark Mode First** | Premium dark theme with glassmorphism, gradient animations, and micro-interactions |
| **📲 PWA Ready** | Web app manifest for "Add to Home Screen" with standalone display mode |

---

## 📸 Screenshots

<div align="center">

### Authentication
| Login | Sign Up |
|:---:|:---:|
| ![Login](docs/screenshots/01-login-screen.png) | ![Sign Up](docs/screenshots/02-signup-screen.png) |

### Onboarding
| Goal Selection | Mood Selection |
|:---:|:---:|
| ![Goals](docs/screenshots/03-goal-selection.png) | ![Moods](docs/screenshots/04-mood-selection.png) |

### Home Feed
| Career Growth | Confidence | Fitness |
|:---:|:---:|:---:|
| ![Career](docs/screenshots/05-home-career-growth.png) | ![Confidence](docs/screenshots/06-home-confidence.png) | ![Fitness](docs/screenshots/07-home-fitness.png) |

### AI Generator
| Input | Generated Results |
|:---:|:---:|
| ![Generator](docs/screenshots/08-ai-generator-empty.png) | ![Results](docs/screenshots/09-ai-generated-results.png) |

### Favorites
| Empty State | Saved Affirmations |
|:---:|:---:|
| ![Empty](docs/screenshots/10-favorites-empty-state.png) | ![Filled](docs/screenshots/11-favorites-filled.png) |

### Insights & Profile
| Insights | Profile |
|:---:|:---:|
| ![Insights](docs/screenshots/12-insights-dashboard.png) | ![Profile](docs/screenshots/13-profile-dashboard.png) |

</div>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)               │
├──────────────┬──────────────┬───────────────────────────┤
│  Server      │  Client      │  API Routes               │
│  Components  │  Components  │                           │
│              │              │  /api/gemini (AI proxy)    │
│  - Home      │  - Feed      │  /auth/callback            │
│  - Favorites │  - Generator │                           │
│  - Insights  │  - NavBar    │                           │
│  - Profile   │  - Cards     │                           │
├──────────────┴──────────────┴───────────────────────────┤
│              Server Actions (src/actions/)               │
│  auth · affirmations · favorites · streaks · profile     │
├─────────────────────────────────────────────────────────┤
│              Middleware (Auth Guard + Session Refresh)    │
├──────────────────────────┬──────────────────────────────┤
│     Supabase (PostgreSQL) │      Groq API (Llama 3.3)   │
│  - Auth (email/password)  │  - Affirmation generation   │
│  - Profiles + RLS         │  - Context-aware prompts    │
│  - Affirmations (70 seed) │  - Server-side only         │
│  - Favorites + Streaks    │                              │
└──────────────────────────┴──────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **Animation** | Framer Motion |
| **Auth & Database** | Supabase (PostgreSQL + Auth + RLS) |
| **AI** | Groq API (Llama 3.3 70B Versatile) |
| **UI Components** | Lucide React, Sonner (toasts) |
| **Fonts** | Inter + Playfair Display (Google Fonts) |

### Key Architectural Decisions

- **Server Components by default** — Data fetching happens server-side with zero client JS overhead
- **Server Actions for mutations** — Type-safe, colocated data operations without separate API routes
- **Cookie-based auth** — Supabase SSR pattern for seamless server/client session sharing
- **AI key isolation** — API key never reaches the client; proxied through server-side route handler
- **Feature-based folder structure** — Components colocated by feature domain, not by type

---

## 🤖 AI Features

AffirmAI integrates AI-powered affirmation generation:

1. **User enters their current feelings** — "I'm stressed about placements and interviews"
2. **Context-enriched prompt** — The system includes user's selected goals and mood preferences
3. **AI generates 3 personalized affirmations** — Each starts with "I am" and is tailored to the specific input
4. **Save to favorites** — Generated affirmations can be saved alongside curated ones

**Model:** Llama 3.3 70B Versatile via Groq (OpenAI-compatible API)

**Security:** API key is stored server-side in environment variables and proxied through `/api/gemini` route handler. The key never reaches the browser.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Supabase** account ([sign up](https://supabase.com/))
- **Groq** API key ([get one](https://console.groq.com/keys))

### 1. Clone the Repository

```bash
git clone https://github.com/Pragy2009/AffirmAI-8x.git
cd AffirmAI-8x/affirm-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
```

### 4. Set Up the Database

Go to your **Supabase Dashboard → SQL Editor** and run the migration:

```bash
# The migration file is at:
supabase/migrations/001_affirmai_schema.sql
```

This creates all tables, indexes, RLS policies, triggers, and seeds 70 affirmations.

### 5. Configure Supabase Auth

In **Supabase Dashboard → Authentication → Providers → Email**:
- Disable "Confirm email" for development (optional)

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```
affirm-ai/
├── docs/                          # Documentation
│   ├── screenshots/               # App screenshots
│   └── ai-development-log.md     # AI usage documentation
├── public/                        # Static assets
│   └── icons/                     # PWA icons
├── src/
│   ├── actions/                   # Server Actions
│   │   ├── affirmations.ts       #   Fetch & filter affirmations
│   │   ├── auth.ts               #   Sign up, sign in, sign out
│   │   ├── favorites.ts          #   Toggle & list favorites
│   │   ├── onboarding.ts         #   Save onboarding preferences
│   │   ├── profile.ts            #   Get & update profile
│   │   └── streaks.ts            #   Record visits & calc streaks
│   ├── app/
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/            #   Login page
│   │   │   └── signup/           #   Registration page
│   │   ├── (dashboard)/          # Main app route group
│   │   │   ├── favorites/        #   Saved affirmations
│   │   │   ├── generate/         #   AI generator
│   │   │   ├── home/             #   Daily feed
│   │   │   ├── insights/         #   Streak stats
│   │   │   └── profile/          #   User profile
│   │   ├── api/gemini/           # AI proxy route
│   │   ├── auth/callback/        # OAuth callback
│   │   └── onboarding/           # Onboarding flow
│   ├── components/                # Shared UI components
│   ├── features/                  # Feature-specific components
│   │   ├── affirmations/         #   Feed & card carousel
│   │   ├── ai-generator/        #   Generator form & results
│   │   ├── favorites/            #   Favorites list
│   │   ├── onboarding/           #   Goal & mood selectors
│   │   ├── profile/              #   Profile card
│   │   └── streaks/              #   Streak display
│   ├── lib/                       # Utilities & services
│   │   ├── supabase/             #   Client, server, middleware
│   │   ├── constants.ts          #   App configuration
│   │   ├── gemini.ts             #   AI service (Groq)
│   │   └── utils.ts              #   Helper functions
│   └── types/                     # TypeScript definitions
├── supabase/
│   └── migrations/                # Database schema & seeds
├── middleware.ts                   # Auth middleware
├── .env.example                   # Environment template
└── package.json
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npx vercel
```

Set environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`

### Supabase Checklist

- [x] Database migration executed
- [x] RLS policies enabled on all tables
- [x] Auth email provider configured
- [x] Auto-confirm disabled for production (use email verification)

---

## 🔮 Future Improvements

- [ ] **Push notifications** — Daily affirmation reminders via Web Push API
- [ ] **Voice mode** — Text-to-speech for affirmation playback
- [ ] **Social sharing** — Share cards as images to social platforms
- [ ] **Category analytics** — Which categories resonate most with the user
- [ ] **Affirmation journaling** — Reflect on how affirmations impacted your day
- [ ] **OAuth providers** — Google, Apple sign-in
- [ ] **Offline support** — Service worker for offline affirmation access
- [ ] **Internationalization** — Multi-language affirmation support

---

## 📄 License

This project was built for the **8x Engineer Challenge**.

---

<div align="center">

**Built with ❤️ and AI-powered productivity**

</div>
