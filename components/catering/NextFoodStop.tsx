'use client';

import React from 'react';
import { Utensils, ExternalLink, Clock, Sparkles, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { CateringStation } from '@/types/catering';

interface NextFoodStopProps {
  station: CateringStation;
}

export function NextFoodStop({ station }: NextFoodStopProps) {
  const etaText = station.estimatedArrival
    ? `Est. Arrival: ${station.estimatedArrival}`
    : station.scheduledArrival
    ? `Sched. Arrival: ${station.scheduledArrival}`
    : 'Upcoming station';

  return (
    <div className="group relative overflow-hidden rounded-3xl glass-panel border border-sky-400/40 dark:border-sky-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-white p-6 sm:p-8 shadow-xl">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-rail-blue/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Header Badge Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1 text-xs font-mono font-bold text-sky-300">
            <Utensils className="h-3.5 w-3.5 text-amber-400" />
            <span>NEXT FOOD STOP ON YOUR JOURNEY</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono text-emerald-300">
            <ShieldCheck className="h-3 w-3" />
            <span>Station eCatering Verified</span>
          </div>
        </div>

        {/* Main Station Name & ETA Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-sky-300 transition-colors">
                {station.stationName}
              </h3>
              <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 font-mono text-xs font-bold text-sky-400">
                {station.stationCode}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-400" />
                <span>{etaText}</span>
              </span>
              {station.platform && (
                <>
                  <span>•</span>
                  <span>Platform {station.platform}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Order Button */}
          <a
            href={station.orderingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rail-blue hover:bg-sky-600 text-white px-6 py-3 text-xs font-extrabold transition-all shadow-glow hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <span>Order via IRCTC eCatering</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Station Culinary Specialties */}
        {station.specialties && station.specialties.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Station Specialties:
            </span>
            {station.specialties.map((spec, i) => (
              <span
                key={i}
                className="rounded-lg bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Disclaimer Footer */}
        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <span>Ordering is completed securely on official IRCTC eCatering.</span>
          <span className="font-mono">Cutoff: ~{station.cutoffMinutes || 30} mins before arrival</span>
        </div>
      </div>
    </div>
  );
}
