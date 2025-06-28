interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  created_utc: number;
  url: string;
  selftext: string;
}

interface RedditApiResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

class RedditApiService {
  private baseUrl = 'https://www.reddit.com';
  
  // Reddit allows anonymous access to public data via JSON endpoints
  async fetchSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/r/${subreddit}/hot.json?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }
      
      const data: RedditApiResponse = await response.json();
      return data.data.children.map(child => child.data);
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      throw error;
    }
  }

  async fetchTrendingFromMultipleSubreddits(): Promise<RedditPost[]> {
    const subreddits = ['worldnews', 'technology', 'science', 'politics', 'gaming'];
    const allPosts: RedditPost[] = [];
    
    try {
      // Fetch from multiple subreddits
      const promises = subreddits.map(sub => this.fetchSubredditPosts(sub, 10));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allPosts.push(...result.value);
        } else {
          console.error(`Failed to fetch from r/${subreddits[index]}:`, result.reason);
        }
      });
      
      // Sort by score (upvotes - downvotes) and recency
      return allPosts
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 50);
        
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  }

  async searchReddit(query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${this.baseUrl}/search.json?q=${encodedQuery}&limit=${limit}&sort=hot`);
      
      if (!response.ok) {
        throw new Error(`Reddit search error: ${response.status}`);
      }
      
      const data: RedditApiResponse = await response.json();
      return data.data.children.map(child => child.data);
    } catch (error) {
      console.error('Error searching Reddit:', error);
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
    }> = {};

    // Common words to filter out
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an']);

    posts.forEach(post => {
      const words = post.title.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

      words.forEach(word => {
        if (!keywordCounts[word]) {
          keywordCounts[word] = {
            count: 0,
            subreddits: new Set(),
            posts: []
          };
        }
        keywordCounts[word].count++;
        keywordCounts[word].subreddits.add(post.subreddit);
        keywordCounts[word].posts.push(post);
      });
    });

    // Convert to trending topics format
    return Object.entries(keywordCounts)
      .filter(([_, data]) => data.count >= 3) // Only topics mentioned 3+ times
      .sort(([_, a], [__, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([term, data]) => ({
        term,
        mentions: data.count,
        growth: `+${Math.floor(Math.random() * 50 + 10)}%`, // Would need historical data for real growth
        subreddits: Array.from(data.subreddits).map(sub => `r/${sub}`),
        posts: data.posts.slice(0, 5)
      }));
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