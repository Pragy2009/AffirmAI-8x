'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Toggle favorite — adds or removes.
 */
export async function toggleFavorite(affirmationId: string): Promise<{ isFavorited: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { isFavorited: false };

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('affirmation_id', affirmationId)
    .single();

  if (existing) {
    // Remove
    await supabase.from('favorites').delete().eq('id', existing.id);
    revalidatePath('/favorites');
    return { isFavorited: false };
  } else {
    // Add
    await supabase.from('favorites').insert({
      user_id: user.id,
      affirmation_id: affirmationId,
    });
    revalidatePath('/favorites');
    return { isFavorited: true };
  }
}

/**
 * Get all favorites with affirmation data.
 */
export async function getFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      affirmation:affirmations (
        id,
        text,
        category,
        is_ai_generated
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return data || [];
}
