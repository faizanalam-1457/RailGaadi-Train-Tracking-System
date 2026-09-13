import { describe, it, expect } from 'vitest';
import { searchLocalTrains, TRAINS_DB } from '@/lib/trains-db';

describe('Local Trains Database Search', () => {
  it('should find train by exact train number 12951', () => {
    const results = searchLocalTrains('12951');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].number).toBe('12951');
    expect(results[0].name).toContain('Rajdhani');
  });

  it('should find trains matching name substring (e.g. Shatabdi)', () => {
    const results = searchLocalTrains('Shatabdi');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((train) => {
      expect(train.name.toLowerCase()).toContain('shatabdi');
    });
  });

  it('should return default popular trains for empty query', () => {
    const results = searchLocalTrains('');
    expect(results.length).toBe(12);
  });
});
