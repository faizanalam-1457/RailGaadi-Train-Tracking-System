import { NextRequest, NextResponse } from 'next/server';
import { getWeatherForLocation, WeatherData } from '@/lib/openweather';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`weather:${ip}`, 60, 60);

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
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const name = searchParams.get('name') || '';
  const code = searchParams.get('code') || '';

  if (!lat || !lng) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'BAD_REQUEST', message: 'lat and lng parameters are required' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 400 }
    );
  }

  const cacheKey = `weather:${lat.toFixed(2)}:${lng.toFixed(2)}`;
  const cached = await redisGet<WeatherData>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<WeatherData>>({
      success: true,
      data: cached,
      meta: { timestamp: new Date().toISOString(), cached: true },
    });
  }

  try {
    const weather = await getWeatherForLocation(lat, lng, name, code);
    await redisSet(cacheKey, weather, 900); // 15 min cache

    return NextResponse.json<ApiResponse<WeatherData>>({
      success: true,
      data: weather,
      meta: { timestamp: new Date().toISOString(), cached: false },
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'WEATHER_FETCH_FAILED', message: err.message || 'Weather request failed' },
        meta: { timestamp: new Date().toISOString(), cached: false },
      },
      { status: 500 }
    );
  }
}
