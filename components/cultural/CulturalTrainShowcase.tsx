'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface RegionCulturalCard {
  id: string;
  regionName: string;
  stationCode: string;
  trainNumber: string;
  trainName: string;
  landmarkEmoji: string;
  culturalIcons: string[];
  culinarySpecialty: string;
  heritageTagline: string;
  themeGradient: string;
  accentColor: string;
}

const REGIONAL_HERITAGE_DATA: RegionCulturalCard[] = [
  {
    id: 'mumbai',
    regionName: 'Mumbai & Konkan Coast',
    stationCode: 'MMCT / CSMT',
    trainNumber: '12951',
    trainName: 'Mumbai Tejas Rajdhani Express',
    landmarkEmoji: '🌆',
    culturalIcons: ['Gateway of India', 'Marine Drive', 'Dabbawalas', 'Kaali-Peeli Taxi'],
    culinarySpecialty: 'Cutting Chai & Bombay Vadapav',
    heritageTagline: 'Connecting the City of Dreams to the National Capital at 130 km/h.',
    themeGradient: 'from-amber-500/15 via-sky-500/10 to-transparent',
    accentColor: 'text-amber-500 border-amber-500/30',
  },
  {
    id: 'varanasi',
    regionName: 'Varanasi & Holy Ganges',
    stationCode: 'BSB',
    trainNumber: '22436',
    trainName: 'Varanasi Vande Bharat Express',
    landmarkEmoji: '🛕',
    culturalIcons: ['Ganga Aarti Ghats', 'Kashi Temple Spires', 'Banarasi Silk Weavers', 'Sarnath Monasteries'],
    culinarySpecialty: 'Kashi Malaiyo & Banarasi Paan',
    heritageTagline: 'Blending Ancient Spiritual Heritage with High-Speed Aerodynamic Telemetry.',
    themeGradient: 'from-rose-500/15 via-amber-500/10 to-transparent',
    accentColor: 'text-rose-500 border-rose-500/30',
  },
  {
    id: 'kolkata',
    regionName: 'Kolkata & Bengal Corridor',
    stationCode: 'HWH / SDAH',
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani Express',
    landmarkEmoji: '🌉',
    culturalIcons: ['Howrah Bridge Arc', 'Heritage Tramways', 'Durga Puja Artistry', 'Victoria Memorial'],
    culinarySpecialty: 'Kolkata Rosogolla & Mishti Doi',
    heritageTagline: 'India’s Historic First Rajdhani Express connecting the Cultural Capital.',
    themeGradient: 'from-yellow-500/15 via-sky-500/10 to-transparent',
    accentColor: 'text-yellow-500 border-yellow-500/30',
  },
  {
    id: 'chennai',
    regionName: 'Chennai & Tamil Corridor',
    stationCode: 'MAS',
    trainNumber: '12621',
    trainName: 'Tamil Nadu Superfast Express',
    landmarkEmoji: '🏛️',
    culturalIcons: ['Dravidian Gopuram Architecture', 'Bharatanatyam Heritage', 'Carnatic Music', 'Marina Beach'],
    culinarySpecialty: 'Degree Filter Kaapi & Idli Sambar',
    heritageTagline: 'Traversing the Coromandel Coast with Deep Southern Cultural Identity.',
    themeGradient: 'from-emerald-500/15 via-sky-500/10 to-transparent',
    accentColor: 'text-emerald-500 border-emerald-500/30',
  },
  {
    id: 'punjab',
    regionName: 'Punjab & Amritsar Frontier',
    stationCode: 'ASR',
    trainNumber: '12903',
    trainName: 'Golden Temple Mail',
    landmarkEmoji: '🕌',
    culturalIcons: ['Golden Temple Harmandir Sahib', 'Phulkari Embroidery', 'Green Fields', 'Bhangra Rhythms'],
    culinarySpecialty: 'Amritsari Kulcha & Chhole Lassi',
    heritageTagline: 'Historical Frontier Express linking the Land of Five Rivers since 1928.',
    themeGradient: 'from-amber-400/15 via-emerald-500/10 to-transparent',
    accentColor: 'text-amber-400 border-amber-400/30',
  },
  {
    id: 'bengaluru',
    regionName: 'Bengaluru & Mysuru Realm',
    stationCode: 'SBC / MYS',
    trainNumber: '12007',
    trainName: 'Mysuru Shatabdi Express',
    landmarkEmoji: '🏰',
    culturalIcons: ['Mysore Palace Illuminated Spires', 'Silicon Valley Tech Hub', 'Garden City Lalbagh', 'Sandalwood Carvings'],
    culinarySpecialty: 'Mysore Pak & Filter Coffee',
    heritageTagline: 'Bridging Royal Kingdom Heritage with Modern Technological Innovation.',
    themeGradient: 'from-purple-500/15 via-sky-500/10 to-transparent',
    accentColor: 'text-purple-500 border-purple-500/30',
  },
];

export function CulturalTrainShowcase() {
  const [activeRegion, setActiveRegion] = useState<string>('mumbai');

  return (
    <section className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-rail-blue">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cultural & Regional Heritage Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Regional Train Cultural Identity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore the unique architectural landmarks, local heritage stories, and culinary specialties of iconic train corridors.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {REGIONAL_HERITAGE_DATA.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap border',
                activeRegion === r.id
                  ? 'bg-rail-blue text-white shadow-glow border-rail-blue'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              )}
            >
              {r.landmarkEmoji} {r.regionName.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Cultural Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REGIONAL_HERITAGE_DATA.map((item) => {
          const isSelected = activeRegion === item.id;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={cn(
                  'p-6 space-y-4 relative overflow-hidden transition-all duration-300 border bg-gradient-to-b',
                  item.themeGradient,
                  isSelected ? 'ring-2 ring-rail-blue shadow-glow' : 'hover:border-rail-blue/40'
                )}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl select-none">{item.landmarkEmoji}</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.regionName}
                      </h3>
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {item.stationCode}
                      </span>
                    </div>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border', item.accentColor)}>
                    #{item.trainNumber}
                  </span>
                </div>

                {/* Train Name & Heritage Tagline */}
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-rail-blue">{item.trainName}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{item.heritageTagline}"
                  </p>
                </div>

                {/* Cultural Heritage Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    CULTURAL LANDMARKS & HERITAGE
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.culturalIcons.map((icon) => (
                      <span
                        key={icon}
                        className="rounded-md border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        • {icon}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Culinary Specialty */}
                <div className="bg-slate-100/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Station Specialty:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">☕ {item.culinarySpecialty}</span>
                </div>

                {/* Action Quick Link */}
                <div className="pt-2">
                  <Link
                    href={`/train/${item.trainNumber}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rail-blue py-2 text-xs font-bold text-white shadow-glow hover:bg-sky-600 transition-colors"
                  >
                    <span>Track #{item.trainNumber} & Cultural Route</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
