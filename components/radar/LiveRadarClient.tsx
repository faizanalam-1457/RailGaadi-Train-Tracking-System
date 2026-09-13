'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Train, Filter, MapPin, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TRAINS_DB } from '@/lib/trains-db';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/features/maps/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full rounded-3xl bg-slate-900/40 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400">
      Loading National Vector Radar Map...
    </div>
  ),
});

export function LiveRadarClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrainNum, setSelectedTrainNum] = useState<string>('12951');

  const filteredTrains = TRAINS_DB.filter((t) => {
    if (selectedCategory === 'rajdhani') return t.name.includes('Rajdhani');
    if (selectedCategory === 'vande') return t.name.includes('Vande Bharat');
    if (selectedCategory === 'shatabdi') return t.name.includes('Shatabdi');
    return true;
  });

  // Mock journey object for MapView
  const sampleJourney = {
    trainId: selectedTrainNum,
    number: selectedTrainNum,
    name: TRAINS_DB.find((t) => t.number === selectedTrainNum)?.name || `Train #${selectedTrainNum}`,
    origin: { code: 'MMCT', name: 'Mumbai Central' },
    destination: { code: 'NDLS', name: 'New Delhi' },
    currentLocation: { lat: 25.2138, lng: 75.8648, heading: 45, speedKmh: 115, isMoving: true },
    status: 'running' as const,
    delayMinutes: 6,
    speedKmh: 115,
    distanceCoveredKm: 920,
    remainingDistanceKm: 464,
    totalDistanceKm: 1384,
    completionPercentage: 66.5,
    lastUpdated: new Date().toISOString(),
    ETA: 'Kota Junction at 03:15',
    stations: [
      { code: 'MMCT', name: 'Mumbai Central', lat: 18.9696, lng: 72.8193, scheduledArrival: '17:00', scheduledDeparture: '17:00', delayMinutes: 0, distanceKm: 0, status: 'passed' as const },
      { code: 'ST', name: 'Surat', lat: 21.2049, lng: 72.8406, scheduledArrival: '20:10', scheduledDeparture: '20:15', delayMinutes: 4, distanceKm: 263, status: 'passed' as const },
      { code: 'KOTA', name: 'Kota Junction', lat: 25.2138, lng: 75.8648, scheduledArrival: '03:15', scheduledDeparture: '03:25', delayMinutes: 6, distanceKm: 920, status: 'current' as const },
      { code: 'NDLS', name: 'New Delhi', lat: 28.643, lng: 77.2194, scheduledArrival: '08:32', scheduledDeparture: '08:32', delayMinutes: 6, distanceKm: 1384, status: 'upcoming' as const },
    ],
    routeGeometry: [
      [72.8193, 18.9696] as [number, number],
      [72.8406, 21.2049] as [number, number],
      [75.8648, 25.2138] as [number, number],
      [77.2194, 28.643] as [number, number],
    ],
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue">
            <Compass className="h-3.5 w-3.5" />
            <span>National Railway Vector Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Full-Screen Live Radar Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time GPS telemetry radar displaying express trains across Indian railway corridors.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {['all', 'rajdhani', 'vande', 'shatabdi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 capitalize transition-all ${
                selectedCategory === cat ? 'bg-rail-blue text-white shadow-glow' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vector Radar Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MapView journey={sampleJourney} className="h-[560px] w-full shadow-2xl" />
        </div>

        {/* Train Radar Selection Sidebar */}
        <div className="lg:col-span-4 space-y-3 max-h-[560px] overflow-y-auto pr-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Corridor Express Trains ({filteredTrains.length})
          </h3>
          {filteredTrains.slice(0, 15).map((train) => {
            const isSelected = selectedTrainNum === train.number;
            return (
              <button
                key={train.number}
                onClick={() => setSelectedTrainNum(train.number)}
                className={`w-full text-left glass-panel rounded-2xl p-4 transition-all duration-200 border flex items-center justify-between ${
                  isSelected
                    ? 'bg-rail-blue/10 border-rail-blue shadow-glow'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-850/60 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue flex-shrink-0 font-mono font-bold text-xs">
                    #{train.number}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{train.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{train.fromCode} → {train.toCode}</p>
                  </div>
                </div>
                <Link
                  href={`/train/${train.number}`}
                  className="rounded-lg bg-rail-blue px-2.5 py-1 text-[10px] font-bold text-white hover:bg-sky-600 transition-colors flex-shrink-0"
                >
                  Inspect
                </Link>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
