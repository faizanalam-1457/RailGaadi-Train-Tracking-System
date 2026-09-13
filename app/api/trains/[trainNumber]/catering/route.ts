import { NextRequest, NextResponse } from 'next/server';
import { getCateringForTrain } from '@/lib/catering/service';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';
import { TrainCateringInfo } from '@/types/catering';

interface RouteParams {
  params: { trainNumber: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const trainNumber = (params.trainNumber || '').trim();

  if (!trainNumber || !/^\d{4,5}$/.test(trainNumber)) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'Valid 4 or 5 digit train number required' },
        meta: { timestamp: new Date().toISOString(), cached: false, realtimeInventory: false },
      },
      { status: 400 }
    );
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`catering:${ip}`, 60, 60);

  if (!rateLimit.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please wait a moment.' },
        meta: { timestamp: new Date().toISOString(), cached: false, realtimeInventory: false },
      },
      { status: 429 }
    );
  }

  const cacheKey = `catering:train:${trainNumber}`;
  const cached = await redisGet<TrainCateringInfo>(cacheKey);

  if (cached) {
    return NextResponse.json<ApiResponse<TrainCateringInfo>>({
      success: true,
      data: cached,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
        provider: cached.source,
        realtimeInventory: cached.realtimeInventory,
      },
    });
  }

  try {
    const cateringInfo = await getCateringForTrain(trainNumber);

    // Cache for 30 minutes (1800s)
    await redisSet(cacheKey, cateringInfo, 1800);

    return NextResponse.json<ApiResponse<TrainCateringInfo>>({
      success: true,
      data: cateringInfo,
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        provider: cateringInfo.source,
        realtimeInventory: cateringInfo.realtimeInventory,
      },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'CATERING_FETCH_FAILED', message: err.message || 'Catering information request failed' },
        meta: { timestamp: new Date().toISOString(), cached: false, realtimeInventory: false },
      },
      { status: 500 }
    );
  }
}
