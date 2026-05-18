'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Icons } from '@/components/icons';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center opacity-0" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 rounded-full bg-surface border border-border shadow-subtle-2 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-all duration-700 transform ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`}
        >
          <Icons.Moon className="w-5 h-5 text-signal-blue" />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-700 transform ${!isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        >
          <Icons.Sun className="w-5 h-5 text-ember" />
        </div>
      </div>

      {/* Background glow effect on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isDark ? 'bg-signal-blue' : 'bg-ember'}`}
      />
    </button>
  );
};
