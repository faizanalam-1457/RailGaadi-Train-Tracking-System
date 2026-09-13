'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { NewsCard } from './NewsCard';

interface TrainRelatedNewsProps {
  trainNumber: string;
  trainName: string;
  origin?: string;
  destination?: string;
}

async function fetchTrainNews(trainNumber: string, trainName: string) {
  // Construct relevant query
  let searchQuery = 'Indian Railways';

  if (trainName.toLowerCase().includes('vande bharat')) {
    searchQuery = '"Vande Bharat"';
  } else if (trainName.toLowerCase().includes('rajdhani')) {
    searchQuery = 'Rajdhani Express OR "Indian Railways"';
  } else if (trainName.toLowerCase().includes('shatabdi')) {
    searchQuery = 'Shatabdi Express OR "Indian Railways"';
  } else {
    searchQuery = `"${trainName}" OR "Indian Railways"`;
  }

  const res = await fetch(`/api/news?q=${encodeURIComponent(searchQuery)}&limit=3`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    return [];
  }

  return (json.data?.articles || []) as NewsArticle[];
}

export function TrainRelatedNews({ trainNumber, trainName }: TrainRelatedNewsProps) {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['train-related-news', trainNumber, trainName],
    queryFn: () => fetchTrainNews(trainNumber, trainName),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading || !articles || articles.length === 0) {
    // If no articles exist or loading, hide section cleanly without fabricating fake data
    return null;
  }

  return (
    <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-rail-blue" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Related Railway News & Intelligence
          </h3>
        </div>

        <a
          href="/intelligence"
          className="text-xs font-bold text-rail-blue hover:underline inline-flex items-center gap-1"
        >
          <span>View all intelligence</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.slice(0, 3).map((art) => (
          <NewsCard key={art.id} article={art} />
        ))}
      </div>
    </section>
  );
}
