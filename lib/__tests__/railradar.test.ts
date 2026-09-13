import { describe, it, expect } from 'vitest';
import { generateFallbackJourney } from '@/lib/railradar';

describe('RailRadar Service Data Policy', () => {
  it('should explicitly set isDemoData: true on fallback journeys', () => {
    const journey = generateFallbackJourney('12951');
    expect(journey).not.toBeNull();
    expect(journey.number).toBe('12951');
    expect(journey.isDemoData).toBe(true);
    expect(journey.stations.length).toBeGreaterThan(0);
  });
});
