'use client';

import React from 'react';
import { Utensils, ExternalLink, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { CateringStation } from '@/types/catering';
import { cn } from '@/utils/cn';

interface CateringStationCardProps {
  station: CateringStation;
  isNextStop?: boolean;
}

export function CateringStationCard({ station, isNextStop }: CateringStationCardProps) {
  const isAvailable = station.available;

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl glass-panel border p-5 transition-all duration-200 shadow-sm hover:shadow-md',
        isNextStop
          ? 'border-sky-400/50 bg-sky-500/5 dark:bg-sky-950/20'
          : 'border-slate-200 dark:border-slate-800 bg-background'
      )}
    >
      <div className="space-y-3">
        {/* Station Name & Code */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors">
                {station.stationName}
              </h4>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {station.stationCode}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              {station.scheduledArrival && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>Arr: {station.scheduledArrival}</span>
                </span>
              )}
              {station.platform && <span>• Platform {station.platform}</span>}
            </div>
          </div>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              <span>eCatering</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">
              No delivery
            </span>
          )}
        </div>

        {/* Specialties Tags */}
        {station.specialties && station.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {station.specialties.map((spec, i) => (
              <span
                key={i}
                className="rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400">
          Official IRCTC Hub
        </span>

        {isAvailable ? (
          <a
            href={station.orderingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rail-blue hover:text-white dark:hover:bg-rail-blue px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <span>Order Food</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-semibold">Unavailable</span>
        )}
      </div>
    </div>
  );
}
