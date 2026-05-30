import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx — standard shadcn/ui utility.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date));
}

/**
 * Get today's date as YYYY-MM-DD string (for streak comparisons).
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate streak from an array of visit date strings.
 */
export function calculateStreak(visitDates: string[]): {
  current: number;
  longest: number;
  total: number;
} {
  if (visitDates.length === 0) return { current: 0, longest: 0, total: 0 };

  const sorted = [...visitDates].sort((a, b) => b.localeCompare(a)); // newest first
  const today = getTodayString();

  let current = 0;
  let longest = 0;
  let tempStreak = 1;

  // Check if user visited today or yesterday for current streak
  const lastVisit = sorted[0];
  const daysDiffFromToday = daysBetween(lastVisit, today);

  if (daysDiffFromToday > 1) {
    current = 0;
  } else {
    current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = daysBetween(sorted[i], sorted[i - 1]);
      if (diff === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = daysBetween(sorted[i], sorted[i - 1]);
    if (diff === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak, current);

  return { current, longest, total: visitDates.length };
}

/**
 * Calculate days between two date strings.
 */
function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Delay utility for animations.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
