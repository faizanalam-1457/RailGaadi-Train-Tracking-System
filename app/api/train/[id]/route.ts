import { NextRequest, NextResponse } from 'next/server';
import { getLiveJourney } from '@/lib/railradar';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';
import { LiveJourney } from '@/types/train';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`train:${ip}`, 60, 60);

  if (!rateLimit.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Rate limit exceeded. Please wait before making more requests.',
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetSeconds),
        },
      }
    );
  }

  const trainId = params.id;
  if (!trainId) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Train ID parameter is required.',
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      },
      { status: 400 }
    );
  }

  const cacheKey = `live:${trainId}`;
  const cached = await redisGet<LiveJourney>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<LiveJourney>>({
      success: true,
      data: cached,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
        provider: 'RailRadar Cache',
        isDemoData: cached.isDemoData ?? false,
      },
    });
  }

  try {
    const journey = await getLiveJourney(trainId);
    if (!journey) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Live journey not found for train #${trainId}. Please verify train number.`,
          },
          meta: {
            timestamp: new Date().toISOString(),
            cached: false,
          },
        },
        { status: 404 }
      );
    }

    await redisSet(cacheKey, journey, 30); // 30s cache

    return NextResponse.json<ApiResponse<LiveJourney>>({
      success: true,
      data: journey,
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        provider: 'RailRadar Intelligence API',
        isDemoData: journey.isDemoData ?? false,
      },
    });
  } catch (err: any) {
    const msg = err.message || 'Failed to fetch live journey';
    const isQuota = msg.includes('QUOTA_EXCEEDED');

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: isQuota ? 'QUOTA_EXCEEDED' : 'SERVICE_UNAVAILABLE',
          message: isQuota
            ? 'External railway API daily quota reached. Live tracking is temporarily restricted.'
            : 'Railway data provider is currently unreachable. Please try again in a few moments.',
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      },
      { status: isQuota ? 429 : 503 }
    );
  }
}
