import React from 'react';
import { IntelligenceClient } from '@/components/news/IntelligenceClient';

export const metadata = {
  title: 'RailGaadi Intelligence | Railway News & Developments',
  description:
    'Real-time Indian and global railway news, Vande Bharat launches, infrastructure updates, and policy intelligence powered by The Guardian Content API.',
};

export default function IntelligencePage() {
  return <IntelligenceClient />;
}
