'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { AffirmationCard } from '@/components/affirmation-card';
import { EmptyState } from '@/components/empty-state';
import { toggleFavorite } from '@/actions/favorites';
import { CATEGORIES } from '@/lib/constants';
import type { AffirmationCategory } from '@/types';

interface FavoriteItem {
  id: string;
  created_at: string;
  affirmation: {
    id: string;
    text: string;
    category: string;
    is_ai_generated: boolean;
  } | null;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
}

export function FavoritesList({ favorites: initialFavorites }: FavoritesListProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = favorites.filter((fav) => {
    if (!fav.affirmation) return false;
    const matchesSearch = fav.affirmation.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || fav.affirmation.category === filter;
    return matchesSearch && matchesFilter;
  });

  async function handleRemove(favoriteId: string, affirmationId: string) {
    // Optimistic remove
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    await toggleFavorite(affirmationId);
    toast.success('Removed from favorites');
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="💫"
        title="No favorites yet"
        description="Tap the heart on any affirmation to save it here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search favorites..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            !filter ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-white/50 border border-white/10'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === cat.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-white/50 border border-white/10'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <AnimatePresence>
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((fav, index) =>
              fav.affirmation ? (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative group"
                >
                  <AffirmationCard
                    text={fav.affirmation.text}
                    category={fav.affirmation.category as AffirmationCategory}
                    isFavorited
                    onFavorite={() => handleRemove(fav.id, fav.affirmation!.id)}
                  />
                </motion.div>
              ) : null
            )}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="No results"
            description="Try a different search or filter."
          />
        )}
      </AnimatePresence>
    </div>
  );
}
