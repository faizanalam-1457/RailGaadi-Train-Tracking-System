'use client';

import React from 'react';
import { NEWS_TOPICS, NewsTopicKey } from '@/types/news';
import { cn } from '@/utils/cn';

interface NewsTopicFilterProps {
  activeTopic: NewsTopicKey;
  onSelectTopic: (topic: NewsTopicKey) => void;
}

export function NewsTopicFilter({ activeTopic, onSelectTopic }: NewsTopicFilterProps) {
  const topicList = Object.values(NEWS_TOPICS);

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {topicList.map((t) => {
        const isActive = activeTopic === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onSelectTopic(t.key)}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border shadow-xs',
              isActive
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md'
                : 'bg-background text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
