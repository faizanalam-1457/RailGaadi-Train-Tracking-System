'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Radio, RefreshCw, AlertTriangle, Newspaper, Search, ShieldCheck } from 'lucide-react';
import { NewsArticle, NewsTopicKey, NEWS_TOPICS } from '@/types/news';
import { NewsTopicFilter } from './NewsTopicFilter';
import { NewsSearchBar } from './NewsSearchBar';
import { FeaturedNewsCard } from './FeaturedNewsCard';
import { NewsCard } from './NewsCard';
import { NewsSkeleton } from './NewsSkeleton';

async function fetchNewsData(topic: NewsTopicKey, query: string) {
  const params = new URLSearchParams();
  if (topic && topic !== 'all') params.set('topic', topic);
  if (query && query.trim()) params.set('q', query.trim());

  const res = await fetch(`/api/news?${params.toString()}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Failed to fetch railway intelligence news');
  }

  return json.data as {
    articles: NewsArticle[];
    total: number;
    page: number;
    pages: number;
  };
}

export function IntelligenceClient() {
  const [topic, setTopic] = useState<NewsTopicKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['railgaadi-news', topic, submittedQuery],
    queryFn: () => fetchNewsData(topic, submittedQuery),
    staleTime: 5 * 60 * 1000, // 5 min client stale time
  });

  const articles = data?.articles || [];
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  const handleTopicChange = (newTopic: NewsTopicKey) => {
    setTopic(newTopic);
  };

  const handleSearchSubmit = (val: string) => {
    setSubmittedQuery(val);
  };

  const handleResetFilters = () => {
    setTopic('all');
    setSearchQuery('');
    setSubmittedQuery('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ─── Hero Branding Banner ─── */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 text-white shadow-2xl">
        <div className="absolute top-0 right-10 -mt-12 h-56 w-56 rounded-full bg-rail-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-12 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-mono text-sky-300">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Real-Time Railway Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
            RAILGAADI <span className="text-rail-blue">INTELLIGENCE</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-medium">
            &quot;What&apos;s happening across the railway world?&quot;
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Verified content from The Guardian Open Platform Content API</span>
          </div>
        </div>
      </section>

      {/* ─── Controls: Category Tabs & Search Bar ─── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <NewsSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search Vande Bharat, IRCTC, high-speed rail..."
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto">
            {isFetching && (
              <span className="flex items-center gap-1 text-rail-blue animate-pulse">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Updating feed...</span>
              </span>
            )}
            <span className="font-mono">
              {data?.total ? `${data.total} stories found` : ''}
            </span>
          </div>
        </div>

        <NewsTopicFilter activeTopic={topic} onSelectTopic={handleTopicChange} />
      </div>

      {/* ─── Active Filter Description ─── */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <p>
          Showing results for <span className="font-bold text-slate-900 dark:text-white">{NEWS_TOPICS[topic]?.label}</span>
          {submittedQuery && (
            <span>
              {' '}matching &quot;<span className="font-bold text-rail-blue">{submittedQuery}</span>&quot;
            </span>
          )}
        </p>
      </div>

      {/* ─── Content Body (Loading / Error / Data) ─── */}
      {isLoading ? (
        <NewsSkeleton />
      ) : isError ? (
        /* Error State */
        <div className="rounded-3xl glass-panel border border-rose-200 dark:border-rose-900/50 bg-rose-500/5 p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Unable to load railway news
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {(error as Error)?.message || 'News is temporarily unavailable. Please try again.'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rail-blue text-white px-5 py-2 text-xs font-bold shadow-glow hover:bg-sky-600 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Feed</span>
          </button>
        </div>
      ) : articles.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No stories matched your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching with different keywords or switch category filter.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 text-xs font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* News Feed Display */
        <div className="space-y-8">
          {/* Featured Headline Story */}
          {featuredArticle && <FeaturedNewsCard article={featuredArticle} />}

          {/* Grid of Remaining Articles */}
          {gridArticles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-rail-blue" />
                <span>LATEST RAILWAY DEVELOPMENTS</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((art) => (
                  <NewsCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
