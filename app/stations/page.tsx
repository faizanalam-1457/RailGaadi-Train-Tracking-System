import React from 'react';
import { Metadata } from 'next';
import { StationDirectoryClient } from '@/components/stations/StationDirectoryClient';

export const metadata: Metadata = {
  title: 'RailGaadi | Live Station Directory & Junction Radar',
  description: 'Explore Indian Railways station junctions, platforms, facilities, amenities, and live connecting trains.',
};

export default function StationsPage() {
  return <StationDirectoryClient />;
}
