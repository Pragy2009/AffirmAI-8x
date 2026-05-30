'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { AffirmationCard } from '@/components/affirmation-card';
import { toggleFavorite } from '@/actions/favorites';
import type { Affirmation } from '@/types';

interface AffirmationFeedProps {
  affirmations: Affirmation[];
  favoriteIds: string[];
}

export function AffirmationFeed({ affirmations, favoriteIds: initialFavoriteIds }: AffirmationFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds));
  const [direction, setDirection] = useState(0);

  const current = affirmations[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < affirmations.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, affirmations.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  async function handleFavorite() {
    if (!current) return;

    // Optimistic update
    const newFavorites = new Set(favoriteIds);
    const wasFavorited = newFavorites.has(current.id);

    if (wasFavorited) {
      newFavorites.delete(current.id);
    } else {
      newFavorites.add(current.id);
    }
    setFavoriteIds(newFavorites);

    const result = await toggleFavorite(current.id);
    toast.success(result.isFavorited ? 'Added to favorites ❤️' : 'Removed from favorites');
  }

  async function handleShare() {
    if (!current) return;

    const text = `"${current.text}"\n\n— AffirmAI ✨`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  }

  if (!current) return null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative">
      {/* Card */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) goNext();
              else if (info.offset.x > 100) goPrev();
            }}
          >
            <AffirmationCard
              text={current.text}
              category={current.category}
              isFavorited={favoriteIds.has(current.id)}
              onFavorite={handleFavorite}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === affirmations.length - 1}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Counter + Share */}
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-sm">
            {currentIndex + 1} / {affirmations.length}
          </span>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
