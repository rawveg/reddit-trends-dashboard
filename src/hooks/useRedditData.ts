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

  const fetchRedditData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching real Reddit data...');
      
      // Fetch trending posts from multiple subreddits
      const posts = await redditApi.fetchTrendingFromMultipleSubreddits();
      
      // Extract trending topics from the posts
      const topics = redditApi.extractTrendingTopics(posts);
      
      // Format posts for display
      const formattedPosts = posts.slice(0, 20).map(post => ({
        id: post.id,
        title: post.title,
        subreddit: post.subreddit,
        author: post.author,
        upvotes: post.upvotes,
        comments: post.comments,
        timeAgo: redditApi.getTimeAgo(post.created_utc),
        url: `https://reddit.com${post.url}`
      }));
      
      setTrendingTopics(topics);
      setRecentPosts(formattedPosts);
      
      console.log('Successfully fetched Reddit data:', {
        topics: topics.length,
        posts: formattedPosts.length
      });
      
    } catch (err) {
      console.error('Failed to fetch Reddit data:', err);
      setError('Failed to fetch Reddit data. This might be due to CORS restrictions or rate limiting.');
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
        title: post.title,
        subreddit: `r/${post.subreddit}`,
        upvotes: post.upvotes,
        comments: post.comments,
        timeAgo: redditApi.getTimeAgo(post.created_utc)
      }));
      
      return formattedResults;
    } catch (err) {
      console.error('Reddit search failed:', err);
      setError('Search failed. This might be due to CORS restrictions.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedditData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchRedditData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    trendingTopics,
    recentPosts,
    subredditData: [], // Would need additional API calls for subreddit stats
    loading,
    error,
    searchReddit,
    refreshData: fetchRedditData
  };
};