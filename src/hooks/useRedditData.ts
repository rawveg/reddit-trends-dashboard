import { useState, useEffect } from 'react';
import { redditApi } from '@/services/redditApi';

interface TrendingTopic {
  term: string;
  mentions: number;
  growth: string;
  subreddits: string[];
  posts?: any[];
}

interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  url: string;
}

export const useRedditData = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [recentPosts, setRecentPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

  const fetchRedditData = async (isManualRefresh = false) => {
    try {
      setLoading(true);
      
      // Check if we're rate limited
      if (redditApi.isRateLimited()) {
        const waitTime = redditApi.getRateLimitWaitTime();
        const waitMinutes = Math.ceil(waitTime / 60000);
        setError(`Rate limited. Please wait ${waitMinutes} minute(s) before trying again.`);
        setLoading(false);
        return;
      }
      
      if (!isManualRefresh) {
        setError(null);
      }
      
      console.log('Fetching Reddit data with rate limiting...');
      
      // Fetch trending posts from multiple subreddits
      const posts = await redditApi.fetchTrendingFromMultipleSubreddits();
      
      if (posts.length === 0) {
        throw new Error('No posts retrieved from Reddit API');
      }
      
      // Extract trending topics from the posts
      const topics = redditApi.extractTrendingTopics(posts);
      
      // Format posts for display
      const formattedPosts = posts.slice(0, 15).map(post => ({ // Reduced from 20 to 15
        id: post.id || Math.random().toString(),
        title: post.title || 'Untitled post',
        subreddit: post.subreddit || 'unknown',
        author: post.author || 'unknown',
        upvotes: post.upvotes || 0,
        comments: post.comments || 0,
        timeAgo: redditApi.getTimeAgo(post.created_utc || Date.now() / 1000),
        url: post.url || '#'
      }));
      
      setTrendingTopics(topics);
      setRecentPosts(formattedPosts);
      setError(null);
      setLastFetchTime(new Date());
      
      console.log('Successfully fetched Reddit data:', {
        topics: topics.length,
        posts: formattedPosts.length
      });
      
    } catch (err) {
      console.error('Failed to fetch Reddit data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      if (errorMessage.includes('429') || errorMessage.includes('Rate limited')) {
        const waitTime = redditApi.getRateLimitWaitTime();
        const waitMinutes = Math.ceil(waitTime / 60000);
        setError(`Rate limited by Reddit. Automatic retry in ${waitMinutes} minute(s). Please avoid manual refreshes.`);
      } else {
        setError(`Failed to fetch Reddit data: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchReddit = async (query: string) => {
    try {
      // Check if we're rate limited before searching
      if (redditApi.isRateLimited()) {
        const waitTime = redditApi.getRateLimitWaitTime();
        const waitMinutes = Math.ceil(waitTime / 60000);
        throw new Error(`Rate limited. Please wait ${waitMinutes} minute(s) before searching.`);
      }
      
      setLoading(true);
      console.log('Searching Reddit for:', query);
      
      const searchResults = await redditApi.searchReddit(query);
      
      // Format search results with more detailed information
      const formattedResults = searchResults.map(post => ({
        type: 'post' as const,
        title: post.title || 'Untitled',
        subreddit: `r/${post.subreddit}`,
        author: post.author || 'unknown',
        upvotes: post.upvotes || 0,
        comments: post.comments || 0,
        timeAgo: redditApi.getTimeAgo(post.created_utc || Date.now() / 1000),
        url: post.url || '#',
        created_utc: post.created_utc
      }));
      
      return formattedResults;
    } catch (err) {
      console.error('Reddit search failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedditData();
    
    // Increase refresh interval to 30 minutes to reduce rate limiting
    const interval = setInterval(() => {
      // Only auto-refresh if we're not rate limited
      if (!redditApi.isRateLimited()) {
        fetchRedditData();
      } else {
        console.log('Skipping auto-refresh due to rate limiting');
      }
    }, 30 * 60 * 1000); // 30 minutes instead of 15
    
    return () => clearInterval(interval);
  }, []);

  return {
    trendingTopics,
    recentPosts,
    subredditData: [],
    loading,
    error,
    lastFetchTime,
    searchReddit,
    refreshData: () => fetchRedditData(true)
  };
};