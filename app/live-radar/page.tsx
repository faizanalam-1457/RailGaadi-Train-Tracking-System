import React from 'react';
import { Metadata } from 'next';
import { LiveRadarClient } from '@/components/radar/LiveRadarClient';

export const metadata: Metadata = {
  title: 'RailGaadi | National Railway Live Vector Radar',
  description: 'Interactive full-screen vector radar map tracking active express trains across Indian Railway corridors in real time.',
};

export default function LiveRadarPage() {
  return <LiveRadarClient />;
}
