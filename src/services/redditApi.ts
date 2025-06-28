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
  
  private async fetchWithCorsProxy(url: string): Promise<any> {
    try {
      // Try direct fetch first (works in production/deployed environments)
      const directResponse = await fetch(url);
      if (directResponse.ok) {
        return await directResponse.json();
      }
    } catch (error) {
      console.log('Direct fetch failed, trying CORS proxy...');
    }

    try {
      // Fallback to CORS proxy for development
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`CORS proxy error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CORS proxy also failed:', error);
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
        // Use permalink for proper Reddit URLs
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
    
    console.log('Fetching from multiple subreddits...');
    
    // Fetch from subreddits with delay to avoid rate limiting
    for (const subreddit of subreddits.slice(0, 6)) { // Limit to 6 to avoid too many requests
      try {
        console.log(`Fetching r/${subreddit}...`);
        const posts = await this.fetchSubredditPosts(subreddit, 10);
        allPosts.push(...posts);
        
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to fetch r/${subreddit}:`, error);
        // Continue with other subreddits even if one fails
      }
    }
    
    // Sort by score and recency
    return allPosts
      .filter(post => post.title && post.subreddit) // Filter out invalid posts
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 50);
  }

  async searchReddit(query: string, limit: number = 25): Promise<RedditPost[]> {
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
        // Use permalink for proper Reddit URLs
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
      .filter(([_, data]) => data.count >= 2) // Lower threshold for more topics
      .sort(([_, a], [__, b]) => {
        // Sort by combination of frequency and total score
        const scoreA = a.count * 100 + a.totalScore;
        const scoreB = b.count * 100 + b.totalScore;
        return scoreB - scoreA;
      })
      .slice(0, 15)
      .map(([term, data]) => ({
        term,
        mentions: data.totalScore, // Use total score as mentions for more realistic numbers
        growth: `+${Math.floor(Math.random() * 80 + 10)}%`, // Random growth for now
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
}

export const redditApi = new RedditApiService();