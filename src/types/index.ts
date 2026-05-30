// ─── User Profile ────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  display_name: string | null;
  goals: string[];
  mood_preferences: string[];
  reminder_time: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Affirmation ─────────────────────────────────────────────────────────────

export interface Affirmation {
  id: string;
  text: string;
  category: AffirmationCategory;
  is_ai_generated: boolean;
  user_id: string | null;
  created_at: string;
}

export type AffirmationCategory =
  | 'confidence'
  | 'career'
  | 'productivity'
  | 'self-love'
  | 'fitness'
  | 'relationships'
  | 'anxiety-relief';

// ─── Favorite ────────────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  user_id: string;
  affirmation_id: string;
  created_at: string;
  affirmation?: Affirmation;
}

// ─── Streak ──────────────────────────────────────────────────────────────────

export interface StreakRecord {
  id: string;
  user_id: string;
  visit_date: string;
  created_at: string;
}

export interface StreakStats {
  current_streak: number;
  longest_streak: number;
  total_days: number;
  visits: string[]; // array of date strings
}

// ─── AI Generator ────────────────────────────────────────────────────────────

export interface GenerateRequest {
  input: string;
  goals?: string[];
  mood?: string;
}

export interface GenerateResponse {
  affirmations: string[];
  error?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  isLoading: boolean;
}

// ─── Category Config ─────────────────────────────────────────────────────────

export interface CategoryConfig {
  id: AffirmationCategory;
  label: string;
  emoji: string;
  gradient: string;
  description: string;
}

// ─── Insight ─────────────────────────────────────────────────────────────────

export interface WeeklyActivity {
  day: string;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}
