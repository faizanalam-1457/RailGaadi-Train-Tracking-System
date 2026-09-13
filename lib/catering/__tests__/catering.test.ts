import { describe, it, expect } from 'vitest';
import { StationCateringProvider } from '../provider';
import { getCateringForTrain } from '../service';
import { Station } from '@/types/train';

describe('StationCateringProvider', () => {
  const provider = new StationCateringProvider();

  it('identifies catering availability for known IRCTC hubs', async () => {
    const mockStations: Station[] = [
      {
        code: 'ST',
        name: 'Surat',
        lat: 21.2,
        lng: 72.8,
        scheduledArrival: '20:10',
        scheduledDeparture: '20:15',
        delayMinutes: 0,
        distanceKm: 263,
        status: 'passed',
      },
      {
        code: 'UNKNOWN',
        name: 'Small Waystation',
        lat: 22.0,
        lng: 73.0,
        scheduledArrival: '21:00',
        scheduledDeparture: '21:02',
        delayMinutes: 0,
        distanceKm: 310,
        status: 'upcoming',
      },
      {
        code: 'CNB',
        name: 'Kanpur Central',
        lat: 26.4,
        lng: 80.3,
        scheduledArrival: '03:15',
        scheduledDeparture: '03:25',
        delayMinutes: 5,
        distanceKm: 920,
        status: 'upcoming',
      },
    ];

    const result = await provider.getAvailability('12951', mockStations);

    expect(result).toHaveLength(3);
    expect(result[0].available).toBe(true);
    expect(result[0].stationCode).toBe('ST');
    expect(result[0].orderingUrl).toContain('ecatering.irctc.co.in');

    expect(result[1].available).toBe(false);
    expect(result[1].stationCode).toBe('UNKNOWN');

    expect(result[2].available).toBe(true);
    expect(result[2].stationCode).toBe('CNB');
  });

  it('handles empty route stations array', async () => {
    const result = await provider.getAvailability('12951', []);
    expect(result).toEqual([]);
  });
});

describe('getCateringForTrain', () => {
  it('correctly calculates nextAvailableStation filtering out passed stations', async () => {
    const result = await getCateringForTrain('12951');

    expect(result).toBeDefined();
    expect(result.trainNumber).toBe('12951');
    expect(result.serviceAvailable).toBe(true);
    expect(result.realtimeInventory).toBe(false);
    expect(result.source).toContain('RailGaadi station catering dataset');

    if (result.nextAvailableStation) {
      expect(result.nextAvailableStation.available).toBe(true);
      expect(result.nextAvailableStation.status).not.toBe('passed');
    }
  });

  it('gracefully handles non-existent or unknown train numbers', async () => {
    const result = await getCateringForTrain('00000');
    expect(result).toBeDefined();
    expect(result.trainNumber).toBe('00000');
    expect(result.realtimeInventory).toBe(false);
  });
});
