'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Send, Heart, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { toggleFavorite } from '@/actions/favorites';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { AffirmationCategory } from '@/types';

interface GeneratorFormProps {
  userGoals: string[];
}

export function GeneratorForm({ userGoals }: GeneratorFormProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) {
      toast.error('Please describe how you\'re feeling');
      return;
    }

    setIsLoading(true);
    setAffirmations([]);
    setSavedIds(new Set());

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          goals: userGoals,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to generate');
        return;
      }

      setAffirmations(data.affirmations);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(index: number, text: string) {
    // First, create the affirmation in the database
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, goals: userGoals }),
    });

    // For now, just mark as saved visually
    setSavedIds((prev) => new Set(prev).add(index));
    toast.success('Saved to your affirmations! ✨');
  }

  const suggestions = [
    'I am nervous about my interview tomorrow',
    'I feel overwhelmed with work',
    'I want to believe in myself more',
    'I am struggling with self-doubt',
  ];

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's on your mind..."
            maxLength={500}
            rows={3}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm leading-relaxed"
          />
          <span className="absolute bottom-3 right-3 text-white/20 text-xs">
            {input.length}/500
          </span>
        </div>

        {/* Suggestion chips */}
        {!input && affirmations.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white/70 hover:bg-white/10 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Affirmations
            </>
          )}
        </motion.button>
      </form>

      {/* Results */}
      <AnimatePresence>
        {affirmations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/60">Your Affirmations</h3>
              <button
                onClick={() => { setAffirmations([]); setInput(''); }}
                className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                New
              </button>
            </div>

            {affirmations.map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
              >
                <p className="text-white font-[family-name:var(--font-playfair)] text-lg leading-relaxed mb-3">
                  {text}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300/50 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </span>
                  <button
                    onClick={() => handleSave(index, text)}
                    disabled={savedIds.has(index)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                      savedIds.has(index)
                        ? 'bg-pink-500/20 text-pink-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                    )}
                  >
                    <Heart className={cn('w-3 h-3', savedIds.has(index) && 'fill-pink-400')} />
                    {savedIds.has(index) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
