'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface CateringErrorProps {
  message?: string;
  onRetry: () => void;
}

export function CateringError({ message, onRetry }: CateringErrorProps) {
  return (
    <div className="rounded-3xl glass-panel border border-rose-200 dark:border-rose-900/40 bg-rose-500/5 p-6 text-center space-y-3 max-w-md mx-auto">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mx-auto">
        <AlertTriangle className="h-5 w-5" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Food availability couldn&apos;t be loaded
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {message || 'Unable to retrieve station eCatering data at this time.'}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold transition-all hover:scale-105"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Retry Catering Info</span>
      </button>
    </div>
  );
}
