import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getProfile } from '@/actions/profile';
import { getStreakStats } from '@/actions/streaks';
import { ProfileCard } from '@/features/profile/profile-card';
import { ROUTES } from '@/lib/constants';

export const metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  const [profile, streakStats, favoritesCount] = await Promise.all([
    getProfile(),
    getStreakStats(),
    getFavoritesCount(user.id),
  ]);

  if (!profile) redirect(ROUTES.LOGIN);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Profile
        </h1>
      </div>

      <ProfileCard
        profile={profile}
        streakStats={streakStats}
        favoritesCount={favoritesCount}
        email={user.email || ''}
      />
    </div>
  );
}

async function getFavoritesCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count || 0;
}
