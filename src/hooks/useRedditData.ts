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
  const [retryCount, setRetryCount] = useState(0);

  const fetchRedditData = async (isRetry = false) => {
    try {
      setLoading(true);
      if (!isRetry) {
        setError(null);
      }
      
      console.log('Fetching Reddit data with CORS proxy...');
      
      // Fetch trending posts from multiple subreddits
      const posts = await redditApi.fetchTrendingFromMultipleSubreddits();
      
      if (posts.length === 0) {
        throw new Error('No posts retrieved from Reddit API');
      }
      
      // Extract trending topics from the posts
      const topics = redditApi.extractTrendingTopics(posts);
      
      // Format posts for display
      const formattedPosts = posts.slice(0, 20).map(post => ({
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
      setRetryCount(0);
      
      console.log('Successfully fetched Reddit data:', {
        topics: topics.length,
        posts: formattedPosts.length
      });
      
    } catch (err) {
      console.error('Failed to fetch Reddit data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      
      if (retryCount < 2) {
        console.log(`Retrying... (attempt ${retryCount + 1}/2)`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchRedditData(true), 2000);
        return;
      }
      
      setError(`Failed to fetch Reddit data: ${errorMessage}. Using CORS proxy but Reddit may be blocking requests.`);
    } finally {
      setLoading(false);
    }
  };

  const searchReddit = async (query: string) => {
    try {
      setLoading(true);
      console.log('Searching Reddit for:', query);
      
      const searchResults = await redditApi.searchReddit(query);
      
      // Format search results
      const formattedResults = searchResults.map(post => ({
        type: 'post' as const,
        title: post.title || 'Untitled',
        subreddit: `r/${post.subreddit}`,
        upvotes: post.upvotes || 0,
        comments: post.comments || 0,
        timeAgo: redditApi.getTimeAgo(post.created_utc || Date.now() / 1000)
      }));
      
      return formattedResults;
    } catch (err) {
      console.error('Reddit search failed:', err);
      setError('Search failed. Reddit API may be temporarily unavailable.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedditData();
    
    // Refresh data every 15 minutes (less frequent to avoid rate limits)
    const interval = setInterval(() => fetchRedditData(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    trendingTopics,
    recentPosts,
    subredditData: [], // Would need additional API calls for subreddit stats
    loading,
    error,
    searchReddit,
    refreshData: () => fetchRedditData()
  };
};