'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Train, CheckCircle2, AlertTriangle, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TRAINS_DB, TrainEntry } from '@/lib/trains-db';

export function ScheduleComparerClient() {
  const [train1Num, setTrain1Num] = useState<string>('12951');
  const [train2Num, setTrain2Num] = useState<string>('12953');

  const train1 = TRAINS_DB.find((t) => t.number === train1Num) || TRAINS_DB[0];
  const train2 = TRAINS_DB.find((t) => t.number === train2Num) || TRAINS_DB[1];

  const mockMetrics = {
    '12951': { avgDelay: 8, duration: '15h 32m', avgSpeed: 89, punctuality: '94%', halts: 7 },
    '12953': { avgDelay: 14, duration: '16h 10m', avgSpeed: 84, punctuality: '88%', halts: 11 },
    '12301': { avgDelay: 5, duration: '17h 05m', avgSpeed: 85, punctuality: '96%', halts: 6 },
    '22436': { avgDelay: 2, duration: '8h 00m', avgSpeed: 96, punctuality: '98%', halts: 4 },
  };

  const m1 = mockMetrics[train1.number as keyof typeof mockMetrics] || { avgDelay: 10, duration: '15h 45m', avgSpeed: 85, punctuality: '90%', halts: 8 };
  const m2 = mockMetrics[train2.number as keyof typeof mockMetrics] || { avgDelay: 12, duration: '16h 00m', avgSpeed: 82, punctuality: '87%', halts: 10 };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-glass space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue">
          <Calculator className="h-3.5 w-3.5" />
          <span>Side-by-Side Train Timetable & Delay Comparer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Train Performance Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Compare two Indian Railways trains side-by-side for average delay, speed, total halts, duration, and punctuality ratings.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector 1 */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Train A Selector
          </label>
          <select
            value={train1Num}
            onChange={(e) => setTrain1Num(e.target.value)}
            className="w-full bg-background rounded-xl p-2.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 outline-none text-slate-900 dark:text-white"
          >
            {TRAINS_DB.map((t) => (
              <option key={'t1-' + t.number} value={t.number}>
                #{t.number} — {t.name} ({t.fromCode} → {t.toCode})
              </option>
            ))}
          </select>
        </div>

        {/* Selector 2 */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Train B Selector
          </label>
          <select
            value={train2Num}
            onChange={(e) => setTrain2Num(e.target.value)}
            className="w-full bg-background rounded-xl p-2.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 outline-none text-slate-900 dark:text-white"
          >
            {TRAINS_DB.map((t) => (
              <option key={'t2-' + t.number} value={t.number}>
                #{t.number} — {t.name} ({t.fromCode} → {t.toCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Train 1 Card */}
        <Card className="p-6 space-y-6 border-rail-blue/30 shadow-glow">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="font-mono text-xs font-black text-rail-blue">#{train1.number}</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{train1.name}</h2>
              <p className="text-xs text-slate-500">{train1.from} ({train1.fromCode}) → {train1.to} ({train1.toCode})</p>
            </div>
            <Link
              href={`/train/${train1.number}`}
              className="rounded-xl bg-rail-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors"
            >
              Track Live
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Punctuality Score</span>
              <span className="font-bold text-emerald-500">{m1.punctuality}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Average Delay</span>
              <span className="font-bold text-amber-500">+{m1.avgDelay} min</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Journey Duration</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{m1.duration}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Average Speed</span>
              <span className="font-bold text-rail-blue">{m1.avgSpeed} km/h</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-sans">Total Commercial Halts</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{m1.halts} Halts</span>
            </div>
          </div>
        </Card>

        {/* Train 2 Card */}
        <Card className="p-6 space-y-6 border-purple-500/30">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="font-mono text-xs font-black text-purple-500">#{train2.number}</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{train2.name}</h2>
              <p className="text-xs text-slate-500">{train2.from} ({train2.fromCode}) → {train2.to} ({train2.toCode})</p>
            </div>
            <Link
              href={`/train/${train2.number}`}
              className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition-colors"
            >
              Track Live
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Punctuality Score</span>
              <span className="font-bold text-emerald-500">{m2.punctuality}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Average Delay</span>
              <span className="font-bold text-amber-500">+{m2.avgDelay} min</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Journey Duration</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{m2.duration}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-850">
              <span className="text-slate-500 font-sans">Average Speed</span>
              <span className="font-bold text-purple-500">{m2.avgSpeed} km/h</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-sans">Total Commercial Halts</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{m2.halts} Halts</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
