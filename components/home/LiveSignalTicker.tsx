'use client';

import React from 'react';
import { SignalLight } from '@/components/animation/SignalLight';
import { Radio } from 'lucide-react';

export function LiveSignalTicker() {
  const corridors = [
    { zone: 'Northern Zone (Delhi-Lucknow)', state: 'green' as const, note: 'Normal Signals' },
    { zone: 'Western Dedicated Freight (Mumbai-Delhi)', state: 'green' as const, note: 'Speed 110-130 km/h' },
    { zone: 'Eastern Corridor (Howrah-Dhanbad)', state: 'yellow' as const, note: 'Speed restriction 60 km/h' },
    { zone: 'Southern Main Line (Chennai-Bengaluru)', state: 'green' as const, note: 'Clear Signals' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white flex-shrink-0">
        <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
        <span>Corridor Signal Radar:</span>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono font-semibold flex-shrink-0">
        {corridors.map((c) => (
          <div key={c.zone} className="flex items-center gap-2">
            <SignalLight state={c.state} size="sm" />
            <span className="text-slate-700 dark:text-slate-300">{c.zone}</span>
            <span className="text-[10px] text-slate-400 font-sans">({c.note})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
