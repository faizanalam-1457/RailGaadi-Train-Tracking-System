'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TRAINS_DB } from '@/lib/trains-db';

export function TrainComparisonWidget() {
  const [t1, setT1] = useState('12951');
  const [t2, setT2] = useState('22436');

  const train1 = TRAINS_DB.find((t) => t.number === t1) || TRAINS_DB[0];
  const train2 = TRAINS_DB.find((t) => t.number === t2) || TRAINS_DB[1];

  return (
    <Card className="p-6 space-y-4 border border-sky-500/20 shadow-glass">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-rail-blue" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Quick Train Punctuality & Speed Comparer
          </h3>
        </div>
        <Link
          href="/schedules"
          className="text-xs font-bold text-rail-blue hover:underline flex items-center gap-1"
        >
          <span>Full Schedule Comparer</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector 1 */}
        <div className="bg-slate-100 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TRAIN A</span>
          <select
            value={t1}
            onChange={(e) => setT1(e.target.value)}
            className="w-full bg-background rounded-xl p-2 text-xs font-bold outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
          >
            {TRAINS_DB.map((t) => (
              <option key={'hw1-' + t.number} value={t.number}>
                #{t.number} {t.name}
              </option>
            ))}
          </select>
          <div className="text-xs font-mono pt-1 space-y-1">
            <p className="font-bold text-rail-blue">{train1.fromCode} → {train1.toCode}</p>
            <p className="text-[11px] text-emerald-500 font-semibold">Avg Speed: 89 km/h • 94% Punctual</p>
          </div>
        </div>

        {/* Selector 2 */}
        <div className="bg-slate-100 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TRAIN B</span>
          <select
            value={t2}
            onChange={(e) => setT2(e.target.value)}
            className="w-full bg-background rounded-xl p-2 text-xs font-bold outline-none text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
          >
            {TRAINS_DB.map((t) => (
              <option key={'hw2-' + t.number} value={t.number}>
                #{t.number} {t.name}
              </option>
            ))}
          </select>
          <div className="text-xs font-mono pt-1 space-y-1">
            <p className="font-bold text-purple-500">{train2.fromCode} → {train2.toCode}</p>
            <p className="text-[11px] text-emerald-500 font-semibold">Avg Speed: 96 km/h • 98% Punctual</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
