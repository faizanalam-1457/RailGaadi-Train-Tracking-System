import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TRAINS_DB } from '@/lib/trains-db';
import { TrainJourneyClient } from '@/components/journey/TrainJourneyClient';
import { Skeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const trainNumber = params.id;
  const train = TRAINS_DB.find((t) => t.number === trainNumber);

  const title = train
    ? `RailGaadi | #${train.number} ${train.name} Live Status`
    : `RailGaadi | Train #${trainNumber} Live Tracking`;

  const description = train
    ? `Track train #${train.number} (${train.name}) running live from ${train.from} (${train.fromCode}) to ${train.to} (${train.toCode}) with station timelines and vector map updates.`
    : `Real-time GPS tracking, station delays, and live route telemetry for Indian Railways train #${trainNumber}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://railgaadi.in/train/${trainNumber}`,
      siteName: 'RailGaadi Intelligence Platform',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function TrainJourneyPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 py-4 animate-pulse">
          <div className="h-10 w-48 rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-40 w-full rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="h-12 w-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-[480px] rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="lg:col-span-5 h-[480px] rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
        </div>
      }
    >
      <TrainJourneyClient trainId={params.id} />
    </Suspense>
  );
}
