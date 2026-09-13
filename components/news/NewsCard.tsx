'use client';

import React from 'react';
import { ExternalLink, Clock, Newspaper, Sparkles, ShieldCheck } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { formatTimeAgo } from '@/utils/format';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const timeLabel = formatTimeAgo(article.publishedAt);
  const exactDateLabel = new Date(article.publishedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-background hover:border-rail-blue/50 dark:hover:border-rail-blue/50 transition-all duration-300 shadow-sm hover:shadow-xl">
      {/* ─── Thumbnail Header ─── */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-6 text-center text-slate-400">
            <Newspaper className="h-10 w-10 text-rail-blue mb-2 opacity-80" />
            <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-slate-500">
              RailGaadi Intelligence
            </span>
          </div>
        )}

        {/* Section Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-md">
          <Sparkles className="h-3 w-3 text-sky-400" />
          <span>{article.section || 'Railway News'}</span>
        </div>

        {/* Source Badge Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-sky-950/80 border border-sky-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-sky-300 shadow-sm">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>The Guardian</span>
        </div>
      </div>

      {/* ─── Card Content ─── */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-rail-blue" />
              <span>{timeLabel}</span>
            </span>
            <span>•</span>
            <time dateTime={article.publishedAt} title={exactDateLabel} className="text-[10px]">
              {exactDateLabel}
            </time>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Description Excerpt */}
          {article.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
              {article.description}
            </p>
          )}
        </div>

        {/* ─── Footer Action Link ─── */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Official Source
          </span>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rail-blue hover:text-white dark:hover:bg-rail-blue px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <span>Read full story</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
