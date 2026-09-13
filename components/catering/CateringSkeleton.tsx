'use client';

import React from 'react';

export function CateringSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Spotlight Skeleton */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 h-60 w-full" />

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-5 h-44"
          />
        ))}
      </div>
    </div>
  );
}
