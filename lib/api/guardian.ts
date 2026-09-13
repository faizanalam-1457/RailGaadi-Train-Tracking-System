import { env } from '@/config/env';
import { NewsArticle, NewsTopicKey, NEWS_TOPICS } from '@/types/news';

interface GuardianField {
  headline?: string;
  trailText?: string;
  thumbnail?: string;
  byline?: string;
}

interface GuardianResult {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: GuardianField;
}

interface GuardianSearchResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianResult[];
  };
}

export class GuardianApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number = 500) {
    super(message);
    this.name = 'GuardianApiError';
    this.code = code;
    this.status = status;
  }
}

/**
  Strip HTML tags from excerpt text safely.
 */
function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Normalizes raw Guardian API items into standard RailGaadi NewsArticle objects.
 */
export function normalizeGuardianArticle(item: GuardianResult, topic?: string): NewsArticle {
  const description = stripHtml(item.fields?.trailText || '');
  const title = item.fields?.headline || item.webTitle || 'Railway News Update';

  return {
    id: item.id,
    title,
    description: description || undefined,
    url: item.webUrl,
    publishedAt: item.webPublicationDate,
    section: item.sectionName || 'Rail & Transit',
    thumbnail: item.fields?.thumbnail || undefined,
    source: 'The Guardian',
    topic,
  };
}

/**
 * Deduplicates articles by ID.
 */
export function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((art) => {
    if (!art.id || seen.has(art.id)) return false;
    seen.add(art.id);
    return true;
  });
}

export interface FetchNewsOptions {
  query?: string;
  topic?: NewsTopicKey;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
}

/**
 * Server-Side Guardian API Fetcher.
 * Uses GUARDIAN_API_KEY safely on server only.
 */
export async function fetchGuardianNews(options: FetchNewsOptions = {}): Promise<{
  articles: NewsArticle[];
  total: number;
  page: number;
  pages: number;
  queryUsed: string;
}> {
  const apiKey = env.GUARDIAN_API_KEY;

  if (!apiKey) {
    throw new GuardianApiError(
      'NEWS_PROVIDER_AUTH_ERROR',
      'The Guardian API key is not configured on server.',
      401
    );
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(20, Math.max(1, options.limit || 12));

  // Determine query string
  let searchQ = '';
  if (options.query && options.query.trim()) {
    searchQ = options.query.trim();
  } else if (options.topic && NEWS_TOPICS[options.topic]) {
    searchQ = NEWS_TOPICS[options.topic].query;
  } else {
    searchQ = NEWS_TOPICS.all.query;
  }

  const params = new URLSearchParams({
    'api-key': apiKey,
    q: searchQ,
    page: page.toString(),
    'page-size': limit.toString(),
    'order-by': 'newest',
    'show-fields': 'thumbnail,trailText,headline,byline',
  });

  if (options.fromDate) params.set('from-date', options.fromDate);
  if (options.toDate) params.set('to-date', options.toDate);

  const requestUrl = `${env.GUARDIAN_BASE_URL}/search?${params.toString()}`;

  try {
    const res = await fetch(requestUrl, {
      next: { revalidate: 300 }, // Next.js cache revalidate 5 min
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new GuardianApiError('NEWS_PROVIDER_AUTH_ERROR', 'Guardian API Authentication failed', res.status);
      }
      if (res.status === 429) {
        throw new GuardianApiError('NEWS_RATE_LIMITED', 'Guardian API rate limit reached', 429);
      }
      throw new GuardianApiError(
        'NEWS_PROVIDER_UNAVAILABLE',
        `Guardian API returned status ${res.status}`,
        res.status
      );
    }

    const json = (await res.json()) as GuardianSearchResponse;

    if (!json.response || !Array.isArray(json.response.results)) {
      throw new GuardianApiError('NEWS_DATA_INVALID', 'Malformed response structure from Guardian API', 502);
    }

    const normalized = json.response.results.map((item) =>
      normalizeGuardianArticle(item, options.topic || 'all')
    );
    const deduplicated = deduplicateArticles(normalized);

    return {
      articles: deduplicated,
      total: json.response.total || deduplicated.length,
      page: json.response.currentPage || page,
      pages: json.response.pages || 1,
      queryUsed: searchQ,
    };
  } catch (err: any) {
    if (err instanceof GuardianApiError) throw err;
    throw new GuardianApiError(
      'NEWS_PROVIDER_UNAVAILABLE',
      err.message || 'Failed to fetch news from provider',
      500
    );
  }
}
