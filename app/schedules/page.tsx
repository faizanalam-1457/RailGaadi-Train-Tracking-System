import React from 'react';
import { Metadata } from 'next';
import { ScheduleComparerClient } from '@/components/schedules/ScheduleComparerClient';

export const metadata: Metadata = {
  title: 'RailGaadi | Train Schedule & Punctuality Comparer',
  description: 'Compare Indian Railways train timetables, average delays, duration, speed, and punctuality side-by-side.',
};

export default function SchedulesPage() {
  return <ScheduleComparerClient />;
}
