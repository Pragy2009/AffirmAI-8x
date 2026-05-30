'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Profile } from '@/types';

/**
 * Get the current user's profile.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data as Profile | null;
}

/**
 * Update profile settings.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const goals = formData.getAll('goals') as string[];
  const moods = formData.getAll('moods') as string[];
  const displayName = formData.get('displayName') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      goals,
      mood_preferences: moods,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/profile');
  return { success: true };
}
