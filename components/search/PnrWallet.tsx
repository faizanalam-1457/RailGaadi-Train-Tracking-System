'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PnrTicket {
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  class: string;
  seat: string;
  passenger: string;
  status: string;
  boardingTime: Date;
}

const SAMPLE_PNR_DB: Record<string, PnrTicket> = {
  '432-1098765': {
    pnr: '432-1098765',
    trainNumber: '12952',
    trainName: 'MUMBAI RAJDHANI',
    fromCode: 'NDLS',
    fromName: 'NEW DELHI CENTRAL',
    toCode: 'MMCT',
    toName: 'MUMBAI CENTRAL',
    class: 'AC 3 Tier (3AC)',
    seat: 'B2 / Berth 32 (Lower)',
    passenger: 'Sample Passenger',
    status: 'CNF (CONFIRMED)',
    boardingTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000 + 15 * 60 * 1000),
  },
  '224-3654321': {
    pnr: '224-3654321',
    trainNumber: '22436',
    trainName: 'VANDE BHARAT EXP',
    fromCode: 'NDLS',
    fromName: 'NEW DELHI CENTRAL',
    toCode: 'BSB',
    toName: 'VARANASI JUNCTION',
    class: 'AC Chair Car (CC)',
    seat: 'C4 / Seat 12 (Window)',
    passenger: 'Sample Passenger',
    status: 'CNF (CONFIRMED)',
    boardingTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000 + 30 * 60 * 1000),
  },
};

export function PnrWallet() {
  const [pnrInput, setPnrInput] = useState('');
  const [activeTicket, setActiveTicket] = useState<PnrTicket | null>(null);
  const [pnrError, setPnrError] = useState(false);
  const [countdownStr, setCountdownStr] = useState('');

  useEffect(() => {
    if (!activeTicket) return;

    const tick = () => {
      const diff = activeTicket.boardingTime.getTime() - new Date().getTime();
      if (diff <= 0) {
        setCountdownStr('DEPARTED / BOARDING CLOSED');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownStr(`${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activeTicket]);

  const handlePnrSearch = (val?: string) => {
    setPnrError(false);
    const target = (val || pnrInput).trim();
    if (!target) return;

    if (SAMPLE_PNR_DB[target]) {
      setActiveTicket(SAMPLE_PNR_DB[target]);
    } else {
      setPnrError(true);
    }
  };

  return (
    <div id="pnr-wallet" className="space-y-6">
      {!activeTicket ? (
        <div className="max-w-md mx-auto space-y-4 text-center py-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Load Digital PNR Boarding Ticket</h4>
            <p className="text-xs text-slate-500">Enter a PNR number to simulate a digital boarding pass.</p>
          </div>

          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-1.5 border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="Enter PNR (e.g. 432-1098765)..."
              className="w-full bg-transparent text-xs outline-none px-3 font-semibold text-slate-800 dark:text-slate-200"
            />
            <button
              onClick={() => handlePnrSearch()}
              className="rounded-lg bg-rail-blue px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition-colors"
            >
              Simulate
            </button>
          </div>

          {pnrError && (
            <p className="text-[11px] font-semibold text-rose-500">
              ⚠️ PNR not found in simulation database. Try one of the presets below.
            </p>
          )}

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulation Presets</span>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setPnrInput('432-1098765');
                  handlePnrSearch('432-1098765');
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                🎫 PNR 432-1098765 (Rajdhani)
              </button>

              <button
                onClick={() => {
                  setPnrInput('224-3654321');
                  handlePnrSearch('224-3654321');
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all"
              >
                🎫 PNR 224-3654321 (Vande Bharat)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl mx-auto border border-slate-700 bg-slate-900 text-white rounded-3xl overflow-hidden shadow-glow grid grid-cols-1 md:grid-cols-12 relative"
        >
          <div className="md:col-span-8 p-6 md:p-8 space-y-6 md:border-r md:border-dashed md:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-rail-blue animate-pulse" />
                <span className="font-extrabold text-xs uppercase tracking-widest text-slate-300">BOARDING PASS</span>
              </div>
              <span className="font-mono text-xs text-rail-cyan font-bold bg-rail-cyan/10 px-2 py-0.5 rounded border border-rail-cyan/25">
                PNR: {activeTicket.pnr}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BOARDING STATION</span>
                <h4 className="text-lg font-black text-slate-100">{activeTicket.fromCode}</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{activeTicket.fromName}</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DIRECT SECTOR</span>
                <div className="w-full flex items-center justify-center relative">
                  <div className="h-0.5 bg-slate-800 flex-1" />
                  <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs select-none">
                    🚄
                  </div>
                  <div className="h-0.5 bg-slate-800 flex-1" />
                </div>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DESTINATION</span>
                <h4 className="text-lg font-black text-slate-100">{activeTicket.toCode}</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{activeTicket.toName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">PASSENGER NAME</span>
                <p className="font-bold text-xs text-slate-100">{activeTicket.passenger}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">COACH / SEAT ALLOCATION</span>
                <p className="font-mono font-bold text-xs text-rail-cyan">{activeTicket.seat}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">TRAVELLING CLASS</span>
                <p className="font-semibold text-xs text-slate-300">{activeTicket.class}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">BOOKING STATUS</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {activeTicket.status}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-slate-950/40">
            <div className="text-center bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                BOARDING COUNTDOWN
              </span>
              <div className="font-mono text-base font-extrabold text-amber-500 animate-pulse font-black">
                {countdownStr || 'LOADING...'}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-14 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#38bdf8_2px,#38bdf8_6px)] opacity-70 relative flex items-center justify-center">
                <motion.div
                  animate={{ y: [-15, 35, -15] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                  className="absolute left-0 right-0 h-[2px] bg-rose-500 shadow-glow"
                />
              </div>
              <span className="font-mono text-[9px] text-slate-500 tracking-wider">IRCTC-PASS-SECURE</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  href={`/train/${activeTicket.trainNumber}`}
                  className="flex items-center justify-center rounded-xl bg-rail-blue py-2 text-[10px] font-bold text-white hover:bg-sky-600 transition-all"
                >
                  Track Live
                </Link>
                <Link
                  href={`/train/${activeTicket.trainNumber}?tab=coach`}
                  className="flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-[10px] font-bold text-slate-200 transition-all border border-slate-700/60"
                >
                  Seat Layout
                </Link>
              </div>
              <button
                onClick={() => {
                  setActiveTicket(null);
                  setPnrInput('');
                }}
                className="text-[9px] font-bold text-slate-500 hover:text-rose-500 transition-colors w-full text-center block pt-1.5 uppercase tracking-wider"
              >
                Eject Pass
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
