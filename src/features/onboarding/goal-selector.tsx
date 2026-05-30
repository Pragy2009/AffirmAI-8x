'use client';

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GoalSelectorProps {
  selected: string[];
  onToggle: (goalId: string) => void;
}

export function GoalSelector({ selected, onToggle }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((category, index) => {
        const isSelected = selected.includes(category.id);

        return (
          <motion.button
            key={category.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggle(category.id)}
            className={cn(
              'relative p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden',
              isSelected
                ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
            )}
          >
            {/* Selected gradient overlay */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10`}
              />
            )}

            <div className="relative">
              <span className="text-2xl mb-2 block">{category.emoji}</span>
              <h3 className={cn(
                'font-semibold text-sm mb-1',
                isSelected ? 'text-white' : 'text-white/80'
              )}>
                {category.label}
              </h3>
              <p className="text-xs text-white/40 leading-tight">
                {category.description}
              </p>
            </div>

            {/* Checkmark */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
