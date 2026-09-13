'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Star, Ticket, ArrowRight, Train, HelpCircle, Compass, MapPin, Calculator, Utensils } from 'lucide-react';
import { useSearchStore } from '@/store/search';
import { useFavoritesStore } from '@/store/favorites';
import { cn } from '@/utils/cn';
import { HeroSearch } from '@/components/search/HeroSearch';
import { QuickActions } from '@/components/search/QuickActions';
import { PnrWallet } from '@/components/search/PnrWallet';
import { RailNetworkMesh } from '@/components/search/RailNetworkMesh';
import { StationBoard } from '@/components/search/StationBoard';
import { RailwayTrackAnimation } from '@/components/animation/RailwayTrackAnimation';
import { LiveSignalTicker } from '@/components/home/LiveSignalTicker';
import { TrainComparisonWidget } from '@/components/home/TrainComparisonWidget';
import { CulturalTrainShowcase } from '@/components/cultural/CulturalTrainShowcase';

export default function HomePage() {
  const { recentSearches, clearRecentSearches } = useSearchStore();
  const { favorites } = useFavoritesStore();
  const [dashboardTab, setDashboardTab] = useState<'recents' | 'favorites' | 'pnr'>('recents');

  return (
    <div className="space-y-12 py-4 relative">
      {/* ─── Animated Signal Ticker ─── */}
      <LiveSignalTicker />

      {/* ─── Hero Section with Network Mesh ─── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-gradient-to-b from-sky-500/10 via-background to-background p-6 md:p-12 border border-sky-500/20 shadow-glass overflow-hidden">
        <div className="lg:col-span-7 space-y-6 text-left relative z-50">
          <HeroSearch />
        </div>

        <div className="hidden lg:block lg:col-span-5 h-[400px]">
          <RailNetworkMesh />
        </div>
      </section>

      {/* ─── Animated Railway Track & Moving Train ─── */}
      <section className="glass-panel rounded-3xl p-4 shadow-glass border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-2 pb-2 text-xs font-bold text-slate-500">
          <span>Live Railway Telemetry Corridor Stream</span>
          <span className="text-emerald-500 font-mono">● LIVE RADAR ACTIVE</span>
        </div>
        <RailwayTrackAnimation speedSeconds={14} />
      </section>

      {/* ─── Quick Intelligence Actions ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
          Railway Intelligence Suite
        </h2>
        <QuickActions />
      </section>

      {/* ─── Cultural & Regional Train Heritage Showcase ─── */}
      <section>
        <CulturalTrainShowcase />
      </section>

      {/* ─── Interactive Train Comparer Widget ─── */}
      <section>
        <TrainComparisonWidget />
      </section>

      {/* ─── Navigation Feature Tiles ─── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Live Vector Radar', href: '/live-radar', icon: Compass, color: 'text-sky-500', desc: 'Multi-train map' },
          { title: 'Station Directory', href: '/stations', icon: MapPin, color: 'text-emerald-500', desc: 'Junction boards' },
          { title: 'Schedule Comparer', href: '/schedules', icon: Calculator, color: 'text-purple-500', desc: 'Delay side-by-side' },
          { title: 'Pantry Food Delivery', href: '/pantry', icon: Utensils, color: 'text-amber-500', desc: 'Berth e-catering' },
        ].map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.title}
              href={tile.href}
              className="glass-panel group rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-rail-blue/40 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <Icon className={cn('h-5 w-5', tile.color)} />
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-rail-blue transition-all" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3 group-hover:text-rail-blue transition-colors">
                {tile.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{tile.desc}</p>
            </Link>
          );
        })}
      </section>

      {/* ─── Dashboard Section: Recents, Favorites, and PNR Wallet ───────── */}
      <section className="glass-panel rounded-3xl p-6 shadow-glass space-y-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
            <button
              onClick={() => setDashboardTab('recents')}
              className={cn(
                'relative rounded-lg px-4 py-2 text-xs font-bold transition-all',
                dashboardTab === 'recents' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-500'
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
                dashboardTab === 'favorites' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-500'
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
                dashboardTab === 'pnr' ? 'bg-white dark:bg-slate-800 text-rail-blue shadow-sm' : 'text-slate-500'
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

        <div>
          <AnimatePresence mode="wait">
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
                      className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glass-hover bg-slate-50/40 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800"
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
                    No recent searches. Type a train number above to get started.
                  </div>
                )}
              </motion.div>
            )}

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
                      className="glass-panel group flex items-center justify-between rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glass-hover bg-slate-50/40 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800"
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
                  <div className="col-span-full py-12 text-center text-xs text-slate-500 space-y-1">
                    <HelpCircle className="h-6 w-6 mx-auto text-slate-400" />
                    <p>No favorites bookmarked yet.</p>
                    <p className="text-[10px] text-slate-400">Tap the Star button on any train page to save it for quick access.</p>
                  </div>
                )}
              </motion.div>
            )}

            {dashboardTab === 'pnr' && (
              <motion.div
                key="tab-pnr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <PnrWallet />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Mechanical Split-Flap Station Board ─────────────────────────── */}
      <section>
        <StationBoard />
      </section>
    </div>
  );
}
