import { NextRequest, NextResponse } from 'next/server';
import { searchTrains } from '@/lib/railradar';
import { searchLocalTrains } from '@/lib/trains-db';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';
import { SearchResult } from '@/types/train';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`search:${ip}`, 100, 60);

  if (!rateLimit.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many search requests. Please slow down.',
        },
        meta: {
          timestamp: new Date().toISOString(),
          cached: false,
        },
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const cacheKey = `search:${query.toLowerCase().trim()}`;

  const cached = await redisGet<SearchResult[]>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<SearchResult[]>>({
      success: true,
      data: cached,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
      },
    });
  }

  try {
    const results = await searchTrains(query);
    await redisSet(cacheKey, results, query ? 600 : 120);

    return NextResponse.json<ApiResponse<SearchResult[]>>({
      success: true,
      data: results,
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
      },
    });
  } catch (err: any) {
    console.warn('[/api/search] External lookup failed, falling back to local DB:', err.message);

    const localResults = searchLocalTrains(query).map((t) => ({
      id: t.number,
      number: t.number,
      name: t.name,
      origin: { code: t.fromCode, name: t.from },
      destination: { code: t.toCode, name: t.to },
    }));

    return NextResponse.json<ApiResponse<SearchResult[]>>({
      success: true,
      data: localResults,
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        provider: 'RailGaadi Static DB',
      },
    });
  }
}
