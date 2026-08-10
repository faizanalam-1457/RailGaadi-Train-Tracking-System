'use client';

import React from 'react';
import { Gauge, MapPin, RefreshCw, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { DelayBadge } from './DelayBadge';
import { ProgressRing } from './ProgressRing';
import { ETAChip } from './ETAChip';
import { formatDistance, formatTimeAgo } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useJourneyStore } from '@/store/journey';

interface JourneyCardProps {
  journey: LiveJourney;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function JourneyCard({
  journey,
  onRefresh,
  isRefreshing,
  className,
}: JourneyCardProps) {
  const {
    isSimulating,
    simulatedProgress,
    simulatedSpeed,
    setSimulationState,
  } = useJourneyStore();

  const activeSpeed = isSimulating ? simulatedSpeed : journey.speedKmh;
  const activeProgress = isSimulating ? simulatedProgress : journey.completionPercentage;
  
  // Calculate simulated distance details
  const activeDistanceCovered = isSimulating 
    ? Math.round((simulatedProgress / 100) * journey.totalDistanceKm)
    : journey.distanceCoveredKm;
  const activeRemainingDistance = isSimulating
    ? Math.max(0, journey.totalDistanceKm - activeDistanceCovered)
    : journey.remainingDistanceKm;

  return (
    <div
      className={cn(
        'glass-panel relative overflow-hidden rounded-3xl p-6 shadow-glass transition-all duration-300',
        className
      )}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-rail-blue/10 px-2.5 py-1 font-mono text-xs font-bold text-rail-blue">
              #{journey.number}
            </span>
            <DelayBadge delayMinutes={journey.delayMinutes} />
          </div>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {journey.name}
          </h2>
          <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{journey.origin.name} ({journey.origin.code})</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span>{journey.destination.name} ({journey.destination.code})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ETAChip eta={isSimulating ? "Simulating position..." : journey.ETA} />
          {onRefresh && !isSimulating && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
              title="Refresh Live Status"
            >
              <RefreshCw
                className={cn('h-4 w-4', isRefreshing && 'animate-spin text-rail-blue')}
              />
            </button>
          )}
        </div>
      </div>

      {/* Primary Live Status Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Current / Last Passed Station */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/50">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Current / Last Station
            </span>
            <p className="font-semibold text-slate-900 dark:text-white">
              {journey.currentStation?.name || journey.previousStation?.name || 'In Transit'}
            </p>
            {journey.currentStation?.platform && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Platform {journey.currentStation.platform}
              </span>
            )}
          </div>
        </div>

        {/* Speed & Motion */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/50">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue">
            <Gauge className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Live Speed
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {activeSpeed}
              </span>
              <span className="text-xs font-semibold text-slate-500">km/h</span>
            </div>
          </div>
        </div>

        {/* Journey Progress Ring */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/50">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Distance Covered
            </span>
            <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {formatDistance(activeDistanceCovered)} / {formatDistance(journey.totalDistanceKm)}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDistance(activeRemainingDistance)} remaining
            </span>
          </div>
          <ProgressRing progress={activeProgress} size={54} strokeWidth={5} />
        </div>
      </div>

      {/* Simulation Controls Footer Section */}
      <div className="mt-6 border-t border-slate-200 dark:border-slate-800/80 pt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              "h-2 w-2 rounded-full",
              isSimulating ? "bg-amber-500 animate-ping" : "bg-slate-450"
            )} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isSimulating ? "JOURNEY SIMULATION ACTIVE" : "REAL-TIME TELEMETRY FEED"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={() => setSimulationState({ isSimulating: !isSimulating })}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all shadow-glow",
                isSimulating ? "bg-amber-500 hover:bg-amber-600 shadow-amber-550/20" : "bg-rail-blue hover:bg-sky-600"
              )}
            >
              {isSimulating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isSimulating ? "Pause Simulation" : "Start Simulation"}</span>
            </button>

            {/* Reset Button */}
            {isSimulating && (
              <button
                onClick={() => setSimulationState({ simulatedProgress: 0, simulatedCurrentIndex: 0, simulatedSpeed: 0 })}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 transition-colors"
                title="Reset simulation progress"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Progress scrubbing slider */}
        {isSimulating && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>Scrub Train Position</span>
              <span>{simulatedProgress.toFixed(1)}% Completed</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={simulatedProgress}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSimulationState({ simulatedProgress: val });
              }}
              className="w-full h-1.5 rounded-lg appearance-none bg-slate-200 dark:bg-slate-800 accent-rail-blue cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
        <span>{isSimulating ? "Simulation mode active" : "Auto-refreshes every 30 seconds"}</span>
        <span>Updated {formatTimeAgo(journey.lastUpdated)}</span>
      </div>
    </div>
  );
}
