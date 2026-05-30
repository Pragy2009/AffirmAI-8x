'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Sparkles, Heart, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const NAV_ITEMS = [
  { href: ROUTES.HOME, label: 'Home', icon: Home },
  { href: ROUTES.GENERATE, label: 'Generate', icon: Sparkles },
  { href: ROUTES.FAVORITES, label: 'Favorites', icon: Heart },
  { href: ROUTES.INSIGHTS, label: 'Insights', icon: BarChart3 },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 min-w-[56px]',
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/60'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-indigo-500/15 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className={cn('w-5 h-5 relative z-10', isActive && 'text-indigo-400')} />
                <span className="text-[10px] font-medium relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
