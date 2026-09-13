import React from 'react';
import { CheckCircle2, Circle, Radio, Clock, Bell, Utensils } from 'lucide-react';
import { Station } from '@/types/train';
import { formatDelay } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useJourneyStore } from '@/store/journey';
import { getStationCateringConfig, OFFICIAL_IRCTC_URL } from '@/lib/catering/stations';

interface TimelineProps {
  stations: Station[];
  currentStationCode?: string;
  className?: string;
}

export function Timeline({ stations, currentStationCode, className }: TimelineProps) {
  const { activeAlarms, toggleAlarm } = useJourneyStore();

  return (
    <div className={cn('glass-panel rounded-3xl p-6 shadow-glass', className)}>
      <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">
        Station Route Timeline
      </h3>

      <div className="relative pl-6 before:absolute before:bottom-3 before:left-3 before:top-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        <div className="space-y-6">
          {stations.map((st, idx) => {
            const isPassed = st.status === 'passed';
            const isCurrent = st.status === 'current' || st.code === currentStationCode;
            const isUpcoming = st.status === 'upcoming';
            const delayInfo = formatDelay(st.delayMinutes);
            const hasAlarm = activeAlarms.includes(st.code);
            const cateringConfig = getStationCateringConfig(st.code);

            return (
              <div key={st.code + idx} className="relative flex items-start justify-between gap-4">
                {/* Custom Timeline Dot Marker */}
                <div className="absolute -left-6 top-0.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-background">
                  {isPassed && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                  )}
                  {isCurrent && (
                    <div className="relative flex items-center justify-center">
                      <Radio className="h-5 w-5 text-rail-blue animate-pulse" />
                      <span className="absolute h-8 w-8 rounded-full bg-rail-blue/20 animate-ping" />
                    </div>
                  )}
                  {isUpcoming && (
                    <Circle className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                  )}
                </div>

                {/* Station Info */}
                <div className="flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4
                      className={cn(
                        'font-bold',
                        isCurrent
                          ? 'text-rail-blue text-base'
                          : isPassed
                          ? 'text-slate-800 dark:text-slate-200 text-sm'
                          : 'text-slate-500 dark:text-slate-400 text-sm'
                      )}
                    >
                      {st.name} ({st.code})
                    </h4>

                    {isCurrent && (
                      <span className="rounded-md bg-rail-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue">
                        LIVE LOCATION
                      </span>
                    )}

                    {cateringConfig && cateringConfig.available && (
                      <a
                        href={OFFICIAL_IRCTC_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                        title="IRCTC eCatering available at this station"
                      >
                        <Utensils className="h-3 w-3" />
                        <span>eCatering</span>
                      </a>
                    )}

                    {st.platform && (
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        PF {st.platform}
                      </span>
                    )}

                    {!isPassed && (
                      <button
                        onClick={() => toggleAlarm(st.code)}
                        className={cn(
                          "rounded-md p-1 transition-all",
                          hasAlarm
                            ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 animate-pulse border border-amber-500/30"
                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-150 dark:hover:bg-slate-800"
                        )}
                        title={hasAlarm ? "Remove proximity alarm" : "Set wake-up alarm"}
                      >
                        <Bell className={cn("h-3.5 w-3.5", hasAlarm && "fill-amber-550")} />
                      </button>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{st.distanceKm} km</span>
                    {st.haltMinutes && <span>Halt: {st.haltMinutes}m</span>}
                  </div>
                </div>

                {/* Schedule vs Actual Timing */}
                <div className="text-right font-mono text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {st.actualArrival || st.scheduledArrival}
                  </div>
                  {st.delayMinutes > 0 ? (
                    <div className={cn('text-[11px] font-bold', delayInfo.color)}>
                      +{st.delayMinutes}m delay
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      On Time
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

