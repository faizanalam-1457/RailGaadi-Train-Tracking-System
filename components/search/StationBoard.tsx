'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BoardRow {
  number: string;
  name: string;
  destination: string;
  time: string;
  platform: string;
  status: 'ON TIME' | 'DELAY 15M' | 'DELAY 1H' | 'DEPARTED' | 'PLATFORM CHG';
  statusColor: string;
}

const STATION_DATA: Record<string, { stationName: string; departures: BoardRow[] }> = {
  NDLS: {
    stationName: 'NEW DELHI CENTRAL',
    departures: [
      { number: '12952', name: 'MUMBAI RAJDHANI', destination: 'MUMBAI CENTRAL', time: '16:55', platform: '03', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '22436', name: 'VANDE BHARAT EXP', destination: 'VARANASI JN', time: '06:00', platform: '01', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12002', name: 'NDLS SHATABDI', destination: 'BHOPAL JN', time: '06:10', platform: '04', status: 'DELAY 15M', statusColor: 'text-amber-500' },
      { number: '12622', name: 'TAMIL NADU EXP', destination: 'CHENNAI CENTRAL', time: '21:05', platform: '06', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12302', name: 'HOWRAH RAJDHANI', destination: 'HOWRAH JN', time: '16:50', platform: '11', status: 'PLATFORM CHG', statusColor: 'text-sky-500' },
    ],
  },
  MMCT: {
    stationName: 'MUMBAI CENTRAL',
    departures: [
      { number: '12951', name: 'MUMBAI RAJDHANI', destination: 'NEW DELHI', time: '17:00', platform: '01', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12953', name: 'AUGUST KRANTI EXP', destination: 'HAZRAT NIZAMUDDIN', time: '17:10', platform: '02', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12925', name: 'PASCHIM EXPRESS', destination: 'AMRITSAR JN', time: '11:25', platform: '05', status: 'DELAY 1H', statusColor: 'text-rose-500' },
      { number: '12010', name: 'MMCT SHATABDI', destination: 'AHMEDABAD JN', time: '06:20', platform: '03', status: 'DEPARTED', statusColor: 'text-slate-400' },
    ],
  },
  KOTA: {
    stationName: 'KOTA JUNCTION',
    departures: [
      { number: '12952', name: 'MUMBAI RAJDHANI', destination: 'MUMBAI CENTRAL', time: '21:40', platform: '01', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12951', name: 'MUMBAI RAJDHANI', destination: 'NEW DELHI', time: '21:55', platform: '01', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '19038', name: 'AVADH EXPRESS', destination: 'BANDRA TERMINUS', time: '12:20', platform: '02', status: 'DELAY 15M', statusColor: 'text-amber-500' },
      { number: '12401', name: 'KOTA NIZAMUDDIN EXP', destination: 'HAZRAT NIZAMUDDIN', time: '17:55', platform: '03', status: 'ON TIME', statusColor: 'text-emerald-500' },
    ],
  },
  HWH: {
    stationName: 'HOWRAH JUNCTION',
    departures: [
      { number: '12301', name: 'HOWRAH RAJDHANI', destination: 'NEW DELHI', time: '16:50', platform: '09', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12305', name: 'HOWRAH RAJDHANI', destination: 'NEW DELHI', time: '14:05', platform: '09', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12860', name: 'GEETANJALI EXP', destination: 'MUMBAI CSMT', time: '13:50', platform: '21', status: 'DELAY 15M', statusColor: 'text-amber-500' },
      { number: '12249', name: 'HWH YPR DURONTO', destination: 'YESVANTPUR JN', time: '12:40', platform: '22', status: 'ON TIME', statusColor: 'text-emerald-500' },
    ],
  },
  MAS: {
    stationName: 'CHENNAI CENTRAL',
    departures: [
      { number: '12621', name: 'TAMIL NADU EXP', destination: 'NEW DELHI', time: '22:00', platform: '05', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '12269', name: 'MAS NZM DURONTO', destination: 'HAZRAT NIZAMUDDIN', time: '06:40', platform: '01', status: 'ON TIME', statusColor: 'text-emerald-500' },
      { number: '20607', name: 'MYS VANDE BHARAT', destination: 'MYSORE JN', time: '05:50', platform: '02', status: 'DEPARTED', statusColor: 'text-slate-400' },
      { number: '12615', name: 'GRAND TRUNK EXP', destination: 'NEW DELHI', time: '18:50', platform: '04', status: 'DELAY 1H', statusColor: 'text-rose-500' },
    ],
  },
};

export function StationBoard() {
  const [activeStationCode, setActiveStationCode] = useState<string>('NDLS');
  const activeStation = useMemo(() => STATION_DATA[activeStationCode], [activeStationCode]);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-rail-blue animate-pulse" />
            Live Station Departures Board
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time departures status and platform updates for major terminals.
          </p>
        </div>

        {/* Station Selectors */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl glass-panel p-1.5 shadow-glass w-fit">
          {Object.keys(STATION_DATA).map((code) => (
            <button
              key={code}
              onClick={() => setActiveStationCode(code)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
                activeStationCode === code
                  ? 'bg-rail-blue text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* departures Split-Flap Screen Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-950 bg-slate-950 p-5 md:p-8 shadow-inner shadow-black/80 text-amber-500 font-mono select-none">
        
        {/* LED Header bar */}
        <div className="mb-4 flex items-center justify-between border-b border-amber-500/20 pb-4 text-[10px] uppercase font-bold tracking-widest text-amber-500/50">
          <span>STATION BOARD: {activeStation.stationName}</span>
          <span className="animate-pulse">● LIVE UPDATE ACTIVE</span>
        </div>

        {/* Board Header Grid */}
        <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-bold border-b border-amber-500/10 pb-2 text-amber-500/60 tracking-wider">
          <div className="col-span-2">TRAIN #</div>
          <div className="col-span-3">TRAIN NAME</div>
          <div className="col-span-3">DESTINATION</div>
          <div className="col-span-1 text-center">TIME</div>
          <div className="col-span-1 text-center">PF</div>
          <div className="col-span-2 text-right">STATUS</div>
        </div>

        {/* departures Rows */}
        <div className="mt-3 space-y-2.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStationCode}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="space-y-2.5"
            >
              {activeStation.departures.map((row) => (
                <motion.div
                  key={row.number}
                  variants={{
                    hidden: { rotateX: 90, opacity: 0 },
                    visible: { rotateX: 0, opacity: 1 }
                  }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-3 rounded-xl border border-amber-500/5 bg-slate-900/40 px-3.5 py-3 hover:bg-slate-900/60 hover:border-amber-500/20 transition-all items-center text-xs leading-relaxed"
                >
                  {/* Train number */}
                  <div className="col-span-1 sm:col-span-2 font-bold text-amber-400">
                    {row.number}
                  </div>

                  {/* Train name */}
                  <div className="col-span-2 sm:col-span-3 font-semibold text-slate-100 truncate uppercase">
                    {row.name}
                  </div>

                  {/* Destination */}
                  <div className="col-span-2 sm:col-span-3 text-slate-350 truncate uppercase flex items-center gap-1">
                    <span className="sm:hidden text-amber-500/45">➔</span>
                    {row.destination}
                  </div>

                  {/* Time */}
                  <div className="col-span-1 sm:col-span-1 text-left sm:text-center text-amber-400 font-bold">
                    {row.time}
                  </div>

                  {/* Platform */}
                  <div className="col-span-1 sm:col-span-1 text-center text-slate-100 font-bold bg-slate-950 border border-amber-500/10 rounded-md py-0.5 max-w-[28px] mx-auto">
                    {row.platform}
                  </div>

                  {/* Status */}
                  <div className={cn("col-span-2 sm:col-span-2 text-right font-black tracking-wider uppercase", row.statusColor)}>
                    {row.status}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 p-3.5 text-xs text-amber-600 dark:text-amber-400">
        <Info className="h-4 w-4 flex-shrink-0 animate-bounce" />
        <p className="leading-normal font-medium">
          <strong>Notice:</strong> High monsoon rainfall across Central India may cause minor platform rescheduling. Double-check audio announcements at the station.
        </p>
      </div>
    </div>
  );
}
