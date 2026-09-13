'use client';

import React from 'react';
import { Utensils, ExternalLink } from 'lucide-react';
import { OFFICIAL_IRCTC_URL } from '@/lib/catering/stations';

export function CateringEmptyState() {
  return (
    <div className="rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 max-w-md mx-auto">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mx-auto">
        <Utensils className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          No eCatering delivery points listed
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          No major eCatering delivery hubs are currently listed along this specific route segment.
        </p>
      </div>

      <a
        href={OFFICIAL_IRCTC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-rail-blue text-white px-5 py-2.5 text-xs font-bold shadow-glow hover:bg-sky-600 transition-all"
      >
        <span>Check IRCTC eCatering</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
