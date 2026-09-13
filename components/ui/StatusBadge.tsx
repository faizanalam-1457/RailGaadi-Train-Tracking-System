import React from 'react';
import { cn } from '@/utils/cn';

export type TrainStatus = 'running' | 'delayed' | 'on_time' | 'cancelled' | 'not_started' | 'completed';

interface StatusBadgeProps {
  status: TrainStatus | string;
  delayMinutes?: number;
  className?: string;
}

export function StatusBadge({ status, delayMinutes = 0, className }: StatusBadgeProps) {
  let label = 'Running';
  let badgeStyle = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30';
  let dotStyle = 'bg-emerald-500 animate-pulse';

  if (status === 'cancelled') {
    label = 'Cancelled';
    badgeStyle = 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30';
    dotStyle = 'bg-rose-500';
  } else if (status === 'not_started') {
    label = 'Not Started';
    badgeStyle = 'bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/30';
    dotStyle = 'bg-slate-400';
  } else if (status === 'completed') {
    label = 'Completed';
    badgeStyle = 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30';
    dotStyle = 'bg-sky-500';
  } else if (delayMinutes > 15) {
    label = `Delayed ${delayMinutes}m`;
    badgeStyle = 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30';
    dotStyle = 'bg-rose-500 animate-ping';
  } else if (delayMinutes > 0) {
    label = `Delayed ${delayMinutes}m`;
    badgeStyle = 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30';
    dotStyle = 'bg-amber-500 animate-pulse';
  } else {
    label = 'On Time';
    badgeStyle = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30';
    dotStyle = 'bg-emerald-500 animate-pulse';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all',
        badgeStyle,
        className
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', dotStyle)} />
      {label}
    </span>
  );
}
