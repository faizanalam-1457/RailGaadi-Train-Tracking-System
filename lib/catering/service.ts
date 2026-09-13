import { CateringStation, TrainCateringInfo } from '@/types/catering';
import { LiveJourney } from '@/types/train';
import { getLiveJourney, generateFallbackJourney } from '@/lib/railradar';
import { StationCateringProvider, CateringProvider } from './provider';

// Active provider instance (can be swapped via DI or config)
const defaultProvider: CateringProvider = new StationCateringProvider();

export async function getCateringForTrain(
  trainNumber: string,
  journeyData?: LiveJourney | null,
  provider: CateringProvider = defaultProvider
): Promise<TrainCateringInfo> {
  let journey = journeyData;

  if (!journey) {
    try {
      journey = await getLiveJourney(trainNumber);
    } catch {
      journey = null;
    }
  }

  if (!journey) {
    // Fallback to static route lookup from TRAINS_DB
    journey = generateFallbackJourney(trainNumber);
  }

  const allCateringStations = await provider.getAvailability(trainNumber, journey.stations);

  // Filter upcoming catering stations based on live train location
  const upcomingCateringStations = allCateringStations.filter((st) => {
    return st.status !== 'passed';
  });

  // Find next available food stop (first upcoming station with available === true)
  const nextAvailableStation = upcomingCateringStations.find((st) => st.available);

  const hasAnyService = allCateringStations.some((st) => st.available);

  return {
    trainNumber,
    serviceAvailable: hasAnyService,
    stations: allCateringStations,
    upcoming: upcomingCateringStations,
    nextAvailableStation,
    source: provider.providerName,
    lastUpdated: new Date().toISOString(),
    realtimeInventory: provider.isRealtimeInventory,
  };
}
