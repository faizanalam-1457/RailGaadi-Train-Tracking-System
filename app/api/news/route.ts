import { NextRequest, NextResponse } from 'next/server';
import { fetchGuardianNews, GuardianApiError } from '@/lib/api/guardian';
import { redisGet, redisSet } from '@/lib/redis';
import { checkRateLimit } from '@/lib/ratelimit';
import { ApiResponse } from '@/types/api';
import { NewsArticle, NewsTopicKey, NEWS_TOPICS } from '@/types/news';

export interface NewsResponseData {
  articles: NewsArticle[];
  total: number;
  page: number;
  pages: number;
}

export async function GET(request: NextRequest) {
  // Rate limiting per client IP
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`news:${ip}`, 60, 60);

  if (!rateLimit.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: 'NEWS_RATE_LIMITED', message: 'News request rate limit exceeded. Please wait a moment.' },
        meta: { timestamp: new Date().toISOString(), cached: false, provider: 'The Guardian' },
      },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const rawTopic = (searchParams.get('topic') || 'all').toLowerCase() as NewsTopicKey;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));

  // Validate topic key
  const topic: NewsTopicKey = NEWS_TOPICS[rawTopic] ? rawTopic : 'all';

  // Construct cache key
  const cacheKey = `news:${topic}:${encodeURIComponent(q)}:${page}:${limit}`;

  // Check Redis / In-Memory Cache
  const cached = await redisGet<NewsResponseData>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<NewsResponseData>>({
      success: true,
      data: cached,
      meta: {
        timestamp: new Date().toISOString(),
        cached: true,
        provider: 'The Guardian',
      },
    });
  }

  try {
    const result = await fetchGuardianNews({
      query: q || undefined,
      topic,
      page,
      limit,
    });

    const responseData: NewsResponseData = {
      articles: result.articles,
      total: result.total,
      page: result.page,
      pages: result.pages,
    };

    // Cache for 10 minutes (600s)
    await redisSet(cacheKey, responseData, 600);

    return NextResponse.json<ApiResponse<NewsResponseData>>({
      success: true,
      data: responseData,
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        provider: 'The Guardian',
      },
    });
  } catch (err: any) {
    let statusCode = 500;
    let errorCode = 'NEWS_PROVIDER_UNAVAILABLE';
    let errorMessage = 'Unable to fetch railway news right now. Please try again.';

    if (err instanceof GuardianApiError) {
      statusCode = err.status;
      errorCode = err.code;
      errorMessage = err.message;
    }

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { code: errorCode, message: errorMessage },
        meta: { timestamp: new Date().toISOString(), cached: false, provider: 'The Guardian' },
      },
      { status: statusCode }
    );
  }
}
