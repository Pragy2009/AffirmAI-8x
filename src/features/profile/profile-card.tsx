'use client';

import { motion } from 'framer-motion';
import { User, Flame, Heart, Calendar, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from '@/actions/auth';
import { CATEGORIES } from '@/lib/constants';
import type { Profile, StreakStats } from '@/types';

interface ProfileCardProps {
  profile: Profile;
  streakStats: StreakStats;
  favoritesCount: number;
  email: string;
}

export function ProfileCard({ profile, streakStats, favoritesCount, email }: ProfileCardProps) {
  const userGoals = CATEGORIES.filter((c) => profile.goals.includes(c.id));

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      // redirect throws
    }
  }

  return (
    <div className="space-y-4">
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {profile.display_name || 'User'}
            </h2>
            <p className="text-white/40 text-sm">{email}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Flame, label: 'Streak', value: streakStats.current_streak, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
          { icon: Heart, label: 'Favorites', value: favoritesCount, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
          { icon: Calendar, label: 'Active', value: streakStats.total_days, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.bg} border ${stat.border}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <span className={`text-2xl font-bold block ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-white/40 font-medium">{stat.label}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-5 bg-white/5 border border-white/10"
      >
        <h3 className="text-sm font-semibold text-white/60 mb-3">Your Goals</h3>
        <div className="flex flex-wrap gap-2">
          {userGoals.length > 0 ? (
            userGoals.map((goal) => (
              <span
                key={goal.id}
                className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-medium"
              >
                {goal.emoji} {goal.label}
              </span>
            ))
          ) : (
            <p className="text-white/30 text-sm">No goals selected</p>
          )}
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleSignOut}
        className="w-full rounded-2xl p-4 bg-red-500/5 border border-red-500/10 text-red-400 flex items-center justify-center gap-2 text-sm font-medium hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  );
}
