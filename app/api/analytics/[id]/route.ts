import { NextRequest, NextResponse } from 'next/server';
import { getLiveJourney } from '@/lib/railradar';
import { getElevationProfile, ElevationPoint } from '@/lib/opentopography';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';

export interface AnalyticsResponse {
  trainId: string;
  totalDistanceKm: number;
  distanceCoveredKm: number;
  remainingDistanceKm: number;
  completionPercentage: number;
  highestElevationM: number;
  elevationProfile: ElevationPoint[];
  delayHistory: { stationCode: string; stationName: string; delayMinutes: number }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`analytics:${ip}`, 30, 60);

  if (!rateLimit.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded.' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 429 }
    );
  }

  const trainId = params.id;
  const cacheKey = `analytics:${trainId}`;

  const cached = await redisGet<AnalyticsResponse>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<AnalyticsResponse>>({
      success: true,
      data: cached,
      meta: { timestamp: new Date().toISOString(), cached: true },
    });
  }

  try {
    const journey = await getLiveJourney(trainId);
    if (!journey) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Journey not found' },
          meta: { timestamp: new Date().toISOString(), cached: false },
        },
        { status: 404 }
      );
    }

    const routeCoords = journey.routeGeometry || journey.stations.map((s) => [s.lng, s.lat]);
    const elevationProfile = await getElevationProfile(routeCoords, journey.totalDistanceKm);

    const highestElevationM = Math.max(...elevationProfile.map((e) => e.elevationM), 520);

    const delayHistory = journey.stations.map((s) => ({
      stationCode: s.code,
      stationName: s.name,
      delayMinutes: s.delayMinutes,
    }));

    const result: AnalyticsResponse = {
      trainId,
      totalDistanceKm: journey.totalDistanceKm,
      distanceCoveredKm: journey.distanceCoveredKm,
      remainingDistanceKm: journey.remainingDistanceKm,
      completionPercentage: journey.completionPercentage,
      highestElevationM,
      elevationProfile,
      delayHistory,
    };

    await redisSet(cacheKey, result, 300); // 5 min cache

    return NextResponse.json<ApiResponse<AnalyticsResponse>>({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString(), cached: false },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'ANALYTICS_FAILED', message: err.message || 'Failed to compute analytics' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  }
}
