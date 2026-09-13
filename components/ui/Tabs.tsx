'use client';

import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface TabsProps {
  tabs: readonly TabItem[] | TabItem[];
  activeTab: string;
  onChange: (tabId: any) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1.5 rounded-2xl glass-panel p-1.5 shadow-glass w-fit flex-wrap border border-slate-200/80 dark:border-slate-800',
        className
      )}
    >
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rail-blue/50',
              isActive
                ? 'bg-rail-blue text-white shadow-glow'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{t.label}</span>
            {t.badge !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
