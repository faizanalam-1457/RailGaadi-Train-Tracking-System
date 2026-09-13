'use client';

import React from 'react';
import { ExternalLink, Clock, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { formatTimeAgo } from '@/utils/format';

interface FeaturedNewsCardProps {
  article: NewsArticle;
}

export function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  const timeLabel = formatTimeAgo(article.publishedAt);
  const exactDateLabel = new Date(article.publishedAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="group relative overflow-hidden rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-background shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* ─── Hero Thumbnail Image Column ─── */}
        <div className="relative lg:col-span-7 h-64 sm:h-80 lg:h-auto min-h-[280px] bg-slate-950 overflow-hidden">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 p-8 text-center text-slate-300">
              <Sparkles className="h-16 w-16 text-sky-400 mb-3 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-300">
                Top Railway Story
              </span>
            </div>
          )}

          {/* Trending Banner Tag */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/90 text-white px-3.5 py-1 text-xs font-black shadow-lg backdrop-blur-md">
            <Flame className="h-4 w-4" />
            <span className="uppercase tracking-wider">TRENDING HEADLINE</span>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-md bg-slate-950/80 border border-slate-700 px-2.5 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>The Guardian Open Platform</span>
          </div>
        </div>

        {/* ─── Story Details Column ─── */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="rounded-md bg-rail-blue/15 text-rail-blue dark:text-sky-300 px-2.5 py-0.5 text-[11px] font-bold">
                {article.section || 'Featured'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-500" />
                <span>{timeLabel}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors leading-tight">
              {article.title}
            </h2>

            {article.description && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                {article.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono">
              Published {exactDateLabel}
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-rail-blue hover:bg-sky-600 text-white px-5 py-2.5 text-xs font-extrabold transition-all shadow-glow"
            >
              <span>Read Full Story</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
