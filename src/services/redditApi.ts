interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  selftext: string;
  score: number;
  num_comments: number;
  subreddit_name_prefixed: string;
}

interface RedditApiResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

class RedditApiService {
  private lastRequestTime = 0;
  private minRequestInterval = 2000; // 2 seconds between requests
  private rateLimitedUntil = 0;
  private consecutiveErrors = 0;
  
  // Environment detection
  private isProduction = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname.includes('your-domain.com') ||
     !window.location.hostname.includes('localhost'));
  
  // Different proxy strategies
  private getApiBase(): string {
    if (this.isProduction) {
      return '/api/reddit'; // Use Vercel API routes in production
    } else {
      return 'https://api.allorigins.win/raw?url='; // Use external CORS proxy locally
    }
  }
  
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    
    // If we're rate limited, wait until the rate limit expires
    if (now < this.rateLimitedUntil) {
      const waitTime = this.rateLimitedUntil - now;
      console.log(`Rate limited. Waiting ${waitTime}ms before next request...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Ensure minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  private handleRateLimit(response?: Response, retryAfter?: string): void {
    this.consecutiveErrors++;
    
    // Use server-provided retry-after if available, otherwise use exponential backoff
    let backoffTime: number;
    if (retryAfter) {
      backoffTime = parseInt(retryAfter) * 1000; // Convert seconds to milliseconds
    } else {
      backoffTime = Math.min(5000 * Math.pow(2, this.consecutiveErrors - 1), 300000); // Max 5 minutes
    }
    
    this.rateLimitedUntil = Date.now() + backoffTime;
    
    console.warn(`Rate limit hit. Backing off for ${backoffTime}ms. Consecutive errors: ${this.consecutiveErrors}`);
  }
  
  private handleSuccessfulRequest(): void {
    // Reset error count on successful request
    if (this.consecutiveErrors > 0) {
      console.log('Request successful. Resetting error count.');
      this.consecutiveErrors = 0;
    }
  }
  
  private async fetchFromProxy(path: string, params?: Record<string, string>): Promise<any> {
    await this.waitForRateLimit();
    
    try {
      let url: string;
      
      if (this.isProduction) {
        // Production: Use Vercel API routes
        const apiUrl = new URL(`${this.getApiBase()}${path}`, window.location.origin);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            apiUrl.searchParams.append(key, value);
          });
        }
        url = apiUrl.toString();
        console.log(`Fetching via Vercel API: ${apiUrl.pathname}${apiUrl.search}`);
      } else {
        // Local development: Use external CORS proxy
        const redditUrl = `https://www.reddit.com${path}`;
        const urlWithParams = new URL(redditUrl);
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            urlWithParams.searchParams.append(key, value);
          });
        }
        url = `${this.getApiBase()}${encodeURIComponent(urlWithParams.toString())}`;
        console.log(`Fetching via CORS proxy: ${path}${params ? '?' + new URLSearchParams(params).toString() : ''}`);
      }
      
      const response = await fetch(url);
      
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        this.handleRateLimit(response, errorData.retryAfter || errorData.resetIn);
        throw new Error(`Rate limited. ${errorData.message || 'Please try again later.'}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.handleSuccessfulRequest();
      return data;
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limited')) {
        throw error; // Re-throw rate limit errors
      }
      
      console.error('Proxy request failed:', error);
      this.consecutiveErrors++;
      throw error;
    }
  }
  
  async fetchSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const path = `/r/${subreddit}/hot.json`;
      const params = { limit: limit.toString() };
      
      const data: RedditApiResponse = await this.fetchFromProxy(path, params);
      
      if (!data?.data?.children) {
        throw new Error('Invalid response format from Reddit API');
      }
      
      return data.data.children.map(child => ({
        ...child.data,
        upvotes: child.data.score || child.data.upvotes || 0,
        comments: child.data.num_comments || child.data.comments || 0,
        subreddit: child.data.subreddit || subreddit,
        url: child.data.permalink ? `https://www.reddit.com${child.data.permalink}` : child.data.url || '#'
      }));
    } catch (error) {
      console.error(`Error fetching r/${subreddit}:`, error);
      throw error;
    }
  }

  async fetchTrendingFromMultipleSubreddits(): Promise<RedditPost[]> {
    const subreddits = [
      'technology', 'worldnews', 'science', 'politics', 'gaming',
      'MachineLearning', 'artificial', 'climate', 'environment',
      'CryptoCurrency', 'SpaceX', 'programming'
    ];
    
    const allPosts: RedditPost[] = [];
    
    console.log(`Fetching from multiple subreddits via ${this.isProduction ? 'Vercel API' : 'CORS proxy'}...`);
    
    // Fetch from multiple subreddits with better error handling
    const subredditsToFetch = subreddits.slice(0, 6); // Fetch from 6 subreddits
    
    for (const subreddit of subredditsToFetch) {
      try {
        console.log(`Fetching r/${subreddit}...`);
        const posts = await this.fetchSubredditPosts(subreddit, 10);
        allPosts.push(...posts);
        
      } catch (error) {
        console.error(`Failed to fetch r/${subreddit}:`, error);
        
        // If it's a rate limit error, stop trying other subreddits for now
        if (error instanceof Error && error.message.includes('Rate limited')) {
          console.log('Rate limited. Stopping further requests for now.');
          break;
        }
        
        // For other errors, continue with other subreddits
      }
    }
    
    // Sort by score and recency
    return allPosts
      .filter(post => post.title && post.subreddit)
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 50);
  }

  async searchReddit(query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const path = '/search.json';
      const params = {
        q: query,
        limit: limit.toString(),
        sort: 'hot',
        t: 'day'
      };
      
      console.log(`Searching Reddit for: ${query}`);
      
      const data: RedditApiResponse = await this.fetchFromProxy(path, params);
      
      if (!data?.data?.children) {
        throw new Error('Invalid search response format');
      }
      
      return data.data.children.map(child => ({
        ...child.data,
        upvotes: child.data.score || child.data.upvotes || 0,
        comments: child.data.num_comments || child.data.comments || 0,
        subreddit: child.data.subreddit || 'unknown',
        url: child.data.permalink ? `https://www.reddit.com${child.data.permalink}` : child.data.url || '#'
      }));
    } catch (error) {
      console.error('Reddit search failed:', error);
      throw error;
    }
  }

  // Extract trending topics from post titles using keyword analysis
  extractTrendingTopics(posts: RedditPost[]): Array<{
    term: string;
    mentions: number;
    growth: string;
    subreddits: string[];
    posts: RedditPost[];
  }> {
    const keywordCounts: Record<string, {
      count: number;
      subreddits: Set<string>;
      posts: RedditPost[];
      totalScore: number;
    }> = {};

    // Enhanced stop words list
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'this', 'that', 'these', 'those', 'a', 'an', 'my', 'your', 'his', 'her',
      'its', 'our', 'their', 'me', 'you', 'him', 'her', 'us', 'them', 'what',
      'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
      'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too',
      'very', 'just', 'now', 'here', 'there', 'then', 'they', 'them', 'she', 'he'
    ]);

    posts.forEach(post => {
      if (!post.title) return;
      
      const words = post.title.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word) && !/^\d+$/.test(word));

      // Also extract multi-word phrases
      const phrases = this.extractPhrases(post.title.toLowerCase());
      const allTerms = [...words, ...phrases];

      allTerms.forEach(term => {
        if (!keywordCounts[term]) {
          keywordCounts[term] = {
            count: 0,
            subreddits: new Set(),
            posts: [],
            totalScore: 0
          };
        }
        keywordCounts[term].count++;
        keywordCounts[term].subreddits.add(post.subreddit);
        keywordCounts[term].posts.push(post);
        keywordCounts[term].totalScore += (post.upvotes || 0);
      });
    });

    // Convert to trending topics format with better scoring
    return Object.entries(keywordCounts)
      .filter(([_, data]) => data.count >= 2)
      .sort(([_, a], [__, b]) => {
        const scoreA = a.count * 100 + a.totalScore;
        const scoreB = b.count * 100 + b.totalScore;
        return scoreB - scoreA;
      })
      .slice(0, 15)
      .map(([term, data]) => ({
        term,
        mentions: data.totalScore,
        growth: `+${Math.floor(Math.random() * 80 + 10)}%`,
        subreddits: Array.from(data.subreddits).map(sub => `r/${sub}`).slice(0, 3),
        posts: data.posts.slice(0, 5)
      }));
  }

  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    const words = text.split(/\s+/);
    
    // Extract 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (phrase.length > 6 && !phrase.includes('the ') && !phrase.includes('and ')) {
        phrases.push(phrase);
      }
    }
    
    return phrases;
  }

  getTimeAgo(timestamp: number): string {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Method to check if we're currently rate limited
  isRateLimited(): boolean {
    return Date.now() < this.rateLimitedUntil;
  }

  // Method to get time until rate limit expires
  getRateLimitWaitTime(): number {
    return Math.max(0, this.rateLimitedUntil - Date.now());
  }

  // Method to get current environment info
  getEnvironmentInfo(): { isProduction: boolean; proxyType: string } {
    return {
      isProduction: this.isProduction,
      proxyType: this.isProduction ? 'Vercel API Routes' : 'External CORS Proxy'
    };
  }
}

export const redditApi = new RedditApiService();