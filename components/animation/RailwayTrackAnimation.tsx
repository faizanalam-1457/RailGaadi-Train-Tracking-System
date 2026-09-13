'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface RailwayTrackAnimationProps {
  className?: string;
  speedSeconds?: number;
}

export function RailwayTrackAnimation({ className, speedSeconds = 12 }: RailwayTrackAnimationProps) {
  return (
    <div className={cn('relative w-full overflow-hidden py-4 select-none', className)}>
      {/* ─── Railway Track Line (Parallel Rails & Ties) ─── */}
      <div className="relative w-full h-8 flex items-center">
        {/* Top Rail Line */}
        <div className="absolute top-1 left-0 right-0 h-[2px] bg-slate-400 dark:bg-slate-700 shadow-sm" />
        {/* Bottom Rail Line */}
        <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-slate-400 dark:bg-slate-700 shadow-sm" />

        {/* Railway Wooden Ties (Sleepers) */}
        <div className="w-full h-full flex justify-between items-center px-1">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-[3px] h-6 bg-amber-900/40 dark:bg-amber-950/60 rounded-sm flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* ─── Moving Locomotive Train Engine ─── */}
      <motion.div
        animate={{ x: ['-15%', '115%'] }}
        transition={{
          repeat: Infinity,
          duration: speedSeconds,
          ease: 'linear',
        }}
        className="absolute top-0 flex items-center gap-1 z-10 pointer-events-none"
      >
        {/* Steam Puff Animation */}
        <motion.div
          animate={{ opacity: [0.2, 0.8, 0], scale: [0.8, 1.5, 2], y: [-2, -12, -20] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
          className="h-3 w-3 rounded-full bg-slate-300/60 blur-[1px] absolute -top-3 left-2"
        />

        {/* Locomotive Engine Car */}
        <div className="relative bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-sky-400 shadow-glow flex items-center gap-2">
          <span className="text-base">🚄</span>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-black text-sky-400 tracking-wider">RAILGAADI-EXPRESS</span>
            <span className="text-[8px] text-emerald-400 font-bold">SIGNAL GREEN • 110 KM/H</span>
          </div>

          {/* Rotating Wheels */}
          <div className="absolute -bottom-2 left-3 flex gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
              className="h-3 w-3 rounded-full border-2 border-sky-400 bg-slate-900 flex items-center justify-center"
            >
              <div className="h-1 w-1 bg-white rounded-full" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
              className="h-3 w-3 rounded-full border-2 border-sky-400 bg-slate-900 flex items-center justify-center"
            >
              <div className="h-1 w-1 bg-white rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Train Coaches attached */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="bg-sky-600/90 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-sky-400">
            AC 1ST (H1)
          </div>
          <div className="bg-sky-600/90 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-sky-400">
            AC 2TIER (A1)
          </div>
          <div className="bg-sky-600/90 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg border border-sky-400">
            PANTRY (PC)
          </div>
        </div>
      </motion.div>
    </div>
  );
}
