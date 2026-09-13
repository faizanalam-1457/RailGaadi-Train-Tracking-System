'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Train, MapPin, Ticket, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function QuickActions() {
  const actions = [
    {
      title: 'Track Live Train',
      description: 'Enter train number for real-time GPS telemetry and status.',
      icon: Train,
      href: '/train/12951',
      badge: 'Popular',
      color: 'bg-sky-500/10 text-rail-blue border-sky-500/20',
    },
    {
      title: 'Station Live Board',
      description: 'Mechanical departure and arrival split-flap station display.',
      icon: MapPin,
      href: '#station-board',
      badge: 'Interactive',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    {
      title: 'PNR Boarding Pass',
      description: 'Generate digital boarding pass ticket with real-time countdown.',
      icon: Ticket,
      href: '#pnr-wallet',
      badge: 'Wallet',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    {
      title: 'Route Intelligence',
      description: 'Topographical elevation curves and POI bridge/tunnel markers.',
      icon: Compass,
      href: '/train/22436?tab=analytics',
      badge: 'Analytics',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link key={act.title} href={act.href} className="group">
            <Card className="p-5 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-glass-hover hover:border-rail-blue/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-2xl border ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {act.badge}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
