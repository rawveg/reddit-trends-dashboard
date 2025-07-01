import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// Simple in-memory cache (will be reset on each function invocation)
const cache = new Map<string, CacheEntry>();

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const REDDIT_BASE_URL = 'https://www.reddit.com';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // Max requests per minute

function getCacheKey(path: string, query: string): string {
  return `${path}?${query}`;
}

function isValidCacheEntry(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // Reset or create new rate limit window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      resetTime: existing.resetTime 
    };
  }

  // Increment count
  existing.count++;
  rateLimitStore.set(key, existing);
  return { allowed: true };
}

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : req.headers['x-real-ip'] || 
      req.connection?.remoteAddress || 
      'unknown';
  return typeof ip === 'string' ? ip : 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      const resetIn = Math.ceil((rateLimitCheck.resetTime! - Date.now()) / 1000);
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        resetIn,
        message: `Too many requests. Try again in ${resetIn} seconds.`
      });
    }

    // Extract path from the dynamic route
    const { path, ...queryParams } = req.query;
    
    if (!path || !Array.isArray(path)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    // Reconstruct the Reddit API path
    const redditPath = '/' + path.join('/');
    
    // Build query string from remaining query parameters
    const urlParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          urlParams.append(key, value[0]);
        } else {
          urlParams.append(key, value);
        }
      }
    });
    
    const queryString = urlParams.toString();
    const fullUrl = `${REDDIT_BASE_URL}${redditPath}${queryString ? `?${queryString}` : ''}`;
    
    // Check cache first
    const cacheKey = getCacheKey(redditPath, queryString);
    const cachedEntry = cache.get(cacheKey);
    
    if (cachedEntry && isValidCacheEntry(cachedEntry)) {
      console.log(`Cache hit for: ${cacheKey}`);
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
      
      return res.status(200).json(cachedEntry.data);
    }

    console.log(`Fetching from Reddit: ${fullUrl}`);

    // Fetch from Reddit API
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'RedditTrendsBot/1.0 (by /u/RedditTrendsApp)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'Reddit API rate limit exceeded',
          message: 'Reddit is temporarily limiting requests. Please try again later.',
          retryAfter: response.headers.get('retry-after') || '60'
        });
      }
      
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Reddit API error: ${response.status} ${response.statusText} - ${errorText}`);
      
      return res.status(response.status).json({
        error: `Reddit API error: ${response.status} ${response.statusText}`,
        message: errorText
      });
    }

    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    });

    // Clean up old cache entries (simple cleanup)
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (!isValidCacheEntry(entry)) {
          cache.delete(key);
        }
      }
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    
    // Add rate limit headers
    const currentRateLimit = rateLimitStore.get(`rate_limit_${clientIP}`);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - (currentRateLimit?.count || 0)).toString());

    return res.status(200).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}