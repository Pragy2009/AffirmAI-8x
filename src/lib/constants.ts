import { type CategoryConfig } from '@/types';

// ─── App Metadata ────────────────────────────────────────────────────────────

export const APP_NAME = 'AffirmAI';
export const APP_TAGLINE = 'Personalized affirmations, motivation, and mindset growth.';
export const APP_DESCRIPTION =
  'AI-powered daily affirmations designed to boost your confidence, career, relationships, and overall well-being.';

// ─── Categories ──────────────────────────────────────────────────────────────

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'confidence',
    label: 'Confidence',
    emoji: '💪',
    gradient: 'from-indigo-500 to-violet-600',
    description: 'Build unshakeable self-belief',
  },
  {
    id: 'career',
    label: 'Career Growth',
    emoji: '🚀',
    gradient: 'from-teal-400 to-cyan-500',
    description: 'Unlock your professional potential',
  },
  {
    id: 'productivity',
    label: 'Productivity',
    emoji: '⚡',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Maximize focus and output',
  },
  {
    id: 'self-love',
    label: 'Self Love',
    emoji: '💖',
    gradient: 'from-rose-400 to-pink-500',
    description: 'Embrace your authentic self',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    emoji: '🏋️',
    gradient: 'from-emerald-400 to-lime-500',
    description: 'Strengthen body and mind',
  },
  {
    id: 'relationships',
    label: 'Relationships',
    emoji: '🤝',
    gradient: 'from-fuchsia-400 to-purple-500',
    description: 'Deepen your connections',
  },
  {
    id: 'anxiety-relief',
    label: 'Anxiety Relief',
    emoji: '🧘',
    gradient: 'from-sky-400 to-indigo-500',
    description: 'Find your inner calm',
  },
];

// ─── Mood Options ────────────────────────────────────────────────────────────

export const MOODS = [
  { id: 'motivated', label: 'Motivated', emoji: '🔥' },
  { id: 'calm', label: 'Calm', emoji: '🌊' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'reflective', label: 'Reflective', emoji: '🪞' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌅' },
  { id: 'confident', label: 'Confident', emoji: '👑' },
  { id: 'peaceful', label: 'Peaceful', emoji: '☮️' },
] as const;

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ONBOARDING: '/onboarding',
  GENERATE: '/generate',
  FAVORITES: '/favorites',
  INSIGHTS: '/insights',
  PROFILE: '/profile',
} as const;

// ─── API ─────────────────────────────────────────────────────────────────────

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_MAX_TOKENS = 1024;
export const MAX_AI_GENERATIONS_PER_DAY = 20;
