import { NextRequest, NextResponse } from 'next/server';
import { getTerrainFeatures, TerrainFeature } from '@/lib/overpass';
import { getLiveJourney } from '@/lib/railradar';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`terrain:${ip}`, 30, 60);

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

  const { searchParams } = new URL(request.url);
  const trainId = searchParams.get('trainId');

  if (!trainId) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'trainId is required' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 400 }
    );
  }

  const cacheKey = `terrain:${trainId}`;
  const cached = await redisGet<TerrainFeature[]>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<TerrainFeature[]>>({
      success: true,
      data: cached,
      meta: { timestamp: new Date().toISOString(), cached: true },
    });
  }

  try {
    const journey = await getLiveJourney(trainId);
    if (!journey) {
      return NextResponse.json<ApiResponse<TerrainFeature[]>>({
        success: true,
        data: [],
        meta: { timestamp: new Date().toISOString(), cached: false },
      });
    }

    const routeCoords =
      journey.routeGeometry ||
      journey.stations.filter((s) => s.lat && s.lng).map((s) => [s.lng, s.lat] as [number, number]);

    const features = await getTerrainFeatures(routeCoords);

    const origin = journey.stations[0];
    if (origin?.lat && origin?.lng) {
      features.forEach((f) => {
        const dlat = f.lat - origin.lat;
        const dlng = f.lng - origin.lng;
        f.distanceKm = Math.round(Math.sqrt(dlat * dlat + dlng * dlng) * 111);
      });
    }

    features.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

    await redisSet(cacheKey, features, 86400); // 24h

    return NextResponse.json<ApiResponse<TerrainFeature[]>>({
      success: true,
      data: features,
      meta: { timestamp: new Date().toISOString(), cached: false },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'TERRAIN_FETCH_FAILED', message: err.message || 'Terrain fetch failed' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  }
}
