'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Share2, Check, MapPin, CloudSun, Mountain, Armchair, Calculator, Utensils, AlertTriangle, ShieldCheck, Newspaper } from 'lucide-react';
import { useLiveJourney } from '@/hooks/useLiveJourney';
import { JourneyCard } from '@/components/journey/JourneyCard';
import { Timeline } from '@/components/journey/Timeline';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { WeatherPanel } from '@/features/weather/WeatherPanel';
import { AnalyticsDashboard } from '@/features/analytics/AnalyticsDashboard';
import { TerrainPanel } from '@/features/terrain/TerrainPanel';
import { MobileJourneySummary } from '@/components/layout/MobileJourneySummary';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { CoachLayout } from '@/features/journey/CoachLayout';
import { FareCalculator } from '@/features/journey/FareCalculator';
import { PantryMenu } from '@/features/journey/PantryMenu';
import { ProximityAlarmModal } from '@/features/journey/ProximityAlarmModal';
import { AIJourneyPredictor } from '@/features/analytics/AIJourneyPredictor';
import { TrainRelatedNews } from '@/components/news/TrainRelatedNews';
import { CateringSection } from '@/components/catering/CateringSection';
import { useJourneyStore } from '@/store/journey';
import { Station } from '@/types/train';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/features/maps/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-3xl bg-slate-900/30">
      <Skeleton className="h-full w-full rounded-3xl" />
    </div>
  ),
});

