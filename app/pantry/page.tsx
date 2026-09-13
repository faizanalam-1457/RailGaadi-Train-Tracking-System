import React from 'react';
import { Metadata } from 'next';
import { PantryExplorerClient } from '@/components/pantry/PantryExplorerClient';

export const metadata: Metadata = {
  title: 'RailGaadi | IRCTC E-Catering & Pantry Food Explorer',
  description: 'Explore regional railway meals, snacks, biryani, and beverages delivered to your train seat/berth at station halts.',
};

export default function PantryPage() {
  return <PantryExplorerClient />;
}
