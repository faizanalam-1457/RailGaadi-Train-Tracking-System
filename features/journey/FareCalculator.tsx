'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Calculator, Ticket, HelpCircle, Receipt } from 'lucide-react';
import { Station } from '@/types/train';
import { cn } from '@/utils/cn';

interface FareCalculatorProps {
  stations: Station[];
}

type ClassRate = {
  label: string;
  perKm: number;
  reservation: number;
  superfast: number;
  gst: boolean;
};

const CLASS_CONFIGS: Record<string, ClassRate> = {
  SL: { label: 'Sleeper (SL)', perKm: 0.65, reservation: 20, superfast: 30, gst: false },
  '3AC': { label: 'AC 3 Tier (3AC)', perKm: 1.55, reservation: 40, superfast: 45, gst: true },
  '2AC': { label: 'AC 2 Tier (2AC)', perKm: 2.25, reservation: 50, superfast: 45, gst: true },
  '1AC': { label: 'AC First Class (1AC)', perKm: 3.65, reservation: 60, superfast: 75, gst: true },
  CC: { label: 'AC Chair Car (CC)', perKm: 1.15, reservation: 40, superfast: 45, gst: true },
};

export function FareCalculator({ stations }: FareCalculatorProps) {
  const [startCode, setStartCode] = useState(stations[0]?.code || '');
  const [endCode, setEndCode] = useState(stations[stations.length - 1]?.code || '');
  const [travelClass, setTravelClass] = useState<'SL' | '3AC' | '2AC' | '1AC' | 'CC'>('3AC');
  const [isBooked, setIsBooked] = useState(false);

  // Find selected stations
  const startStation = useMemo(() => stations.find(s => s.code === startCode), [stations, startCode]);
  const endStation = useMemo(() => stations.find(s => s.code === endCode), [stations, endCode]);

  // Distance calculation
  const distanceKm = useMemo(() => {
    if (!startStation || !endStation) return 0;
    return Math.max(0, endStation.distanceKm - startStation.distanceKm);
  }, [startStation, endStation]);

  const isValidRoute = useMemo(() => {
    if (!startStation || !endStation) return false;
    return endStation.distanceKm > startStation.distanceKm;
  }, [startStation, endStation]);

  // Pricing math
  const fareBreakdown = useMemo(() => {
    const config = CLASS_CONFIGS[travelClass];
    if (distanceKm <= 0 || !isValidRoute) {
      return { base: 0, reservation: 0, superfast: 0, gst: 0, total: 0 };
    }

    const base = Math.round(distanceKm * config.perKm);
    const reservation = config.reservation;
    const superfast = config.superfast;
    const subtotal = base + reservation + superfast;
    const gst = config.gst ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + gst;

    return { base, reservation, superfast, gst, total };
  }, [distanceKm, travelClass, isValidRoute]);

  const handleBookMock = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calculator className="h-5 w-5 text-rail-blue animate-pulse" />
          Interactive Fare Estimator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compute point-to-point travel costs, surcharges, and taxes instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Source Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source Station</label>
          <select
            value={startCode}
            onChange={(e) => setStartCode(e.target.value)}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-rail-blue"
          >
            {stations.map((st) => (
              <option key={'start-' + st.code} value={st.code}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
        </div>

        {/* Destination Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination Station</label>
          <select
            value={endCode}
            onChange={(e) => setEndCode(e.target.value)}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-rail-blue"
          >
            {stations.map((st) => (
              <option key={'end-' + st.code} value={st.code}>
                {st.name} ({st.code})
              </option>
            ))}
          </select>
        </div>

        {/* Coach Class */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coach Class</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value as any)}
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-rail-blue"
          >
            {Object.keys(CLASS_CONFIGS).map((key) => (
              <option key={key} value={key}>
                {CLASS_CONFIGS[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification warning if route is backwards */}
      {!isValidRoute && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-600 dark:text-amber-400 font-medium">
          ⚠️ Invalid Journey: The Destination Station must come after the Source Station on this route. Please reselect.
        </div>
      )}

      {/* Animated Folding Ticket Receipt */}
      <AnimatePresence>
        {isValidRoute && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 space-y-4">
              
              {/* Ticket Top Jagged Edge */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_bottom,#ffffff_4px,transparent_4px)] dark:bg-[radial-gradient(circle_at_bottom,#0f172a_4px,transparent_4px)] bg-repeat-x bg-[length:12px_8px] -translate-y-0.5" />

              <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-rail-blue" />
                  Fare Breakup Details
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Distance: {distanceKm} km
                </span>
              </div>

              {/* Itemized list */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Fare ({distanceKm} km × Rate):</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5" /> {fareBreakdown.base}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Reservation Charge:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5" /> {fareBreakdown.reservation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Superfast Surcharge:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <IndianRupee className="h-3 w-3 mr-0.5" /> {fareBreakdown.superfast}
                  </span>
                </div>

                {fareBreakdown.gst > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Tax (GST 5%):</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      <IndianRupee className="h-3 w-3 mr-0.5" /> {fareBreakdown.gst}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">Estimated Total Fare:</span>
                  <span className="font-mono text-rail-blue text-base flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-0.5" /> {fareBreakdown.total}
                  </span>
                </div>
              </div>

              {/* Book Ticket simulator button */}
              <div className="pt-2">
                <button
                  onClick={handleBookMock}
                  disabled={isBooked}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all shadow-glow text-white",
                    isBooked
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                      : "bg-rail-blue hover:bg-sky-600"
                  )}
                >
                  <Ticket className="h-4 w-4" />
                  <span>{isBooked ? 'Booking Confirmed! (Simulated)' : 'Simulate Booking Checkout'}</span>
                </button>
              </div>

              {/* Ticket Bottom Jagged Edge */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[radial-gradient(circle_at_top,#ffffff_4px,transparent_4px)] dark:bg-[radial-gradient(circle_at_top,#0f172a_4px,transparent_4px)] bg-repeat-x bg-[length:12px_8px] translate-y-0.5" />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