const TABS = [
  { id: 'map', label: 'Live Map', icon: MapPin },
  { id: 'coach', label: 'Coach & Seats', icon: Armchair },
  { id: 'fare', label: 'Fare Estimator', icon: Calculator },
  { id: 'pantry', label: 'Seat Meals', icon: Utensils },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'analytics', label: 'Terrain & Analytics', icon: Mountain },
  { id: 'news', label: 'Intelligence News', icon: Newspaper },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function TrainJourneyClient({ trainId }: { trainId: string }) {
  const { data: journey, isLoading, isError, error, refetch, isRefetching } = useLiveJourney(trainId);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as TabId) || 'map';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [alarmStation, setAlarmStation] = useState<Station | null>(null);

  const {
    isSimulating,
    simulatedProgress,
    simulatedSpeed,
    simulatedCurrentIndex,
    setSimulationState,
  } = useJourneyStore();

  useEffect(() => {
    setSimulationState({
      isSimulating: false,
      simulatedProgress: 0,
      simulatedSpeed: 0,
      simulatedCurrentIndex: 0,
    });
  }, [trainId, setSimulationState]);

  useEffect(() => {
    if (!isSimulating || !journey) return;
    let prevStationCode = '';

    const interval = setInterval(() => {
      const state = useJourneyStore.getState();
      const currentProgress = state.simulatedProgress;
      const totalDistance = journey.totalDistanceKm;

      let nextProgress = currentProgress + 1;
      if (nextProgress >= 100) nextProgress = 0;

      const currentDistance = (nextProgress / 100) * totalDistance;

      let currentIdx = 0;
      for (let i = 0; i < journey.stations.length; i++) {
        if (journey.stations[i].distanceKm <= currentDistance) {
          currentIdx = i;
        }
      }

      const activeStation = journey.stations[currentIdx];
      if (activeStation && activeStation.code !== prevStationCode) {
        prevStationCode = activeStation.code;
        if (state.activeAlarms.includes(activeStation.code)) {
          setSimulationState({ isSimulating: false });
          setAlarmStation(activeStation);
          clearInterval(interval);
          return;
        }
      }

      let targetSpeed = 110;
      const nextStation = journey.stations[currentIdx + 1];
      if (nextStation) {
        const distToNext = nextStation.distanceKm - currentDistance;
        if (distToNext < 15) {
          targetSpeed = Math.max(10, Math.round((distToNext / 15) * 110));
        }
      }

      const distFromCurrent = currentDistance - activeStation.distanceKm;
      if (distFromCurrent < 2.5 && activeStation.distanceKm > 0 && activeStation.distanceKm < totalDistance) {
        targetSpeed = 0;
      }

      setSimulationState({
        simulatedProgress: nextProgress,
        simulatedCurrentIndex: currentIdx,
        simulatedSpeed: targetSpeed,
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isSimulating, journey, setSimulationState]);

  const activeJourney = useMemo(() => {
    if (!journey || !isSimulating) return journey;

    const cloned = { ...journey };
    cloned.completionPercentage = simulatedProgress;
    cloned.speedKmh = simulatedSpeed;

    const covered = Math.round((simulatedProgress / 100) * journey.totalDistanceKm);
    cloned.distanceCoveredKm = covered;
    cloned.remainingDistanceKm = Math.max(0, journey.totalDistanceKm - covered);

    cloned.stations = journey.stations.map((st, idx) => {
      const clonedSt = { ...st };
      if (idx < simulatedCurrentIndex) clonedSt.status = 'passed';
      else if (idx === simulatedCurrentIndex) clonedSt.status = 'current';
      else clonedSt.status = 'upcoming';
      return clonedSt;
    });

    cloned.currentStation = cloned.stations[simulatedCurrentIndex];
    cloned.previousStation = cloned.stations[simulatedCurrentIndex - 1];
    cloned.nextStation = cloned.stations[simulatedCurrentIndex + 1];

    if (cloned.nextStation) {
      cloned.ETA = `${cloned.nextStation.name} at ${cloned.nextStation.scheduledArrival}`;
    }

    return cloned;
  }, [journey, isSimulating, simulatedProgress, simulatedSpeed, simulatedCurrentIndex]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    if (typeof navigator.share === 'function') {
      navigator
        .share({ title: `RailGaadi – ${activeJourney?.name || `Train #${trainId}`}`, url: shareUrl })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-12 w-80 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-[480px] rounded-3xl" />
          <Skeleton className="lg:col-span-5 h-[480px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !journey || !activeJourney) {
    const errMsg = (error as Error)?.message || '';
    const isQuotaError = errMsg.includes('QUOTA_EXCEEDED') || errMsg.includes('TOO_MANY_REQUESTS');
    const is404 = errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('NOT_FOUND');

    return (
      <div className="py-12 max-w-xl mx-auto space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rail-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Link>

        {isQuotaError ? (
          <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-amber-500/20">
            <div className="text-4xl">⏳</div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Live Tracking Temporarily Rate Limited</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              External railway API request limit reached. Live updates will refresh shortly.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-4 py-2 text-xs font-semibold text-white shadow-glow hover:bg-sky-600 transition-colors"
              >
                Retry Refresh
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Search
              </Link>
            </div>
          </div>
        ) : (
          <ErrorCard
            title={is404 ? 'Train Not Found' : 'Live Data Temporarily Unavailable'}
            message={
              is404
                ? `Train #${trainId} not found. Please verify the train number.`
                : `Could not load live telemetry for train #${trainId}. The train service may not be running today or provider is temporarily unreachable.`
            }
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  const trainForFavorite = {
    id: activeJourney.trainId,
    number: activeJourney.number,
    name: activeJourney.name,
    origin: activeJourney.origin,
    destination: activeJourney.destination,
  };

  return (
    <div className="space-y-4 py-2">
      {/* ─── Data Freshness & Real Data Banner ─── */}
      {activeJourney.isDemoData && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Development Mode: Currently displaying simulated demo data. Real railway telemetry requires active RailRadar credentials.</span>
          </div>
        </div>
      )}

      {/* ─── Top Controls Header ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="flex items-center gap-2">
          <StatusBadge status={activeJourney.status} delayMinutes={activeJourney.delayMinutes} />
          <FavoriteButton train={trainForFavorite} />
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-3.5 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      <MobileJourneySummary journey={activeJourney} />

      <div className="hidden md:block">
        <JourneyCard journey={activeJourney} onRefresh={() => refetch()} isRefreshing={isRefetching} />
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />

      {/* ─── Tab Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {activeTab === 'map' && <MapView journey={activeJourney} className="h-[480px] w-full" />}
          {activeTab === 'coach' && <CoachLayout />}
          {activeTab === 'fare' && <FareCalculator stations={activeJourney.stations} />}
          {activeTab === 'pantry' && (
            <div className="space-y-6">
              <CateringSection trainNumber={activeJourney.number} />
              <PantryMenu />
            </div>
          )}
          {activeTab === 'weather' && <WeatherPanel journey={activeJourney} />}
          {activeTab === 'analytics' && (
            <>
              <AIJourneyPredictor journey={activeJourney} />
              <AnalyticsDashboard journey={activeJourney} />
              <TerrainPanel trainId={activeJourney.trainId} />
            </>
          )}
          {activeTab === 'news' && (
            <TrainRelatedNews trainNumber={activeJourney.number} trainName={activeJourney.name} />
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <Timeline
            stations={activeJourney.stations}
            currentStationCode={activeJourney.currentStation?.code}
          />
        </div>
      </div>

      {/* Persistent Catering Section on main train journey view */}
      {activeTab === 'map' && (
        <CateringSection trainNumber={activeJourney.number} />
      )}

      {/* Persistent Train Related News Section at bottom of page */}
      {activeTab !== 'news' && (
        <TrainRelatedNews trainNumber={activeJourney.number} trainName={activeJourney.name} />
      )}

      <ProximityAlarmModal
        isOpen={alarmStation !== null}
        stationName={alarmStation?.name || ''}
        stationCode={alarmStation?.code || ''}
        onClose={() => setAlarmStation(null)}
      />
    </div>
  );
}


