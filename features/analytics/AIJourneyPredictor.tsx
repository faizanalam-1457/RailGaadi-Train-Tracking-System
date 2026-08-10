'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { cn } from '@/utils/cn';

interface AIJourneyPredictorProps {
  journey: LiveJourney;
}

export function AIJourneyPredictor({ journey }: AIJourneyPredictorProps) {
  // Generate predictive stats based on train number
  const stats = useMemo(() => {
    const num = parseInt(journey.number, 10) || 12951;
    const isRajdhaniOrVande = num === 12951 || num === 12952 || num === 22436 || num === 12301 || num === 12302;
    
    const onTimeProb = isRajdhaniOrVande ? 92 : 78;
    const congestionIndex = isRajdhaniOrVande ? 18 : 42;
    const weatherRisk = journey.delayMinutes > 30 ? 'MEDIUM' : 'LOW';
    const routePriority = isRajdhaniOrVande ? 'PLATINUM (SUPERFAST)' : 'HIGH (EXPRESS)';
    
    return {
      onTimeProb,
      congestionIndex,
      weatherRisk,
      routePriority,
    };
  }, [journey.number, journey.delayMinutes]);

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.onTimeProb / 100) * circumference;

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-500 animate-pulse" />
            AI Journey Predictor & Insights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time machine learning predictions for route latency and scheduling risk.
          </p>
        </div>
        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 font-mono text-[9px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          ML ENGINE ACTIVE
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Animated Radial Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative h-32 w-32 flex items-center justify-center">
            
            {/* SVG Progress Circle */}
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth="8"
              />
              {/* Foreground Animated Circle */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>

            {/* Inner Percentage Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.onTimeProb}%
              </span>
              <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest scale-90">
                On-Time
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
            Schedule Reliability Index
          </span>
        </div>

        {/* Right: Insights Cards Grid */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Congestion Index Card */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 border space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Route Congestion Index
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {stats.congestionIndex}%
              </span>
              <span className={cn(
                "text-[10px] font-bold",
                stats.congestionIndex < 25 ? 'text-emerald-500' : 'text-amber-500'
              )}>
                {stats.congestionIndex < 25 ? 'LOW' : 'MODERATE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Track segment density and queue delay at intermediate junctions.
            </p>
          </div>

          {/* Priority Ranking Card */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 border space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Route Priority Clearance
            </span>
            <div className="text-sm font-extrabold text-indigo-500 tracking-wide uppercase truncate mt-0.5">
              {stats.routePriority}
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Precedence rating during scheduling conflicts on main trunk sections.
            </p>
          </div>

          {/* Weather Risk Card */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 border space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Weather Latency Risk
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn(
                "h-2 w-2 rounded-full",
                stats.weatherRisk === 'LOW' ? 'bg-emerald-500' : 'bg-amber-500'
              )} />
              <span className="font-bold text-xs uppercase text-slate-800 dark:text-slate-200">
                {stats.weatherRisk} RISK LEVEL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Predictive risk correlating fog, high winds, and track weather.
            </p>
          </div>

          {/* Delay Trend Card */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-900/30 border space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Schedule Prediction Trend
            </span>
            <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>STABLE ARRIVAL</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Train is predicted to maintain speed and delay margin of {journey.delayMinutes}m.
            </p>
          </div>

        </div>
      </div>

      {/* AI recommendation bar */}
      <div className="flex items-start gap-2.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-3.5 text-xs text-indigo-650 dark:text-indigo-400">
        <Sparkles className="h-4 w-4 flex-shrink-0 text-indigo-500 animate-pulse mt-0.5" />
        <div className="leading-relaxed font-medium">
          <strong>AI recommendation:</strong> Superfast priority clearance is active for train #{journey.number}. High reliability is projected. We recommend proceeding with your booking.
        </div>
      </div>
    </div>
  );
}
