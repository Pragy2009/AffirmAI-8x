import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';

/**
 * Root page — redirects based on auth and onboarding state.
 */
export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Check if onboarding is completed
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect(ROUTES.ONBOARDING);
  }

  redirect(ROUTES.HOME);
}
