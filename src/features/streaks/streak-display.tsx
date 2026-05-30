'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar } from 'lucide-react';
import type { StreakStats } from '@/types';

interface StreakDisplayProps {
  stats: StreakStats;
}

export function StreakDisplay({ stats }: StreakDisplayProps) {
  const statCards = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats.current_streak,
      suffix: stats.current_streak === 1 ? 'day' : 'days',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: stats.longest_streak,
      suffix: stats.longest_streak === 1 ? 'day' : 'days',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Calendar,
      label: 'Total Active Days',
      value: stats.total_days,
      suffix: stats.total_days === 1 ? 'day' : 'days',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-5 ${stat.bg} border ${stat.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-white/30 text-sm">{stat.suffix}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-5 bg-white/5 border border-white/10"
      >
        <h3 className="text-sm font-semibold text-white/60 mb-4">Last 7 Days</h3>
        <div className="flex gap-2 justify-between">
          {getLast7Days().map((day) => {
            const isActive = stats.visits.includes(day.date);
            return (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-white/20 border border-white/5'
                  }`}
                >
                  {isActive ? '✓' : '·'}
                </div>
                <span className="text-[10px] text-white/30">{day.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Motivation */}
      {stats.current_streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center"
        >
          <p className="text-white/70 text-sm">
            {stats.current_streak >= 7
              ? '🔥 Amazing! A whole week of dedication!'
              : stats.current_streak >= 3
              ? '💪 Great momentum! Keep it going!'
              : '🌟 Great start! Building a powerful habit.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

function getLast7Days(): { date: string; label: string }[] {
  const days = [];
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: labels[d.getDay()],
    });
  }

  return days;
}
