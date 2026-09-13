'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Train, CloudSun, Clock, ShieldCheck, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SignalLight } from '@/components/animation/SignalLight';
import { cn } from '@/utils/cn';

interface StationInfo {
  code: string;
  name: string;
  city: string;
  state: string;
  platforms: number;
  lat: number;
  lng: number;
  popularTrains: string[];
  amenities: string[];
  weatherTempC: number;
  weatherCondition: string;
}

const MAJOR_STATIONS: StationInfo[] = [
  {
    code: 'NDLS',
    name: 'New Delhi Railway Station',
    city: 'New Delhi',
    state: 'Delhi',
    platforms: 16,
    lat: 28.643,
    lng: 77.2194,
    popularTrains: ['12951', '12952', '12301', '22436', '12001'],
    amenities: ['Executive Lounge', 'Free Wi-Fi', 'Retiring Rooms', 'IRCTC Food Plaza', 'Escalators'],
    weatherTempC: 31,
    weatherCondition: 'Clear',
  },
  {
    code: 'MMCT',
    name: 'Mumbai Central',
    city: 'Mumbai',
    state: 'Maharashtra',
    platforms: 9,
    lat: 18.9696,
    lng: 72.8193,
    popularTrains: ['12951', '12952', '12953', '12009', '12903'],
    amenities: ['Pod Hotel', 'Free Wi-Fi', 'VIP Lounge', 'Food Court', 'ATM'],
    weatherTempC: 29,
    weatherCondition: 'Humid',
  },
  {
    code: 'HWH',
    name: 'Howrah Junction',
    city: 'Kolkata',
    state: 'West Bengal',
    platforms: 23,
    lat: 22.584,
    lng: 88.3426,
    popularTrains: ['12301', '12302', '20905', '22229', '12102'],
    amenities: ['Heritage Museum', 'Retiring Rooms', 'Cabway', 'Food Court'],
    weatherTempC: 30,
    weatherCondition: 'Partly Cloudy',
  },
  {
    code: 'MAS',
    name: 'Chennai Central',
    city: 'Chennai',
    state: 'Tamil Nadu',
    platforms: 17,
    lat: 13.0827,
    lng: 80.2707,
    popularTrains: ['12433', '12007', '20903', '12621', '12685'],
    amenities: ['Air-Conditioned Waiting Hall', 'Solar Powered Roof', 'Multi-level Parking'],
    weatherTempC: 32,
    weatherCondition: 'Sunny',
  },
  {
    code: 'CSMT',
    name: 'Chhatrapati Shivaji Maharaj Terminus',
    city: 'Mumbai',
    state: 'Maharashtra',
    platforms: 18,
    lat: 18.9398,
    lng: 72.8355,
    popularTrains: ['20901', '22221', '12025'],
    amenities: ['UNESCO Heritage Building', 'Digital Display Board', 'Executive Lounge'],
    weatherTempC: 29,
    weatherCondition: 'Humid',
  },
  {
    code: 'SBC',
    name: 'KSR Bengaluru City',
    city: 'Bengaluru',
    state: 'Karnataka',
    platforms: 10,
    lat: 12.978,
    lng: 77.5694,
    popularTrains: ['12627', '12649', '22691', '16315'],
    amenities: ['EV Charging Station', 'Free Wi-Fi', 'Executive Lounge', 'Foot Massage Parlor'],
    weatherTempC: 26,
    weatherCondition: 'Pleasant',
  },
];

export function StationDirectoryClient() {
  const [query, setQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<StationInfo>(MAJOR_STATIONS[0]);

  const filteredStations = MAJOR_STATIONS.filter(
    (s) =>
      s.code.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-glass space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue">
          <MapPin className="h-3.5 w-3.5" />
          <span>Indian Railways Junction Radar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Station Directory & Live Board Radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Explore major railway hubs, platform counts, live weather telemetry, and connecting express trains.
        </p>

        {/* Station Search Input */}
        <div className="relative max-w-md pt-2">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-900 px-3.5 py-2.5 border border-slate-200 dark:border-slate-800">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search station code (NDLS, MMCT, HWH) or city..."
              className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Station List (4 cols) & Station Radar Inspector (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Station Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredStations.map((st) => {
            const isSelected = selectedStation.code === st.code;
            return (
              <button
                key={st.code}
                onClick={() => setSelectedStation(st)}
                className={cn(
                  'w-full text-left glass-panel rounded-2xl p-4 transition-all duration-200 border flex items-center justify-between',
                  isSelected
                    ? 'bg-rail-blue/10 border-rail-blue shadow-glow'
                    : 'hover:bg-slate-100/60 dark:hover:bg-slate-850/60 border-slate-200 dark:border-slate-800'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rail-blue text-white font-mono font-black text-xs">
                    {st.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{st.name}</h4>
                    <p className="text-xs text-slate-500">{st.city}, {st.state} • {st.platforms} Platforms</p>
                  </div>
                </div>
                <SignalLight state="green" size="sm" />
              </button>
            );
          })}
        </div>

        {/* Right: Selected Station Detail Radar Inspector */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-black text-rail-blue bg-rail-blue/10 px-2 py-0.5 rounded">
                  STATION CODE: {selectedStation.code}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedStation.name}
                </h2>
                <p className="text-xs text-slate-500">{selectedStation.city}, {selectedStation.state}</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                <CloudSun className="h-4 w-4 text-amber-500" />
                <span>{selectedStation.weatherTempC}°C {selectedStation.weatherCondition}</span>
              </div>
            </div>

            {/* Station Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-3 text-center border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PLATFORMS</span>
                <span className="text-lg font-black text-rail-blue">{selectedStation.platforms} Active</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-3 text-center border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ZONE</span>
                <span className="text-lg font-black text-emerald-500">A1 Grade</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-3 text-center border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GPS RADAR</span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {selectedStation.lat.toFixed(2)}N, {selectedStation.lng.toFixed(2)}E
                </span>
              </div>
            </div>

            {/* Connecting Popular Trains */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Connecting Trains
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStation.popularTrains.map((num) => (
                  <Link
                    key={num}
                    href={`/train/${num}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rail-blue hover:text-white transition-all text-xs font-semibold group"
                  >
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-rail-blue group-hover:text-white" />
                      <span>Train #{num}</span>
                    </div>
                    <span className="text-[10px] font-bold underline">Track Live →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Station Amenities */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Station Facilities & Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStation.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
