import { describe, it, expect } from 'vitest';
import { formatDelay } from '@/utils/format';

describe('formatDelay Utility', () => {
  it('should format zero or negative delay as On Time', () => {
    const result0 = formatDelay(0);
    expect(result0.text).toBe('On Time');

    const resultNeg = formatDelay(-5);
    expect(resultNeg.text).toBe('On Time');
  });

  it('should format positive delay in minutes accurately', () => {
    const result14 = formatDelay(14);
    expect(result14.text).toContain('14m Late');

    const result60 = formatDelay(75);
    expect(result60.text).toContain('1h 15m Late');
  });
});
