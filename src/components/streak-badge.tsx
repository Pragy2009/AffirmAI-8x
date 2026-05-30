'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
    >
      <Flame className="w-4 h-4 text-orange-400" />
      <span className="text-sm font-bold text-orange-400">
        {count}
      </span>
    </motion.div>
  );
}
