import { CateringStation } from '@/types/catering';
import { Station } from '@/types/train';
import { getStationCateringConfig, OFFICIAL_IRCTC_URL } from './stations';

export interface CateringProvider {
  providerName: string;
  isRealtimeInventory: boolean;
  getAvailability(trainNumber: string, routeStations: Station[]): Promise<CateringStation[]>;
}

/**
 * Initial Station-Level Dataset Catering Provider.
 * Checks station availability against verified IRCTC eCatering hub dataset.
 */
export class StationCateringProvider implements CateringProvider {
  providerName = 'RailGaadi station catering dataset';
  isRealtimeInventory = false;

  async getAvailability(trainNumber: string, routeStations: Station[]): Promise<CateringStation[]> {
    if (!routeStations || routeStations.length === 0) return [];

    return routeStations.map((st) => {
      const config = getStationCateringConfig(st.code);
      const isAvailable = config ? config.available : false;

      return {
        stationCode: st.code,
        stationName: st.name || config?.stationName || st.code,
        available: isAvailable,
        serviceType: config?.serviceType || 'ecatering',
        provider: 'IRCTC_ECATERING',
        orderingUrl: config?.orderingUrl || OFFICIAL_IRCTC_URL,
        deliveryAvailable: isAvailable,
        lastVerifiedAt: new Date().toISOString(),
        source: this.providerName,
        cutoffMinutes: config?.cutoffMinutes || 30,
        specialties: config?.specialties || [],
        scheduledArrival: st.scheduledArrival,
        scheduledDeparture: st.scheduledDeparture,
        estimatedArrival: st.actualArrival || st.scheduledArrival,
        platform: st.platform,
        status: st.status,
        distanceKm: st.distanceKm,
      };
    });
  }
}

/**
 * Future Authorized IRCTC Real-Time Inventory Catering Provider.
 * Ready for drop-in replacement when official API access is granted.
 */
export class AuthorizedIRCTCEcateringProvider implements CateringProvider {
  providerName = 'Official IRCTC eCatering Live API';
  isRealtimeInventory = true;

  async getAvailability(trainNumber: string, routeStations: Station[]): Promise<CateringStation[]> {
    // Placeholder for future authorized API client integration
    throw new Error('Authorized IRCTC real-time inventory API not connected.');
  }
}
