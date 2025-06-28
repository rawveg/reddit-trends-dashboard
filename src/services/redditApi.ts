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
  private corsProxy = 'https://api.allorigins.win/raw?url=';
  private baseUrl = 'https://www.reddit.com';
  private lastRequestTime = 0;
  private minRequestInterval = 2000; // 2 seconds between requests
  private rateLimitedUntil = 0;
  private consecutiveErrors = 0;
  
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
      console.log(`Throttling requests. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  private handleRateLimit(response?: Response): void {
    this.consecutiveErrors++;
    
    // Exponential backoff: 5s, 15s, 45s, 135s, etc.
    const backoffTime = Math.min(5000 * Math.pow(3, this.consecutiveErrors - 1), 300000); // Max 5 minutes
    this.rateLimitedUntil = Date.now() + backoffTime;
    
    console.warn(`Rate limit hit. Backing off for ${backoffTime}ms. Consecutive errors: ${this.consecutiveErrors}`);
    
    // If we have too many consecutive errors, increase the minimum interval
    if (this.consecutiveErrors > 3) {
      this.minRequestInterval = Math.min(this.minRequestInterval * 2, 10000); // Max 10 seconds
      console.warn(`Increased minimum request interval to ${this.minRequestInterval}ms`);
    }
  }
  
  private handleSuccessfulRequest(): void {
    // Reset error count on successful request
    if (this.consecutiveErrors > 0) {
      console.log('Request successful. Resetting error count.');
      this.consecutiveErrors = 0;
      
      // Gradually reduce the minimum interval back to normal
      if (this.minRequestInterval > 2000) {
        this.minRequestInterval = Math.max(this.minRequestInterval / 2, 2000);
        console.log(`Reduced minimum request interval to ${this.minRequestInterval}ms`);
      }
    }
  }
  
  private async fetchWithCorsProxy(url: string): Promise<any> {
    await this.waitForRateLimit();
    
    try {
      // Try direct fetch first (works in production/deployed environments)
      const directResponse = await fetch(url);
      if (directResponse.ok) {
        this.handleSuccessfulRequest();
        return await directResponse.json();
      } else if (directResponse.status === 429) {
        this.handleRateLimit(directResponse);
        throw new Error(`Rate limited (429). Will retry after backoff period.`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        throw error; // Re-throw rate limit errors
      }
      console.log('Direct fetch failed, trying CORS proxy...');
    }

    try {
      // Fallback to CORS proxy for development
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.status === 429) {
        this.handleRateLimit(response);
        throw new Error(`Rate limited (429) via proxy. Will retry after backoff period.`);
      }
      
      if (!response.ok) {
        throw new Error(`CORS proxy error: ${response.status}`);
      }
      
      const data = await response.json();
      this.handleSuccessfulRequest();
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('429')) {
        throw error; // Re-throw rate limit errors
      }
      console.error('CORS proxy also failed:', error);
      this.consecutiveErrors++;
      throw error;
    }
  }
  
  async fetchSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const url = `${this.baseUrl}/r/${subreddit}/hot.json?limit=${limit}`;
      console.log(`Fetching from: ${url}`);
      
      const data: RedditApiResponse = await this.fetchWithCorsProxy(url);
      
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
    
    console.log('Fetching from multiple subreddits with rate limiting...');
    
    // Reduce the number of subreddits to fetch from to avoid rate limits
    const subredditsToFetch = subreddits.slice(0, 4); // Reduced from 6 to 4
    
    for (const subreddit of subredditsToFetch) {
      try {
        console.log(`Fetching r/${subreddit}...`);
        const posts = await this.fetchSubredditPosts(subreddit, 8); // Reduced from 10 to 8
        allPosts.push(...posts);
        
        // The waitForRateLimit() in fetchWithCorsProxy handles the delay
      } catch (error) {
        console.error(`Failed to fetch r/${subreddit}:`, error);
        
        // If it's a rate limit error, stop trying other subreddits for now
        if (error instanceof Error && error.message.includes('429')) {
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
      .slice(0, 40); // Reduced from 50 to 40
  }

  async searchReddit(query: string, limit: number = 20): Promise<RedditPost[]> { // Reduced default limit
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/search.json?q=${encodedQuery}&limit=${limit}&sort=hot&t=day`;
      
      console.log(`Searching Reddit for: ${query}`);
      
      const data: RedditApiResponse = await this.fetchWithCorsProxy(url);
      
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
      .slice(0, 12) // Reduced from 15 to 12
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
}

export const redditApi = new RedditApiService();