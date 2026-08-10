'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Check, MapPin, CloudSun, Mountain, AlertCircle, Armchair, Calculator, Utensils } from 'lucide-react';
import { useLiveJourney } from '@/hooks/useLiveJourney';
import { useSearchParams } from 'next/navigation';
import { JourneyCard } from '@/components/journey/JourneyCard';
import { Timeline } from '@/components/journey/Timeline';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/ErrorCard';
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
import { useJourneyStore } from '@/store/journey';
import { Station } from '@/types/train';
import { cn } from '@/utils/cn';
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
] as const;

type TabId = typeof TABS[number]['id'];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  running: {
    label: 'Running',
    color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
    dot: 'bg-emerald-500 animate-pulse',
  },
  not_started: {
    label: 'Not Started',
    color: 'bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  completed: {
    label: 'Journey Complete',
    color: 'bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-400',
    dot: 'bg-sky-500',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

function TrainJourneyPageContent({ params }: { params: { id: string } }) {
  const trainId = params.id;
  const { data: journey, isLoading, isError, error, refetch, isRefetching } = useLiveJourney(trainId);
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get('tab') as TabId) || 'map';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [alarmStation, setAlarmStation] = useState<Station | null>(null);

  // Zustand stores for simulation parameters
  const {
    isSimulating,
    simulatedProgress,
    simulatedSpeed,
    simulatedCurrentIndex,
    activeAlarms,
    setSimulationState,
  } = useJourneyStore();

  // Reset simulation state when train changes or page loads
  useEffect(() => {
    setSimulationState({
      isSimulating: false,
      simulatedProgress: 0,
      simulatedSpeed: 0,
      simulatedCurrentIndex: 0,
    });
  }, [trainId, setSimulationState]);

  // Simulation run interval effect
  useEffect(() => {
    if (!isSimulating || !journey) return;

    let prevStationCode = '';

    const interval = setInterval(() => {
      // Access current state values securely inside the interval
      const state = useJourneyStore.getState();
      const currentProgress = state.simulatedProgress;
      const totalDistance = journey.totalDistanceKm;

      // Increment progress
      let nextProgress = currentProgress + 1;
      if (nextProgress >= 100) {
        nextProgress = 0;
      }

      const currentDistance = (nextProgress / 100) * totalDistance;

      // Find current station index
      let currentIdx = 0;
      for (let i = 0; i < journey.stations.length; i++) {
        if (journey.stations[i].distanceKm <= currentDistance) {
          currentIdx = i;
        }
      }

      const activeStation = journey.stations[currentIdx];

      // Check for proximity alarm trigger
      if (activeStation && activeStation.code !== prevStationCode) {
        prevStationCode = activeStation.code;
        if (state.activeAlarms.includes(activeStation.code)) {
          // Trigger alarm! Pause simulation and show modal
          setSimulationState({ isSimulating: false });
          setAlarmStation(activeStation);
          clearInterval(interval);
          return;
        }
      }

      // Simulate speed: fluctuate between 90 and 120 km/h, but decelerate to 0 near stations
      let targetSpeed = 110;
      const nextStation = journey.stations[currentIdx + 1];
      if (nextStation) {
        const distToNext = nextStation.distanceKm - currentDistance;
        if (distToNext < 15) {
          // Slow down!
          targetSpeed = Math.max(10, Math.round((distToNext / 15) * 110));
        }
      }
      
      // If we are extremely close to the station (e.g. within 1km), halt speed is 0
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

  // Create simulated journey if isSimulating is active
  const activeJourney = useMemo(() => {
    if (!journey || !isSimulating) return journey;

    const cloned = { ...journey };
    cloned.completionPercentage = simulatedProgress;
    cloned.speedKmh = simulatedSpeed;
    
    const covered = Math.round((simulatedProgress / 100) * journey.totalDistanceKm);
    cloned.distanceCoveredKm = covered;
    cloned.remainingDistanceKm = Math.max(0, journey.totalDistanceKm - covered);

    // Re-calculate stations statuses
    cloned.stations = journey.stations.map((st, idx) => {
      const clonedSt = { ...st };
      if (idx < simulatedCurrentIndex) {
        clonedSt.status = 'passed';
      } else if (idx === simulatedCurrentIndex) {
        clonedSt.status = 'current';
      } else {
        clonedSt.status = 'upcoming';
      }
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
    const isQuotaError = errMsg.includes('QUOTA_EXCEEDED') || errMsg.includes('TOO_MANY_REQUESTS') || errMsg.includes('Daily quota');
    const is404 = errMsg.includes('404') || errMsg.includes('not found');

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
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">API Quota Reached</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              The RailRadar free tier allows <strong>50 requests/day</strong>. Today's quota has been exhausted.
              Live tracking will resume tomorrow, or you can upgrade your RailRadar plan.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://railradar.in/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-4 py-2 text-xs font-semibold text-white shadow-glow hover:bg-sky-600 transition-colors"
              >
                Upgrade API Plan
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Search
              </Link>
            </div>
          </div>
        ) : (
          <ErrorCard
            title={is404 ? 'Train Not Found' : 'Live Data Unavailable'}
            message={
              is404
                ? `Train #${trainId} not found. Please check the train number.`
                : `Could not load live data for train #${trainId}. The train may not be running today or the service is temporarily unavailable.`
            }
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[activeJourney.status] || STATUS_CONFIG.running;

  // Build a lean SearchResult-compatible object for FavoriteButton
  const trainForFavorite = {
    id: activeJourney.trainId,
    number: activeJourney.number,
    name: activeJourney.name,
    origin: activeJourney.origin,
    destination: activeJourney.destination,
  };

  return (
    <div className="space-y-4 py-2">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold', statusCfg.color)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
            {statusCfg.label}
          </span>

          {/* Favorite */}
          <FavoriteButton train={trainForFavorite} />

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-3.5 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-sky-600 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* ─── Mobile Journey Summary ─── */}
      <MobileJourneySummary journey={activeJourney} />

      {/* ─── Hero Journey Card (desktop) ─── */}
      <div className="hidden md:block">
        <JourneyCard journey={activeJourney} onRefresh={() => refetch()} isRefreshing={isRefetching} />
      </div>

      {/* ─── Not-Started / Cancelled Banner ─── */}
      {(activeJourney.status === 'not_started' || activeJourney.status === 'cancelled') && (
        <div className="glass-panel flex items-center gap-3 rounded-2xl p-4 border border-amber-500/20">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {activeJourney.status === 'not_started'
              ? `Train #${activeJourney.number} hasn't departed yet. Live tracking activates once the journey begins (scheduled departure: ${activeJourney.stations[0]?.scheduledDeparture || 'check timetable'}).`
              : `Train #${activeJourney.number} has been cancelled. Please check NTES for alternate arrangements.`}
          </p>
        </div>
      )}

      {/* ─── Tab Selector ─── */}
      <div className="flex items-center gap-1.5 rounded-2xl glass-panel p-1.5 shadow-glass w-fit flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap',
              activeTab === id
                ? 'bg-rail-blue text-white shadow-glow'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ─── Main Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active feature panel */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {activeTab === 'map' && <MapView journey={activeJourney} className="h-[480px] w-full" />}
          {activeTab === 'coach' && <CoachLayout />}
          {activeTab === 'fare' && <FareCalculator stations={activeJourney.stations} />}
          {activeTab === 'pantry' && <PantryMenu />}
          {activeTab === 'weather' && <WeatherPanel journey={activeJourney} />}
          {activeTab === 'analytics' && (
            <>
              <AIJourneyPredictor journey={activeJourney} />
              <AnalyticsDashboard journey={activeJourney} />
              <TerrainPanel trainId={activeJourney.trainId} />
            </>
          )}
        </div>

        {/* Route Timeline */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Timeline
            stations={activeJourney.stations}
            currentStationCode={activeJourney.currentStation?.code}
          />
        </div>
      </div>

      {/* Proximity Alarm Warning Overlay */}
      <ProximityAlarmModal
        isOpen={alarmStation !== null}
        stationName={alarmStation?.name || ''}
        stationCode={alarmStation?.code || ''}
        onClose={() => setAlarmStation(null)}
      />
    </div>
  );
}

export default function TrainJourneyPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="space-y-6 py-4 animate-pulse">
        <div className="h-10 w-48 rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-40 w-full rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-12 w-80 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
          <div className="lg:col-span-7 h-[480px] rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div className="lg:col-span-5 h-[480px] rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      </div>
    }>
      <TrainJourneyPageContent params={params} />
    </Suspense>
  );
}
