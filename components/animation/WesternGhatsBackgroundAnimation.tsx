'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function WesternGhatsBackgroundAnimation() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-35 dark:opacity-45 transition-opacity duration-500"
    >
      {/* ─── Sky & Atmosphere Gradient (Light & Dark Theme Adaptive) ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/25 via-emerald-500/10 to-transparent dark:from-slate-950 dark:via-sky-950/40 dark:to-transparent" />

      {/* ─── Celestial Sun Glow (Light) / Atmospheric Cloud Glow (Dark) ─── */}
      <div className="absolute top-6 right-20 h-48 w-48 rounded-full bg-amber-300/25 dark:bg-sky-500/15 blur-3xl" />

      {/* ─── Layer 1: Volumetric Floating Clouds ─── */}
      <motion.div
        animate={{ x: ['-20%', '100%'] }}
        transition={{ repeat: Infinity, duration: 65, ease: 'linear' }}
        className="absolute top-6 left-0 w-[150%] h-36 opacity-70"
      >
        <svg viewBox="0 0 1400 120" className="w-full h-full fill-white/85 dark:fill-slate-700/40">
          <path d="M0 60 Q 150 15 300 60 T 600 60 T 900 60 T 1200 60 T 1400 60 L 1400 120 L 0 120 Z" />
        </svg>
      </motion.div>

      {/* ─── Layer 2: Distant High Western Ghats Peaks (Sahyadri Crests) ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[56%] w-full">
        <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="w-full h-full text-emerald-950/35 dark:text-slate-900/90 fill-current">
          <path d="M0,200 L120,110 L240,230 L380,80 L520,240 L680,90 L820,220 L960,70 L1100,210 L1260,100 L1440,190 L1440,360 L0,360 Z" />
        </svg>
      </div>

      {/* ─── Layer 3: Mid-Ground Lush Ghats Hills & Cascading Waterfall ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[44%] w-full">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full text-emerald-800/45 dark:text-emerald-950/80 fill-current">
          <path d="M0,220 L160,130 L320,240 L500,140 L680,250 L860,130 L1040,230 L1220,120 L1440,220 L1440,320 L0,320 Z" />
        </svg>
        
        {/* Sahyadri Silver Waterfall Stream Accent */}
        <div className="absolute top-[28%] left-[22%] w-1.5 h-24 bg-gradient-to-b from-sky-200/80 via-white to-transparent dark:from-sky-400/60 blur-[0.5px] rounded-full animate-pulse" />
      </div>

      {/* ─── Layer 4: Mountain Tunnel Portal (Right Side) ─── */}
      <div className="absolute bottom-[24%] right-0 z-10 w-28 h-32 flex items-end">
        <div className="w-full h-28 border-t-8 border-l-8 border-slate-700 dark:border-slate-800 rounded-tl-full bg-slate-950 shadow-2xl flex items-center justify-center">
          <div className="w-20 h-20 bg-slate-950 rounded-tl-full" />
        </div>
      </div>

      {/* ─── Layer 5: 25kV AC Overhead Electric Catenary Wires & Masts ─── */}
      <div className="absolute bottom-[32%] left-0 right-0 h-10 w-full flex items-center justify-around pointer-events-none z-10">
        {/* Contact & Messenger Wires */}
        <div className="absolute top-2 left-0 right-0 h-[1.5px] bg-slate-500 dark:bg-slate-300 opacity-70" />
        <div className="absolute top-4 left-0 right-0 h-[1px] bg-slate-600 dark:bg-slate-400 opacity-50" />

        {/* Mast Poles & Cantilever Arms */}
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="relative h-10 w-[2.5px] bg-slate-700 dark:bg-slate-400 flex flex-col items-center">
            {/* Insulator & Cantilever Arm */}
            <div className="h-[2px] w-7 bg-slate-700 dark:bg-slate-400 absolute top-2 -left-3.5" />
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500/80 absolute top-1 -left-1" />
          </div>
        ))}
      </div>

      {/* ─── Layer 6: Arched Stone Viaduct Bridge & Steel Rails ─── */}
      <div className="absolute bottom-[14%] left-0 right-0 h-32 w-full flex flex-col justify-start z-10">
        {/* Heavy Steel Rail Track & Sleepers */}
        <div className="w-full h-[6px] bg-gradient-to-r from-slate-600 via-slate-300 to-slate-600 dark:from-slate-400 dark:via-slate-100 dark:to-slate-400 shadow-lg border-b-2 border-slate-900" />
        
        {/* Concrete/Stone Arch Pillars */}
        <div className="w-full h-24 flex justify-around items-top pt-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="w-11 h-full border-t-4 border-x-4 border-slate-600/80 dark:border-slate-400/80 rounded-t-2xl bg-slate-800/30 dark:bg-slate-900/60 shadow-lg"
            />
          ))}
        </div>
      </div>

      {/* ─── Layer 7: Realistic Vande Bharat Express (Train 18) Gliding EXACTLY ON TOP OF RAIL TRACK ─── */}
      <motion.div
        animate={{ x: ['-35%', '130%'] }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: 'linear',
        }}
        className="absolute bottom-[24.5%] left-0 z-20 flex items-end"
      >
        {/* ── Aerodynamic Front Engine Nose (Vande Bharat White & Royal Blue) ── */}
        <div className="relative h-7.5 w-32 bg-gradient-to-r from-slate-100 via-white to-sky-600 rounded-l-full border border-sky-400 shadow-xl flex items-center px-2">
          {/* Glowing LED Twin Headlight Beam */}
          <div className="absolute -left-16 top-1 h-5 w-16 bg-gradient-to-r from-amber-200/90 via-sky-200/40 to-transparent blur-[3px] rounded-l-full" />
          <div className="h-2 w-2 rounded-full bg-amber-100 shadow-[0_0_10px_#fff] absolute left-1 top-2.5" />

          {/* Aerodynamic Tinted Cockpit Glass */}
          <div className="h-3.5 w-8 bg-slate-950 rounded-l-full border border-sky-300 flex items-center justify-center ml-2">
            <div className="h-1.5 w-3 bg-sky-400/90 rounded-full" />
          </div>

          {/* Vande Bharat Signature Blue Livery Stripe */}
          <div className="ml-auto h-2.5 w-16 bg-[#003399] rounded-full flex items-center px-1.5 shadow-inner">
            <span className="font-mono text-[8px] font-black text-white tracking-widest">VANDE BHARAT</span>
          </div>

          {/* High Speed Pantograph Arm touching 25kV Wire */}
          <div className="absolute -top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-slate-700 dark:border-slate-200 transform -skew-x-12">
            <div className="h-1 w-1 bg-amber-400 rounded-full absolute -top-1 -right-1 animate-ping" />
          </div>
        </div>

        {/* ── Vande Bharat Executive & AC Chair Car Coaches ── */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-6.5 w-26 bg-slate-100 dark:bg-slate-200 rounded-xs border border-slate-400 flex flex-col justify-between p-0.5 shadow-md relative ml-[1px]"
          >
            {/* Royal Blue Livery Roof Strip */}
            <div className="w-full h-1 bg-[#003399] rounded-xs" />

            {/* Continuous Panoramic Glass Window Strip */}
            <div className="w-full h-3 bg-slate-900 rounded-xs flex justify-around items-center px-1 border border-slate-800">
              {Array.from({ length: 7 }).map((_, w) => (
                <div key={w} className="h-2 w-2.5 bg-sky-300/80 rounded-xs shadow-[0_0_4px_#38bdf8]" />
              ))}
            </div>

            {/* Bottom Metallic Blue Trim */}
            <div className="w-full h-0.5 bg-sky-500 rounded-xs" />

            {/* Wheel Bogie Assemblies Resting Directly on Steel Rails */}
            <div className="absolute -bottom-1.5 left-2.5 right-2.5 flex justify-between z-30">
              <div className="h-2 w-3.5 bg-slate-900 rounded-full border border-slate-600 flex items-center justify-center shadow-md">
                <div className="h-1 w-1 rounded-full bg-slate-400" />
              </div>
              <div className="h-2 w-3.5 bg-slate-900 rounded-full border border-slate-600 flex items-center justify-center shadow-md">
                <div className="h-1 w-1 rounded-full bg-slate-400" />
              </div>
            </div>
          </div>
        ))}

        {/* ── Rear Engine Nose Cone with Red Marker Tail Lights ── */}
        <div className="relative h-7.5 w-22 bg-gradient-to-l from-slate-100 via-white to-sky-600 rounded-r-full border border-sky-400 shadow-xl flex items-center px-2">
          {/* Pulsing Red Flashing Marker Tail Light */}
          <div className="ml-auto flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)] animate-ping" />
            <div className="h-2 w-2 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(244,63,94,1)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


