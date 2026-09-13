'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X, Train, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useTrainSearch } from '@/hooks/useTrainSearch';
import { useSearchStore } from '@/store/search';
import { SearchResult } from '@/types/train';
import { cn } from '@/utils/cn';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function HeroSearch() {
  const router = useRouter();
  const { addRecentSearch } = useSearchStore();

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const debouncedQuery = useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading, isError } = useTrainSearch(debouncedQuery);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchResults]);

  // ⌘K Keyboard Shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        setIsFocused(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (train: SearchResult) => {
    addRecentSearch(train);
    setIsOpen(false);
    setIsFocused(false);
    setInputValue('');
    router.push(`/train/${train.number}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, (searchResults?.length || 0) - 1));
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
      setIsOpen(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = isOpen && (inputValue || debouncedQuery);

  return (
    <div className="space-y-6 text-left relative z-50">
      {/* Background Dim Overlay when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsFocused(false);
              setIsOpen(false);
              inputRef.current?.blur();
            }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-40 transition-all duration-300"
          />
        )}
      </AnimatePresence>

      <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue backdrop-blur-md">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Indian Railway Intelligence Platform</span>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
        Track Any Train in <span className="text-rail-blue">Real-time.</span>
      </h1>

      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
        Live vector mapping, mechanical station boards, delay histories, elevation profile charts, and meal ordering in one platform.
      </p>

      {/* ─── Search Input Box ─── */}
      <div className="relative max-w-xl text-left z-50">
        <div
          className={cn(
            'glass-panel flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-glass transition-all duration-300 border bg-background/90',
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
            role="combobox"
            aria-expanded={showDropdown ? 'true' : 'false'}
            aria-autocomplete="list"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              setIsFocused(true);
            }}
            onFocus={() => {
              setIsOpen(true);
              setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search train number (12951) or name (Rajdhani)..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
          />

          {inputValue && (
            <button
              onClick={() => {
                setInputValue('');
                setIsOpen(false);
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

        {/* ─── Search Results Dropdown ─── */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 max-h-[360px] overflow-y-auto rounded-2xl glass-panel p-3 shadow-glass-hover border border-slate-200 dark:border-slate-800 bg-background"
            >
              {isError && (
                <div className="flex items-center gap-2 py-4 text-center justify-center text-xs text-rose-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Error loading trains. Please try again.</span>
                </div>
              )}

              {isLoading && !searchResults && (
                <div className="space-y-2 py-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
                  ))}
                </div>
              )}

              {!isLoading && !isError && searchResults && searchResults.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-500">
                  No trains found. Try a train number like <strong>12951</strong> or name like <strong>Rajdhani</strong>.
                </div>
              )}

              {inputValue && /^\d{4,5}$/.test(inputValue.trim()) && (
                <button
                  onClick={() => router.push(`/train/${inputValue.trim()}`)}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 mb-2 bg-rail-blue/10 text-rail-blue text-xs font-bold hover:bg-rail-blue hover:text-white transition-all"
                >
                  <Train className="h-4 w-4" />
                  <span>Track train #{inputValue.trim()} live →</span>
                </button>
              )}

              {searchResults && searchResults.length > 0 && (
                <div className="space-y-1.5" role="listbox">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 pb-1">
                    Matching Trains
                  </p>
                  {searchResults.map((train, idx) => {
                    const isFocusedItem = idx === focusedIndex;
                    return (
                      <button
                        key={train.id}
                        role="option"
                        aria-selected={isFocusedItem}
                        onClick={() => handleSelect(train)}
                        className={cn(
                          'w-full glass-panel group flex items-center justify-between rounded-xl p-3 transition-all duration-150 text-left border',
                          isFocusedItem
                            ? 'bg-rail-blue border-rail-blue text-white shadow-glow'
                            : 'hover:bg-rail-blue/5 hover:border-rail-blue/30'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
                              isFocusedItem
                                ? 'bg-white/20 text-white'
                                : 'bg-rail-blue/10 text-rail-blue group-hover:bg-rail-blue group-hover:text-white'
                            )}
                          >
                            <Train className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  'rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold flex-shrink-0',
                                  isFocusedItem
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                )}
                              >
                                {train.number}
                              </span>
                              <span
                                className={cn(
                                  'font-semibold text-sm truncate',
                                  isFocusedItem ? 'text-white' : 'text-slate-900 dark:text-white'
                                )}
                              >
                                {train.name}
                              </span>
                            </div>
                            {(train.origin.name || train.destination.name) && (
                              <div
                                className={cn(
                                  'mt-0.5 flex items-center gap-1.5 text-[11px] truncate',
                                  isFocusedItem ? 'text-white/80' : 'text-slate-500'
                                )}
                              >
                                <span>{train.origin.name} ({train.origin.code})</span>
                                <ArrowRight className="h-2.5 w-2.5 flex-shrink-0" />
                                <span>{train.destination.name} ({train.destination.code})</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          className={cn(
                            'h-4 w-4 flex-shrink-0 transition-all',
                            isFocusedItem
                              ? 'text-white translate-x-0.5'
                              : 'text-slate-400 group-hover:text-rail-blue group-hover:translate-x-0.5'
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Quick Search:</span>
        {['12951', '22436', '12301', '12621', '12001'].map((num) => (
          <button
            key={num}
            onClick={() => {
              setInputValue(num);
              setIsOpen(true);
              setIsFocused(true);
              inputRef.current?.focus();
            }}
            className="rounded-lg bg-slate-200/70 dark:bg-slate-800/70 px-2.5 py-1 font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-rail-blue hover:text-white transition-colors"
          >
            #{num}
          </button>
        ))}
      </div>
    </div>
  );
}
