import React from 'react';
import Metadata from 'next';
import Link from 'next/link';
import {
  Train,
  Compass,
  MapPin,
  Utensils,
  Newspaper,
  Bot,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Radio,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | RailGaadi — Indian Railway Intelligence Platform',
  description:
    'Learn how RailGaadi powers real-time train tracking, delay forecasting, cultural corridor preservation, and railway intelligence news.',
};

const STEPS = [
  {
    step: '01',
    title: 'Real-Time Vector Map & Telemetry Radar',
    icon: Compass,
    color: 'from-sky-500 to-blue-600',
    description:
      'RailGaadi connects directly to high-frequency RailRadar telemetry signals and MapTiler vector maps. We render dynamic train vectors, speed indicators, and station markers across 1.3 Million track kilometers in real-time.',
    features: ['Sub-second vector map updates', 'Live speed meters & station ETAs', 'Interactive national radar grid'],
  },
  {
    step: '02',
    title: 'Predictive Delay & Terrain Gradient Intelligence',
    icon: Activity,
    color: 'from-emerald-500 to-teal-600',
    description:
      'By synthesizing elevation profiles from OpenTopography and micro-climate data from OpenWeather, RailGaadi algorithms analyze mountain gradients (such as the Western Ghats Sahyadri climbs) and dense fog corridors to forecast punctuality.',
    features: ['3D Elevation profile curves', 'Live route weather advisories', 'Historical delay distribution metrics'],
  },
  {
    step: '03',
    title: 'Regional Cultural Heritage Preservation',
    icon: Layers,
    color: 'from-amber-500 to-orange-600',
    description:
      'Indian Railways is the lifeblood of Indian culture. RailGaadi showcases regional identity cards across major train routes — from Mumbai Central Dabbawala history to Varanasi Ganga Aarti heritage and Kolkata Howrah Bridge stories.',
    features: ['Iconic train corridor cards', 'Cultural landmark highlights', 'Regional culinary guides'],
  },
  {
    step: '04',
    title: 'Smart Passenger Pantry & PNR Wallet',
    icon: Utensils,
    color: 'from-rose-500 to-pink-600',
    description:
      'Travelers can simulate in-berth IRCTC e-catering order deliveries at upcoming junction halts (Surat Khaman, Kanpur Samosas, Kota Kachoris) and manage digital PNR boarding passes with offline support.',
    features: ['Berth food delivery simulator', 'PNR countdown timer & coach maps', 'Offline instant search DB'],
  },
  {
    step: '05',
    title: 'Contextual RailGaadi AI Assistant',
    icon: Bot,
    color: 'from-purple-500 to-indigo-600',
    description:
      'Our site-wide AI chatbot automatically extracts active train context from your page view to answer delay questions, platform assignments, and travel FAQs using structured markdown and direct tracking links.',
    features: ['Auto-route train context binding', 'Instant delay & platform answers', 'Clickable tracking shortcuts'],
  },
  {
    step: '06',
    title: 'RailGaadi Intelligence & Real Guardian News API',
    icon: Newspaper,
    color: 'from-cyan-500 to-blue-600',
    description:
      'Stay informed with real-world railway news, Vande Bharat expansions, infrastructure developments, and global rail technology trends powered directly by The Guardian Content API and cached via Upstash Redis.',
    features: ['Verified real-world Guardian news', 'Topic-based filtering & deduplication', 'Train-specific news correlation'],
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center bg-gradient-to-b from-slate-900/90 to-slate-950 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-rail-blue/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-mono text-sky-300">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
            <span>Platform Vision & Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Redefining Indian Railway <span className="text-rail-blue">Intelligence</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            RailGaadi is a next-generation railway intelligence platform designed to replace opaque delay numbers with sub-second vector telemetry, elevation analytics, cultural corridor storytelling, and real-world news.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl bg-rail-blue px-5 py-3 text-white shadow-glow hover:bg-sky-600 transition-all"
            >
              <span>Explore Live Telemetry</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/intelligence"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-slate-200 hover:bg-slate-700 transition-all"
            >
              <Newspaper className="h-4 w-4 text-sky-400" />
              <span>RailGaadi Intelligence News</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Platform Architecture Steps ─── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How RailGaadi Works Step-by-Step
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            From raw signal streams to rich interactive visualizations, explore the six pillars of our intelligence pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="group relative rounded-3xl glass-panel border border-slate-200 dark:border-slate-800/80 bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700">
                      {step.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 space-y-1.5">
                  {step.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Standard & Performance Metrics ─── */}
      <section className="rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-8 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Production Standards & Performance Guarantee</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Engineered with zero third-party UI framework bloated scripts. Sub-second response times backed by Upstash Redis edge memory cache.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
              <div className="text-2xl font-black text-rail-blue">WCAG 2.2</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">AA Accessible</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
              <div className="text-2xl font-black text-emerald-400">&lt; 100ms</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Cache Latency</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-400">100% Real</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Guardian News API</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
