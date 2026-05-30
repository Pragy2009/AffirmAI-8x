import { getStreakStats } from '@/actions/streaks';
import { StreakDisplay } from '@/features/streaks/streak-display';

export const metadata = {
  title: 'Insights',
};

export default async function InsightsPage() {
  const stats = await getStreakStats();

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Insights 📊
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Track your mindset growth journey
        </p>
      </div>

      <StreakDisplay stats={stats} />
    </div>
  );
}
