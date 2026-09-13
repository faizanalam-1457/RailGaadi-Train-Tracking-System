'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Utensils, ShieldCheck, ChevronDown, ChevronUp, Info, ExternalLink } from 'lucide-react';
import { TrainCateringInfo } from '@/types/catering';
import { NextFoodStop } from './NextFoodStop';
import { CateringStationCard } from './CateringStationCard';
import { CateringSkeleton } from './CateringSkeleton';
import { CateringEmptyState } from './CateringEmptyState';
import { CateringError } from './CateringError';

interface CateringSectionProps {
  trainNumber: string;
}

async function fetchCateringData(trainNumber: string): Promise<TrainCateringInfo> {
  const res = await fetch(`/api/trains/${trainNumber}/catering`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || 'Failed to load catering information');
  }

  return json.data as TrainCateringInfo;
}

export function CateringSection({ trainNumber }: CateringSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['train-catering', trainNumber],
    queryFn: () => fetchCateringData(trainNumber),
    staleTime: 15 * 60 * 1000, // 15 min client stale time
  });

  if (isLoading) return <CateringSkeleton />;
  if (isError) return <CateringError message={(error as Error)?.message} onRetry={() => refetch()} />;
  if (!data || !data.serviceAvailable) return <CateringEmptyState />;

  const nextStop = data.nextAvailableStation;
  const upcomingStations = data.upcoming || [];
  const allStations = data.stations || [];

  // Exclude nextStop from upcoming grid list if displayed in spotlight banner
  const gridUpcoming = nextStop
    ? upcomingStations.filter((st) => st.stationCode !== nextStop.stationCode)
    : upcomingStations;

  return (
    <section className="space-y-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-background p-6 sm:p-8 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow">
              <Utensils className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Food &amp; Catering Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find eCatering delivery points along your train route.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-3 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>IRCTC eCatering Station Capability</span>
        </div>
      </div>

      {/* ─── 1. Next Food Stop Spotlight Banner ─── */}
      {nextStop && <NextFoodStop station={nextStop} />}

      {/* ─── 2. Remaining Upcoming Delivery Stations ─── */}
      {gridUpcoming.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Upcoming Food Stations Ahead ({gridUpcoming.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridUpcoming.slice(0, 3).map((st) => (
              <CateringStationCard key={st.stationCode} station={st} />
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. View All Route Food Stops Accordion ─── */}
      {allStations.length > 3 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rail-blue transition-colors"
          >
            <span>
              {showAll ? 'Hide route catering points' : `View all ${allStations.length} route stops`}
            </span>
            {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAll && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {allStations.map((st) => (
                <CateringStationCard
                  key={st.stationCode}
                  station={st}
                  isNextStop={nextStop?.stationCode === st.stationCode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Real-Time Disclaimer Footer ─── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 p-3.5 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="h-4 w-4 text-rail-blue flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-700 dark:text-slate-300">Station Capability Notice:</span>
          <p>
            RailGaadi displays verified IRCTC eCatering station availability hubs along your train route. Meal orders are placed securely directly on the official IRCTC eCatering portal.
          </p>
        </div>
      </div>
    </section>
  );
}
