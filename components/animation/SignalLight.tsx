'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface SignalLightProps {
  state?: 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function SignalLight({ state = 'green', size = 'md', label, className }: SignalLightProps) {
  const sizeMap = {
    sm: 'h-4 w-4 text-[9px]',
    md: 'h-6 w-6 text-[11px]',
    lg: 'h-8 w-8 text-xs',
  };

  const dotSize = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 font-mono font-bold', className)}>
      <div className="flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 p-1 shadow-md">
        {/* Red Light */}
        <span
          className={cn(
            'rounded-full transition-all duration-300',
            dotSize[size],
            state === 'red'
              ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse'
              : 'bg-rose-950/60 opacity-30'
          )}
        />
        {/* Yellow Light */}
        <span
          className={cn(
            'rounded-full transition-all duration-300',
            dotSize[size],
            state === 'yellow'
              ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
              : 'bg-amber-950/60 opacity-30'
          )}
        />
        {/* Green Light */}
        <span
          className={cn(
            'rounded-full transition-all duration-300',
            dotSize[size],
            state === 'green'
              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse'
              : 'bg-emerald-950/60 opacity-30'
          )}
        />
      </div>
      {label && <span className={cn('text-slate-700 dark:text-slate-300', sizeMap[size])}>{label}</span>}
    </div>
  );
}
