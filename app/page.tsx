'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Train, ArrowRight, Sparkles, Clock, History, MapPin, Zap,
  Search, Loader2, AlertCircle, X, Star, HelpCircle, Ticket, ArrowDownRight, Compass, ShieldCheck
} from 'lucide-react';
import { useTrainSearch } from '@/hooks/useTrainSearch';
import { useSearchStore } from '@/store/search';
import { useFavoritesStore } from '@/store/favorites';
import { SearchResult } from '@/types/train';
import { cn } from '@/utils/cn';
import { RailNetworkMesh } from '@/components/search/RailNetworkMesh';
import { StationBoard } from '@/components/search/StationBoard';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

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

const MOCK_PNR_DB: Record<string, PnrTicket> = {
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
    passenger: 'Faizan Alam',
    status: 'CNF (CONFIRMED)',
    boardingTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2h 15m from now
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
    passenger: 'Faizan Alam',
    status: 'CNF (CONFIRMED)',
    boardingTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000 + 30 * 60 * 1000), // 4h 30m from now
  }
};

export default function HomePage() {
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const { favorites } = useFavoritesStore();

  const [inputValue, setInputValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Dashboard states
  const [dashboardTab, setDashboardTab] = useState<'recents' | 'favorites' | 'pnr'>('recents');
  const [pnrInput, setPnrInput] = useState('');
  const [activePnrTicket, setActivePnrTicket] = useState<PnrTicket | null>(null);
  const [pnrError, setPnrError] = useState(false);
  const [countdownStr, setCountdownStr] = useState('');

  const debouncedQuery = useDebounce(inputValue, 350);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading, isError } = useTrainSearch(debouncedQuery);

  // Reset focus index when results update
  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchResults]);

  // Keyboard ⌘K focus shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
        setIsFocused(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Real-time Countdown Timer effect for active PNR
  useEffect(() => {
    if (!activePnrTicket) return;

    const tick = () => {
      const diff = activePnrTicket.boardingTime.getTime() - new Date().getTime();
      if (diff <= 0) {
        setCountdownStr('DEPARTED / BOARDING CLOSED');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hPad = String(hours).padStart(2, '0');
        const mPad = String(mins).padStart(2, '0');
        const sPad = String(secs).padStart(2, '0');
        setCountdownStr(`${hPad}h ${mPad}m ${sPad}s`);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activePnrTicket]);

  const handleSelect = (train: SearchResult) => {
    addRecentSearch(train);
    setIsSearchOpen(false);
    setIsFocused(false);
    setInputValue('');
    router.push(`/train/${train.number}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) =>
        Math.min(prev + 1, (searchResults?.length || 0) - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && searchResults?.[focusedIndex]) {
        handleSelect(searchResults[focusedIndex]);
      } else if (inputValue.trim()) {
        const first = searchResults?.[0];
        if (first) handleSelect(first);
        else router.push(`/train/${inputValue.trim()}`);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handlePnrSearch = (val?: string) => {
    setPnrError(false);
    const target = (val || pnrInput).trim();
    if (!target) return;

    if (MOCK_PNR_DB[target]) {
      setActivePnrTicket(MOCK_PNR_DB[target]);
    } else {
      setPnrError(true);
    }
  };

  const showDropdown = isSearchOpen && (inputValue || debouncedQuery);

  return (
    <div className="space-y-12 py-4 relative">
      
      {/* Dim Overlay when Search is focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsFocused(false);
              setIsSearchOpen(false);
              inputRef.current?.blur();
            }}
            className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-[2px] z-40 transition-all duration-300"
          />
        )}
      </AnimatePresence>

      {/* ─── Hero Columns Layout ─────────────────────────────────────────── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-gradient-to-b from-sky-500/10 via-background to-background p-6 md:p-12 border border-sky-500/20 shadow-glass">
        
        {/* Left Side: Title & Search bar (col-span 7) */}
        <div className="lg:col-span-7 space-y-6 text-left relative z-50">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Indian Railways Radar Intelligence</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Track Any Train in <span className="text-rail-blue">Real-time.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-655 dark:text-slate-300 leading-relaxed max-w-xl">
            Vector mapping, mechanical station boards, delay histories, elevation profile charts, and meal ordering simulators in a single tracking panel.
          </p>

          {/* ─── Search Input ─── */}
          <div className="relative max-w-xl text-left">
            {/* Input wrapper */}
            <div
              className={cn(
                'glass-panel flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-glass transition-all duration-300 border bg-background/80',
                isFocused ? 'border-rail-blue/60 shadow-glow ring-2 ring-rail-blue/15' : 'border-slate-200 dark:border-slate-800'
              )}
            >
              {isLoading && inputValue ? (
                <Loader2 className="h-5 w-5 flex-shrink-0 text-rail-blue animate-spin" />
              ) : (
                <Search className="h-5 w-5 flex-shrink-0 text-slate-400" />
              )}

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsSearchOpen(true);
                  setIsFocused(true);
                }}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setIsFocused(true);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter train number (12951) or name (Rajdhani)..."
                className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
              />

              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    setIsSearchOpen(false);
                    setFocusedIndex(-1);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 flex-shrink-0">
                ⌘ K
              </kbd>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-2 z-50 max-h-[360px] overflow-y-auto rounded-2xl glass-panel p-3 shadow-glass-hover border border-slate-250 dark:border-slate-800 bg-background"
                >
                  {/* Error */}
                  {isError && (
                    <div className="flex items-center gap-2 py-4 text-center justify-center text-xs text-rose-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>Error loading trains. Please try again.</span>
                    </div>
                  )}

                  {/* Loading */}
                  {isLoading && !searchResults && (
                    <div className="space-y-2 py-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {!isLoading && !isError && searchResults && searchResults.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No trains found. Try a train number like <strong>12951</strong> or name like <strong>Rajdhani</strong>.
                    </div>
                  )}

                  {/* Direct search */}
                  {inputValue && /^\d{4,5}$/.test(inputValue.trim()) && (
                    <button
                      onClick={() => router.push(`/train/${inputValue.trim()}`)}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 bg-rail-blue/10 text-rail-blue text-xs font-bold hover:bg-rail-blue hover:text-white transition-all"
                    >
                      <Train className="h-4 w-4" />
                      <span>Track train #{inputValue.trim()} live →</span>
                    </button>
                  )}

                  {/* results mapping */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 pb-1">
                        Matching Trains
                      </p>
                      {searchResults.map((train, idx) => {
                        const isFocusedItem = idx === focusedIndex;
                        return (
                          <button
                            key={train.id}
                            onClick={() => handleSelect(train)}
                            className={cn(
                              "w-full glass-panel group flex items-center justify-between rounded-xl p-3 transition-all duration-150 text-left border",
                              isFocusedItem
                                ? "bg-rail-blue border-rail-blue text-white shadow-glow"
                                : "hover:bg-rail-blue/5 hover:border-rail-blue/30"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={cn(
                                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors",
                                isFocusedItem
                                  ? "bg-white/20 text-white"
                                  : "bg-rail-blue/10 text-rail-blue group-hover:bg-rail-blue group-hover:text-white"
                              )}>
                                <Train className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={cn(
                                    "rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold flex-shrink-0",
                                    isFocusedItem
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-100 text-slate-755 dark:bg-slate-800 dark:text-slate-200"
                                  )}>
                                    {train.number}
                                  </span>
                                  <span className={cn(
                                    "font-semibold text-sm truncate",
                                    isFocusedItem ? "text-white" : "text-slate-900 dark:text-white"
                                  )}>
                                    {train.name}
                                  </span>
                                </div>
                                {(train.origin.name || train.destination.name) && (
                                  <div className={cn(
                                    "mt-0.5 flex items-center gap-1.5 text-[11px] truncate",
                                    isFocusedItem ? "text-white/80" : "text-slate-500"
                                  )}>
                                    <span>{train.origin.name} ({train.origin.code})</span>
                                    <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
                                    <span>{train.destination.name} ({train.destination.code})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight className={cn(
                              "h-4 w-4 flex-shrink-0 transition-all",
                              isFocusedItem
                                ? "text-white translate-x-0.5"
                                : "text-slate-400 group-hover:text-rail-blue group-hover:translate-x-0.5"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Search:</span>
            {['12951', '22436', '12301', '12621'].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setInputValue(num);
                  setIsSearchOpen(true);
                  setIsFocused(true);
                  inputRef.current?.focus();
                }}
                className="rounded-lg bg-slate-200/70 dark:bg-slate-800/70 px-2.5 py-1 font-mono font-semibold text-slate-700 dark:text-slate-355 hover:bg-rail-blue hover:text-white transition-colors"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Glowing SVG Mesh (col-span 5) */}
        <div className="hidden lg:block lg:col-span-5 h-[400px]">
          <RailNetworkMesh />
        </div>
      </section>

      {/* ─── Dashboard Section: Favorites, Recents, and PNR Wallet ───────── */}
      <section className="glass-panel rounded-3xl p-6 shadow-glass space-y-6">
        
        {/* Tab Header Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
            <button
              onClick={() => setDashboardTab('recents')}
              className={cn(
                'relative rounded-lg px-4 py-2 text-xs font-bold transition-all',
                dashboardTab === 'recents' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-505'
              )}
            >
              <div className="flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span>Recents ({recentSearches.length})</span>
              </div>
            </button>

            <button
              onClick={() => setDashboardTab('favorites')}
              className={cn(
                'relative rounded-lg px-4 py-2 text-xs font-bold transition-all',
                dashboardTab === 'favorites' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-505'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                <span>Favorites ({favorites.length})</span>
              </div>
            </button>

            <button
              onClick={() => setDashboardTab('pnr')}
              className={cn(
                'relative rounded-lg px-4 py-2 text-xs font-bold transition-all',
                dashboardTab === 'pnr' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-505'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Ticket className="h-3.5 w-3.5" />
                <span>PNR Wallet</span>
              </div>
            </button>
          </div>

          {dashboardTab === 'recents' && recentSearches.length > 0 && (
            <button
              onClick={clearRecentSearches}
              className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear Recents
            </button>
          )}
        </div>

        {/* Tab Panels */}
        <div>
          <AnimatePresence mode="wait">
            {/* 1. Recents Tab Panel */}
            {dashboardTab === 'recents' && (
              <motion.div
                key="tab-recents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {recentSearches.length > 0 ? (
                  recentSearches.map((train) => (
                    <Link
                      key={'recent-' + train.id}
                      href={`/train/${train.number}`}
                      className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glass-hover bg-slate-50/40 dark:bg-slate-900/10 border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue group-hover:bg-rail-blue group-hover:text-white transition-colors flex-shrink-0">
                          <Train className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] font-bold text-rail-blue block">#{train.number}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{train.name}</h4>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 group-hover:text-rail-blue transition-all" />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-xs text-slate-500">
                    No recent searches. Type a train number to get started.
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. Favorites Tab Panel */}
            {dashboardTab === 'favorites' && (
              <motion.div
                key="tab-favorites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {favorites.length > 0 ? (
                  favorites.map((train) => (
                    <Link
                      key={'fav-' + train.id}
                      href={`/train/${train.number}`}
                      className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glass-hover bg-slate-50/40 dark:bg-slate-900/10 border"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors flex-shrink-0">
                          <Star className="h-4.5 w-4.5 fill-amber-500/20" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] font-bold text-amber-500 block">#{train.number}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{train.name}</h4>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 group-hover:translate-x-0.5 group-hover:text-rail-blue transition-all" />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-xs text-slate-450 dark:text-slate-500 space-y-1">
                    <HelpCircle className="h-6 w-6 mx-auto text-slate-400" />
                    <p>No favorites saved yet.</p>
                    <p className="text-[10px] text-slate-400">Tap the Star icon on any train details page to bookmark it here.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. PNR Wallet Tab Panel (Digital Boarding pass Ticket) */}
            {dashboardTab === 'pnr' && (
              <motion.div
                key="tab-pnr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {!activePnrTicket ? (
                  /* Form to search / simulate PNR */
                  <div className="max-w-md mx-auto space-y-4 text-center py-6">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Load PNR Boarding Ticket</h4>
                      <p className="text-xs text-slate-500">Enter a 10-digit PNR to display a premium digital boarding pass.</p>
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
                        ⚠️ Sample PNR not found. Try one of the quick simulation presets below.
                      </p>
                    )}

                    {/* Presets */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Simulation Presets</span>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => {
                            setPnrInput('432-1098765');
                            handlePnrSearch('432-1098765');
                          }}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850 px-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-350 text-left transition-all"
                        >
                          🎫 PNR 432-1098765 (Rajdhani)
                        </button>

                        <button
                          onClick={() => {
                            setPnrInput('224-3654321');
                            handlePnrSearch('224-3654321');
                          }}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-850 px-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-355 text-left transition-all"
                        >
                          🎫 PNR 224-3654321 (Vande Bharat)
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Renders Premium Digital Boarding Pass Ticket */
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-3xl mx-auto border border-slate-250 dark:border-slate-800 bg-slate-900 text-white rounded-3xl overflow-hidden shadow-glow grid grid-cols-1 md:grid-cols-12 relative"
                  >
                    {/* Ticket punch marks (gaps) */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 h-6 w-3 bg-slate-50 dark:bg-slate-950 rounded-r-full border-r border-slate-250 dark:border-slate-800 z-10 pointer-events-none hidden md:block" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 h-6 w-3 bg-slate-50 dark:bg-slate-950 rounded-l-full border-l border-slate-250 dark:border-slate-800 z-10 pointer-events-none hidden md:block" />

                    {/* Left: Passenger and Train Details (col-span 8) */}
                    <div className="md:col-span-8 p-6 md:p-8 space-y-6 md:border-r md:border-dashed md:border-slate-700">
                      
                      {/* Brand & PNR */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-rail-blue animate-pulse" />
                          <span className="font-extrabold text-xs uppercase tracking-widest text-slate-300">
                            BOARDING PASS
                          </span>
                        </div>
                        <span className="font-mono text-xs text-rail-cyan font-bold bg-rail-cyan/10 px-2 py-0.5 rounded border border-rail-cyan/25">
                          PNR: {activePnrTicket.pnr}
                        </span>
                      </div>

                      {/* Station Route Details */}
                      <div className="flex items-center justify-between gap-4 py-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BOARDING STATION</span>
                          <h4 className="text-lg font-black text-slate-100">{activePnrTicket.fromCode}</h4>
                          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{activePnrTicket.fromName}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">DIRECT SECTOR</span>
                          <div className="w-full flex items-center justify-center relative">
                            <div className="h-0.5 bg-slate-800 flex-1" />
                            <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-xs select-none">
                              🚄
                            </div>
                            <div className="h-0.5 bg-slate-800 flex-1" />
                          </div>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DESTINATION</span>
                          <h4 className="text-lg font-black text-slate-100">{activePnrTicket.toCode}</h4>
                          <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{activePnrTicket.toName}</p>
                        </div>
                      </div>

                      {/* Ticket Passenger Details */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">PASSENGER NAME</span>
                          <p className="font-bold text-xs text-slate-100">{activePnrTicket.passenger}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">COACH / SEAT ALLOCATION</span>
                          <p className="font-mono font-bold text-xs text-rail-cyan">{activePnrTicket.seat}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">TRAVELLING CLASS</span>
                          <p className="font-semibold text-xs text-slate-300">{activePnrTicket.class}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">BOOKING STATUS</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {activePnrTicket.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Barcode scanner & Quick links (col-span 4) */}
                    <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-slate-950/40">
                      
                      {/* Countdown Box */}
                      <div className="text-center bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                          BOARDING COUNTDOWN
                        </span>
                        <div className="font-mono text-base font-extrabold text-amber-500 animate-pulse font-black">
                          {countdownStr || 'LOADING...'}
                        </div>
                      </div>

                      {/* Pulsing Scanner Barcode / QR Code representation */}
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="h-14 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#38bdf8_2px,#38bdf8_6px)] opacity-70 relative flex items-center justify-center">
                          {/* Pulsing scanning red line */}
                          <motion.div
                            animate={{ y: [-15, 35, -15] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                            className="absolute left-0 right-0 h-[2px] bg-rose-500 shadow-glow"
                          />
                        </div>
                        <span className="font-mono text-[9px] text-slate-500 tracking-wider">
                          IRCTC-PASS-SECURE
                        </span>
                      </div>

                      {/* Quick Shortcuts */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-1.5">
                          {/* Live Track */}
                          <Link
                            href={`/train/${activePnrTicket.trainNumber}`}
                            className="flex items-center justify-center gap-1 rounded-xl bg-rail-blue py-2 text-[10px] font-bold text-white hover:bg-sky-600 transition-all text-center"
                          >
                            <span>Track Live</span>
                          </Link>

                          {/* Seat map */}
                          <Link
                            href={`/train/${activePnrTicket.trainNumber}?tab=coach`}
                            className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-[10px] font-bold text-slate-200 transition-all text-center border border-slate-700/60"
                          >
                            <span>Seat Layout</span>
                          </Link>
                        </div>

                        {/* Pantry Meal */}
                        <Link
                          href={`/train/${activePnrTicket.trainNumber}?tab=pantry`}
                          className="flex items-center justify-center gap-1 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-[10px] font-bold text-slate-200 transition-all text-center border border-slate-700/60"
                        >
                          <span>🍱 Order Meal to Berth</span>
                        </Link>

                        <button
                          onClick={() => {
                            setActivePnrTicket(null);
                            setPnrInput('');
                          }}
                          className="text-[9px] font-bold text-slate-500 hover:text-rose-500 transition-colors w-full text-center block pt-1.5 uppercase tracking-wider"
                        >
                          Eject Boarding Pass
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Mechanical Split-Flap Station Board ─────────────────────────── */}
      <section>
        <StationBoard />
      </section>

      {/* ─── Feature Grid ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: <MapPin className="h-6 w-6" />,
            color: 'bg-sky-500/10 text-rail-blue',
            title: 'Vector Map Tracking',
            desc: 'MapTiler dark vector tiles with animated live train marker, route glow, and follow camera.',
          },
          {
            icon: <Zap className="h-6 w-6" />,
            color: 'bg-emerald-500/10 text-emerald-600',
            title: 'Live 30s Auto-Refresh',
            desc: 'TanStack Query polls RailRadar every 30 seconds for position, delay, and ETA updates.',
          },
          {
            icon: <Clock className="h-6 w-6" />,
            color: 'bg-amber-500/10 text-amber-600',
            title: 'OpenWeather & Terrain',
            desc: 'Per-station live weather and OpenTopography SRTM elevation profiles along the route.',
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="glass-panel rounded-3xl p-6 space-y-3 bg-slate-50/50 dark:bg-slate-900/20"
          >
            <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center', f.color)}>
              {f.icon}
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{f.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
