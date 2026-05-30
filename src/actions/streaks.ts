'use server';

import { createClient } from '@/lib/supabase/server';
import { getTodayString, calculateStreak } from '@/lib/utils';
import type { StreakStats } from '@/types';

/**
 * Record today's visit (idempotent — no double-count).
 */
export async function recordVisit(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const today = getTodayString();

  // Upsert — won't error if already recorded today
  await supabase
    .from('streaks')
    .upsert(
      { user_id: user.id, visit_date: today },
      { onConflict: 'user_id,visit_date' }
    );
}

/**
 * Get streak statistics for the current user.
 */
export async function getStreakStats(): Promise<StreakStats> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { current_streak: 0, longest_streak: 0, total_days: 0, visits: [] };

  const { data } = await supabase
    .from('streaks')
    .select('visit_date')
    .eq('user_id', user.id)
    .order('visit_date', { ascending: false });

  const visitDates = data?.map((s) => s.visit_date) || [];
  const stats = calculateStreak(visitDates);

  return {
    current_streak: stats.current,
    longest_streak: stats.longest,
    total_days: stats.total,
    visits: visitDates,
  };
}
