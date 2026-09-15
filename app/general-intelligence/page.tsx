import React from 'react';
import { GeneralIntelligenceClient } from '@/components/ai/GeneralIntelligenceClient';

export const metadata = {
  title: 'General Intelligence AI | RailGaadi ChatGPT Studio',
  description:
    'Experience General Intelligence powered by NVIDIA NIM API & Meta Llama 3.3 70B model. Ask anything from general knowledge, coding, to complex railway logistics.',
};

export default function GeneralIntelligencePage() {
  return <GeneralIntelligenceClient />;
}
