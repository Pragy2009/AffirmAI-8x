'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { AffirmationCategory } from '@/types';

interface AffirmationCardProps {
  text: string;
  category: AffirmationCategory;
  isFavorited?: boolean;
  onFavorite?: () => void;
  index?: number;
}

export function AffirmationCard({
  text,
  category,
  isFavorited = false,
  onFavorite,
  index = 0,
}: AffirmationCardProps) {
  const categoryConfig = CATEGORIES.find((c) => c.id === category);
  const gradient = categoryConfig?.gradient || 'from-indigo-500 to-purple-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
      className="relative w-full"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl p-8 min-h-[320px] flex flex-col justify-between',
          'bg-gradient-to-br gradient-animate',
          gradient
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          {/* Subtle pattern */}
          <div className="absolute top-6 right-6 text-white/10 text-7xl font-serif select-none">
            &ldquo;
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 flex items-center">
          <p className="text-white text-xl sm:text-2xl leading-relaxed font-[family-name:var(--font-playfair)] font-medium">
            {text}
          </p>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between mt-6">
          <span className="text-white/70 text-sm flex items-center gap-2">
            {categoryConfig?.emoji} {categoryConfig?.label}
          </span>

          {onFavorite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-colors',
                  isFavorited ? 'fill-red-400 text-red-400' : 'text-white'
                )}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
