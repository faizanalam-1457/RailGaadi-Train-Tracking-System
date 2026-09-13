import React from 'react';
import { IntelligenceClient } from '@/components/news/IntelligenceClient';

export const metadata = {
  title: 'Railway News | RailGaadi Intelligence',
  description:
    'Real-time Indian and global railway news, Vande Bharat launches, infrastructure updates, and policy intelligence.',
};

export default function NewsPage() {
  return <IntelligenceClient />;
}
