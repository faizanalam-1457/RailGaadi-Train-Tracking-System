export interface CateringStation {
  stationCode: string;
  stationName: string;
  available: boolean;
  serviceType?: 'ecatering' | 'meal' | 'restaurant';
  provider: 'IRCTC_ECATERING';
  orderingUrl: string;
  deliveryAvailable?: boolean;
  lastVerifiedAt?: string;
  source?: string;
  cutoffMinutes?: number;
  specialties?: string[];
  scheduledArrival?: string;
  scheduledDeparture?: string;
  estimatedArrival?: string;
  platform?: string;
  status?: 'passed' | 'current' | 'upcoming';
  distanceKm?: number;
}

export interface TrainCateringInfo {
  trainNumber: string;
  serviceAvailable: boolean;
  stations: CateringStation[];
  upcoming: CateringStation[];
  nextAvailableStation?: CateringStation;
  source: string;
  lastUpdated: string;
  realtimeInventory: boolean;
}
