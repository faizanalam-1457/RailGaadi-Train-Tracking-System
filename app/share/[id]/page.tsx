import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TRAINS_DB } from '@/lib/trains-db';
import { ShareJourneyClient } from '@/components/journey/ShareJourneyClient';
import { Skeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const trainNumber = params.id;
  const train = TRAINS_DB.find((t) => t.number === trainNumber);

  const title = train
    ? `Shared Train Status: #${train.number} ${train.name}`
    : `Shared Live Status: Train #${trainNumber}`;

  const description = train
    ? `Live position and arrival timeline shared for ${train.name} (${train.from} to ${train.to}).`
    : `Live position and status stream for Indian Railways train #${trainNumber}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://railgaadi.in/share/${trainNumber}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function ShareJourneyPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="py-8 space-y-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      }
    >
      <ShareJourneyClient trainId={params.id} />
    </Suspense>
  );
}
