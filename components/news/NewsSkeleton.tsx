'use client';

import React from 'react';

export function NewsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Featured Skeleton */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 h-72 w-full" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-5 space-y-4 h-80"
          >
            <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
