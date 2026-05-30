'use client';

import { motion } from 'framer-motion';
import { MOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selected: string[];
  onToggle: (moodId: string) => void;
}

export function MoodSelector({ selected, onToggle }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {MOODS.map((mood, index) => {
        const isSelected = selected.includes(mood.id);

        return (
          <motion.button
            key={mood.id}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(mood.id)}
            className={cn(
              'px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 flex items-center gap-2',
              isSelected
                ? 'border-indigo-500/50 bg-indigo-500/15 text-white shadow-md shadow-indigo-500/10'
                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/8 hover:text-white/80'
            )}
          >
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
