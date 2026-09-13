'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
      aria-label="Toggle dark and light theme"
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95',
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="h-4 w-4 text-sky-600 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
