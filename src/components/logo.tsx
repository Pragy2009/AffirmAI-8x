'use client';

import { APP_NAME } from '@/lib/constants';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Animated icon */}
      <div
        className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg gradient-animate`}
      >
        <span className={size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}>
          ✨
        </span>
      </div>

      {showText && (
        <span
          className={`${textSizes[size]} font-bold tracking-tight gradient-text font-[family-name:var(--font-playfair)]`}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
