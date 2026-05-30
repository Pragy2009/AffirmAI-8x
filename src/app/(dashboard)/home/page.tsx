import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAffirmations, getUserFavoriteIds } from '@/actions/affirmations';
import { getStreakStats, recordVisit } from '@/actions/streaks';
import { AffirmationFeed } from '@/features/affirmations/affirmation-feed';
import { StreakBadge } from '@/components/streak-badge';
import { Logo } from '@/components/logo';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  // Get user profile for personalized feed
  const { data: profile } = await supabase
    .from('profiles')
    .select('goals, display_name, onboarding_completed')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect(ROUTES.ONBOARDING);
  }

  // Record today's visit (fire-and-forget)
  recordVisit();

  // Fetch data in parallel
  const [affirmations, favoriteIds, streakStats] = await Promise.all([
    getAffirmations(profile.goals),
    getUserFavoriteIds(),
    getStreakStats(),
  ]);

  // Shuffle affirmations for variety (seeded by day)
  const shuffled = [...affirmations].sort(() => 0.5 - Math.random());

  const greeting = getGreeting();
  const displayName = profile.display_name || 'Friend';

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/50 text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            {displayName} ✨
          </h1>
        </div>
        <StreakBadge count={streakStats.current_streak} />
      </div>

      {/* Daily Affirmation Feed */}
      <section>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Today&apos;s Affirmations
        </h2>

        {shuffled.length > 0 ? (
          <AffirmationFeed
            affirmations={shuffled}
            favoriteIds={favoriteIds}
          />
        ) : (
          <div className="rounded-3xl p-8 bg-white/5 border border-white/10 text-center">
            <p className="text-white/50">No affirmations yet. Complete your onboarding to get started!</p>
          </div>
        )}
      </section>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}
