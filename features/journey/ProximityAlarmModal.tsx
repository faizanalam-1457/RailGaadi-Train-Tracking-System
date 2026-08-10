'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, VolumeX } from 'lucide-react';

interface ProximityAlarmModalProps {
  isOpen: boolean;
  stationName: string;
  stationCode: string;
  onClose: () => void;
}

export function ProximityAlarmModal({
  isOpen,
  stationName,
  stationCode,
  onClose,
}: ProximityAlarmModalProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play alarm sound using Web Audio API when open
  useEffect(() => {
    if (!isOpen) {
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
        oscillatorIntervalRef.current = null;
      }
      return;
    }

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Play double-beep every 1.2 seconds
      const playBeep = () => {
        if (!ctx || ctx.state === 'suspended') return;

        const time = ctx.currentTime;
        
        // Beep 1
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, time); // A5 note
        gain1.gain.setValueAtTime(0.3, time);
        gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(time);
        osc1.stop(time + 0.2);

        // Beep 2
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, time + 0.25);
        gain2.gain.setValueAtTime(0.3, time + 0.25);
        gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(time + 0.25);
        osc2.stop(time + 0.45);
      };

      // Play initial beep
      playBeep();
      // Loop
      oscillatorIntervalRef.current = setInterval(playBeep, 1200);
    } catch (e) {
      console.warn('AudioContext failed to initialize (interaction required):', e);
    }

    return () => {
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
        oscillatorIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-900 text-white p-6 shadow-glow text-center"
          >
            {/* Warning Glows */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Pulsating Bell Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-6 relative">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-amber-500/5"
              />
              <motion.div
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <BellRing className="h-10 w-10" />
              </motion.div>
            </div>

            {/* Details */}
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 font-mono text-xs font-bold text-amber-400">
              STATION PROXIMITY ALARM
            </span>

            <h3 className="mt-4 text-2xl font-black text-slate-100">
              Arriving at {stationName}!
            </h3>
            
            <p className="mt-2 text-sm text-slate-400">
              The train is approaching <strong className="text-slate-200">{stationName} ({stationCode})</strong>. Prepare for arrival and locate your luggage.
            </p>

            {/* Dismiss Button */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-slate-950 shadow-glow transition-all hover:bg-amber-400 active:scale-95"
              >
                <VolumeX className="h-4 w-4" />
                <span>Dismiss Alarm</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-850 hover:text-white transition-colors"
              >
                Snooze for 5 mins
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
