import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-xl border border-slate-200 bg-background px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rail-blue/50 dark:border-slate-800 dark:text-white dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-rose-500 focus-visible:ring-rose-500/50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
