import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import QueryProvider from '@/providers/query-provider';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { TrainAIChatbot } from '@/components/ai/TrainAIChatbot';
import { WesternGhatsBackgroundAnimation } from '@/components/animation/WesternGhatsBackgroundAnimation';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'RailGaadi — Indian Railway Intelligence Platform',
  description:
    'Experience train tracking redefined. Real-time Indian Railways tracking with vector maps, delay analytics, station boards, weather intelligence, and AI assistant.',
  keywords: ['train tracking', 'RailGaadi', 'live train status', 'Indian Railways', 'train map', 'IRCTC train', 'AI train assistant'],
  authors: [{ name: 'RailGaadi' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RailGaadi',
  },
  openGraph: {
    title: 'RailGaadi — Indian Railway Intelligence Platform',
    description: 'Real-time train tracking with interactive maps, delay analytics, and AI assistant.',
    type: 'website',
    locale: 'en_IN',
  },
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://api.railradar.in" />
        <link rel="preconnect" href="https://api.maptiler.com" />
        <link rel="preconnect" href="https://api.openweathermap.org" />
      </head>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative`}
      >
        <WesternGhatsBackgroundAnimation />
        <QueryProvider>
          <Navbar />
          <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full pb-24 md:pb-6 relative z-10">
            {children}
          </main>
          <TrainAIChatbot />
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
