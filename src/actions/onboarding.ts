'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const goals = formData.getAll('goals') as string[];
  const moods = formData.getAll('moods') as string[];

  const { error } = await supabase
    .from('profiles')
    .update({
      goals,
      mood_preferences: moods,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  redirect(ROUTES.HOME);
}
