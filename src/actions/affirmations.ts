'use server';

import { createClient } from '@/lib/supabase/server';
import type { Affirmation } from '@/types';

/**
 * Fetch affirmations — optionally filtered by user's goals.
 */
export async function getAffirmations(categories?: string[]): Promise<Affirmation[]> {
  const supabase = await createClient();

  let query = supabase
    .from('affirmations')
    .select('*')
    .order('created_at', { ascending: false });

  if (categories && categories.length > 0) {
    query = query.in('category', categories);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    console.error('Error fetching affirmations:', error);
    return [];
  }

  return (data as Affirmation[]) || [];
}

/**
 * Get user's favorited affirmation IDs (for toggling hearts).
 */
export async function getUserFavoriteIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('favorites')
    .select('affirmation_id')
    .eq('user_id', user.id);

  return data?.map((f) => f.affirmation_id) || [];
}
