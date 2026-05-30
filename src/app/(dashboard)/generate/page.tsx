import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GeneratorForm } from '@/features/ai-generator/generator-form';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'AI Generator',
};

export default async function GeneratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  const { data: profile } = await supabase
    .from('profiles')
    .select('goals')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          AI Generator ✨
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Share what&apos;s on your mind and get personalized affirmations
        </p>
      </div>

      <GeneratorForm userGoals={profile?.goals || []} />
    </div>
  );
}
