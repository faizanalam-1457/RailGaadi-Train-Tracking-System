'use client';

import { useQuery } from '@tanstack/react-query';
import { LiveJourney } from '@/types/train';
import { ApiResponse } from '@/types/api';
import { useJourneyStore } from '@/store/journey';

async function fetchLiveJourney(trainId: string): Promise<LiveJourney> {
  const res = await fetch(`/api/train/${trainId}`);
  const json: ApiResponse<LiveJourney> = await res.json();
  if (!json.success || !json.data) {
    const errorMsg = json.error?.message || 'Failed to fetch live journey';
    throw new Error(errorMsg);
  }
  return json.data;
}

export function useLiveJourney(trainId: string) {
  const autoRefresh = useJourneyStore((state) => state.autoRefresh);

  return useQuery({
    queryKey: ['liveJourney', trainId],
    queryFn: () => fetchLiveJourney(trainId),
    enabled: Boolean(trainId),
    refetchInterval: autoRefresh ? 30 * 1000 : false,
    staleTime: 10 * 1000,
  });
}
