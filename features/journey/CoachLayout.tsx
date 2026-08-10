'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, HelpCircle, Armchair } from 'lucide-react';
import { cn } from '@/utils/cn';

type CoachClass = 'SL' | '3AC' | '2AC' | '1AC' | 'CC';

interface Seat {
  number: number;
  type: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window' | 'Aisle';
  isSide: boolean;
  status: 'available' | 'occupied' | 'selected';
}

export function CoachLayout() {
  const [selectedClass, setSelectedClass] = useState<CoachClass>('3AC');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Generate seats based on coach class
  const seats: Seat[] = useMemo(() => {
    const list: Seat[] = [];
    
    if (selectedClass === 'SL' || selectedClass === '3AC') {
      // 8 berths per compartment layout, total 72 berths
      for (let i = 1; i <= 72; i++) {
        const rem = i % 8;
        let type: Seat['type'] = 'Lower';
        let isSide = false;
        
        if (rem === 1 || rem === 2) type = 'Lower';
        else if (rem === 3 || rem === 4) type = 'Middle';
        else if (rem === 5 || rem === 6) type = 'Upper';
        else if (rem === 7) { type = 'Side Lower'; isSide = true; }
        else { type = 'Side Upper'; isSide = true; }
        
        // Randomise seat availability status
        const status: Seat['status'] = i === 12 || i === 25 || i === 36 || i === 58 ? 'occupied' : 'available';
        list.push({ number: i, type, isSide, status });
      }
    } else if (selectedClass === '2AC') {
      // 6 berths per compartment layout, total 48 berths
      for (let i = 1; i <= 48; i++) {
        const rem = i % 6;
        let type: Seat['type'] = 'Lower';
        let isSide = false;
        
        if (rem === 1 || rem === 2) type = 'Lower';
        else if (rem === 3 || rem === 4) type = 'Upper';
        else if (rem === 5) { type = 'Side Lower'; isSide = true; }
        else { type = 'Side Upper'; isSide = true; }
        
        const status: Seat['status'] = i === 8 || i === 18 || i === 32 ? 'occupied' : 'available';
        list.push({ number: i, type, isSide, status });
      }
    } else if (selectedClass === '1AC') {
      // Coupe / Cabin layout: Cabin has 4 berths, Coupe has 2 berths. Let's make 24 berths total.
      for (let i = 1; i <= 24; i++) {
        const rem = i % 4;
        let type: Seat['type'] = rem === 1 || rem === 2 ? 'Lower' : 'Upper';
        const status: Seat['status'] = i === 4 || i === 15 ? 'occupied' : 'available';
        list.push({ number: i, type, isSide: false, status });
      }
    } else if (selectedClass === 'CC') {
      // Chair Car: 3x2 rows of seats, total 75 seats
      for (let i = 1; i <= 75; i++) {
        const rem = i % 5;
        let type: Seat['type'] = 'Window';
        if (rem === 0 || rem === 1) type = 'Window';
        else if (rem === 3) type = 'Aisle';
        else type = 'Aisle'; // or Middle
        
        const status: Seat['status'] = i === 5 || i === 14 || i === 22 || i === 45 || i === 67 ? 'occupied' : 'available';
        list.push({ number: i, type, isSide: false, status });
      }
    }
    
    return list;
  }, [selectedClass]);

  // Handle seat search
  const foundSeatIndex = useMemo(() => {
    const num = parseInt(searchQuery, 10);
    if (isNaN(num)) return -1;
    return seats.findIndex((s) => s.number === num);
  }, [searchQuery, seats]);

  // Segment seats into bays / cabins for rendering (e.g. 8 per bay for 3AC/SL, 6 for 2AC, 4 for 1AC, 5 for CC)
  const bays = useMemo(() => {
    const bayList: Seat[][] = [];
    const size = selectedClass === 'SL' || selectedClass === '3AC' ? 8 : selectedClass === '2AC' ? 6 : selectedClass === '1AC' ? 4 : 5;
    for (let i = 0; i < seats.length; i += size) {
      bayList.push(seats.slice(i, i + size));
    }
    return bayList;
  }, [seats, selectedClass]);

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
      {/* Tab Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Armchair className="h-5 w-5 text-rail-blue animate-pulse" />
            Interactive Coach Seat Layout
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View seating configuration, check seat berths, and find seat locations.
          </p>
        </div>

        {/* Search */}
        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 w-full sm:w-44">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seat #..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Class Selector Selector */}
      <div className="flex flex-wrap gap-2">
        {(['SL', '3AC', '2AC', '1AC', 'CC'] as CoachClass[]).map((cls) => (
          <button
            key={cls}
            onClick={() => {
              setSelectedClass(cls);
              setSelectedSeat(null);
              setSearchQuery('');
            }}
            className={cn(
              'rounded-xl px-4 py-2 text-xs font-bold transition-all',
              selectedClass === cls
                ? 'bg-rail-blue text-white shadow-glow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
            )}
          >
            {cls === 'SL' && 'Sleeper (SL)'}
            {cls === '3AC' && 'AC 3 Tier (3AC)'}
            {cls === '2AC' && 'AC 2 Tier (2AC)'}
            {cls === '1AC' && 'AC 1st Class (1AC)'}
            {cls === 'CC' && 'AC Chair Car (CC)'}
          </button>
        ))}
      </div>

      {/* Coach Layout Display */}
      <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-900/10 dark:bg-slate-950/20 rounded-3xl p-6 overflow-x-auto scrollbar-thin">
        <div className="min-w-[850px] flex items-center gap-1.5 relative py-8">
          
          {/* Coach Front Ends (Restroom, Door) */}
          <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 rounded-l-2xl px-4 py-8 items-center border border-slate-350 dark:border-slate-700 w-16 text-center text-[10px] font-bold text-slate-500 flex-shrink-0">
            <span>🚪 Door</span>
            <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-700 my-2" />
            <span>🚾 Toilet</span>
          </div>

          {/* Bays Loop */}
          <div className="flex items-stretch gap-6 flex-1 bg-slate-50 dark:bg-slate-900/30 rounded-2xl p-4 border border-dashed border-slate-250 dark:border-slate-850">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedClass}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-8"
              >
                {bays.slice(0, 8).map((bay, bayIdx) => (
                  <div key={bayIdx} className="relative flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 pr-6 last:border-0 last:pr-0">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Bay {bayIdx + 1}
                    </span>

                    {/* Standard Sleeper/AC Bay Rendering (SL / 3AC / 2AC) */}
                    {(selectedClass === 'SL' || selectedClass === '3AC' || selectedClass === '2AC') && (
                      <div className="space-y-6">
                        {/* Upper row: Main Compartment Cabin Seats (Left to Right) */}
                        <div className="flex gap-2.5">
                          {bay.filter(s => !s.isSide).map((seat) => {
                            const isSearched = seats[foundSeatIndex]?.number === seat.number;
                            const isSelected = selectedSeat?.number === seat.number;
                            return (
                              <button
                                key={seat.number}
                                onClick={() => setSelectedSeat(seat)}
                                className={cn(
                                  "relative flex flex-col items-center justify-center h-12 w-10 rounded-lg text-xs font-mono font-bold transition-all border",
                                  seat.status === 'occupied'
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                    : isSearched
                                    ? "bg-amber-400 border-amber-500 text-slate-900 ring-4 ring-amber-500/30 animate-pulseScale"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350"
                                )}
                              >
                                {seat.number}
                                <span className="text-[7px] block font-sans scale-90 font-medium">
                                  {seat.type[0]}L
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Lower row: Side Berths (Side Lower, Side Upper) */}
                        <div className="flex gap-3 justify-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
                          {bay.filter(s => s.isSide).map((seat) => {
                            const isSearched = seats[foundSeatIndex]?.number === seat.number;
                            const isSelected = selectedSeat?.number === seat.number;
                            return (
                              <button
                                key={seat.number}
                                onClick={() => setSelectedSeat(seat)}
                                className={cn(
                                  "relative flex flex-col items-center justify-center h-10 w-14 rounded-lg text-xs font-mono font-bold transition-all border",
                                  seat.status === 'occupied'
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                    : isSearched
                                    ? "bg-amber-400 border-amber-500 text-slate-900 ring-4 ring-amber-500/30 animate-pulseScale"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350"
                                )}
                              >
                                {seat.number}
                                <span className="text-[7px] block font-sans scale-90 font-medium">
                                  Side {seat.type === 'Side Lower' ? 'L' : 'U'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 1AC Coupe Cabin Rendering */}
                    {selectedClass === '1AC' && (
                      <div className="flex flex-col gap-4">
                        {/* 4 seats arranged in cabin grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {bay.map((seat) => {
                            const isSearched = seats[foundSeatIndex]?.number === seat.number;
                            const isSelected = selectedSeat?.number === seat.number;
                            return (
                              <button
                                key={seat.number}
                                onClick={() => setSelectedSeat(seat)}
                                className={cn(
                                  "relative flex flex-col items-center justify-center h-11 w-11 rounded-lg text-xs font-mono font-bold transition-all border",
                                  seat.status === 'occupied'
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                    : isSearched
                                    ? "bg-amber-400 border-amber-500 text-slate-900 ring-4 ring-amber-500/30 animate-pulseScale"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350"
                                )}
                              >
                                {seat.number}
                                <span className="text-[7px] block font-sans scale-90 font-medium">
                                  {seat.type}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* AC Chair Car Seating Row */}
                    {selectedClass === 'CC' && (
                      <div className="flex flex-col gap-2">
                        {/* 3x2 rows arrangement */}
                        <div className="flex gap-1">
                          {/* Left side 3 seats */}
                          {bay.slice(0, 3).map((seat) => {
                            const isSearched = seats[foundSeatIndex]?.number === seat.number;
                            const isSelected = selectedSeat?.number === seat.number;
                            return (
                              <button
                                key={seat.number}
                                onClick={() => setSelectedSeat(seat)}
                                className={cn(
                                  "relative flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-mono font-bold border transition-all",
                                  seat.status === 'occupied'
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                    : isSearched
                                    ? "bg-amber-400 border-amber-500 text-slate-900 ring-4 ring-amber-500/30 animate-pulseScale"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350"
                                )}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                        </div>
                        {/* Gangway aisle indicator */}
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-850 rounded text-center text-[7px] text-slate-400 font-bold uppercase tracking-widest select-none">
                          aisle
                        </div>
                        <div className="flex gap-1 justify-center">
                          {/* Right side 2 seats */}
                          {bay.slice(3, 5).map((seat) => {
                            const isSearched = seats[foundSeatIndex]?.number === seat.number;
                            const isSelected = selectedSeat?.number === seat.number;
                            return (
                              <button
                                key={seat.number}
                                onClick={() => setSelectedSeat(seat)}
                                className={cn(
                                  "relative flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-mono font-bold border transition-all",
                                  seat.status === 'occupied'
                                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                    : isSearched
                                    ? "bg-amber-400 border-amber-500 text-slate-900 ring-4 ring-amber-500/30 animate-pulseScale"
                                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350"
                                )}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Coach Back End */}
          <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 rounded-r-2xl px-4 py-8 items-center border border-slate-350 dark:border-slate-700 w-16 text-center text-[10px] font-bold text-slate-500 flex-shrink-0">
            <span>🚾 Toilet</span>
            <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-700 my-2" />
            <span>🚪 Exit</span>
          </div>

        </div>
      </div>

      {/* Legend & Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Legend */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-rail-blue" />
            Berth Map Legend
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-slate-100 dark:bg-slate-800 border border-slate-350 dark:border-slate-700 rounded" />
              <span className="text-slate-500">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-rose-500/20 border border-rose-500/40 rounded" />
              <span className="text-slate-500">Booked / Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-rail-blue border border-rail-blue rounded" />
              <span className="text-slate-500">Selected Seat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-amber-400 border border-amber-500 rounded animate-pulse" />
              <span className="text-slate-500">Searched Seat Match</span>
            </div>
          </div>
        </div>

        {/* Selected Seat Stats */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedSeat ? (
              <motion.div
                key={selectedSeat.number}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400"
              >
                <div className="flex justify-between items-center pb-1 border-b border-slate-150 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Seat Detail Profile</span>
                  <span className="rounded bg-rail-blue/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rail-blue">
                    SEAT #{selectedSeat.number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Berth Type:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedSeat.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedSeat.isSide ? 'Side Aisle Segment' : 'Compartment Cabin'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Code:</span>
                  <span className="font-mono text-slate-850 dark:text-slate-200">
                    {selectedClass}-{selectedSeat.number}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-xs text-slate-450 dark:text-slate-500 space-y-1 py-3">
                <HelpCircle className="h-5 w-5 mx-auto text-slate-400" />
                <p>Click on any seat to view layout metadata.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
