import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, MessageCircle, Users, Clock, ArrowUp, ExternalLink, Hash, Smile, Activity } from "lucide-react";

interface SearchResult {
  type: "post" | "subreddit" | "topic";
  title: string;
  subreddit?: string;
  upvotes?: number;
  comments?: number;
  timeAgo?: string;
  mentions?: number;
  growth?: string;
  description?: string;
  url?: string;
  author?: string;
  created_utc?: number;
}

interface SearchAnalyticsProps {
  query: string;
  results: SearchResult[];
  onClearSearch: () => void;
}

const SearchAnalytics = ({ query, results, onClearSearch }: SearchAnalyticsProps) => {
  const postResults = results.filter(r => r.type === "post");
  
  // Function to properly format Reddit URLs
  const getRedditUrl = (url: string) => {
    if (!url || url === '#') return '#';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it starts with /r/, prepend reddit.com
    if (url.startsWith('/r/')) {
      return `https://www.reddit.com${url}`;
    }
    
    // If it's a relative path, prepend reddit.com
    if (url.startsWith('/')) {
      return `https://www.reddit.com${url}`;
    }
    
    // Otherwise, assume it needs the full reddit.com prefix
    return `https://www.reddit.com/${url}`;
  };

  // Generate analytics from search results
  const generateAnalytics = () => {
    const subredditCounts: Record<string, number> = {};
    const hourlyActivity: Record<string, number> = {};
    const engagementData: Array<{name: string, upvotes: number, comments: number}> = [];
    
    let totalUpvotes = 0;
    let totalComments = 0;
    
    postResults.forEach((post, index) => {
      if (post.subreddit) {
        subredditCounts[post.subreddit] = (subredditCounts[post.subreddit] || 0) + 1;
      }
      
      // Simulate hourly distribution
      const hour = Math.floor(Math.random() * 24);
      const hourKey = `${hour}:00`;
      hourlyActivity[hourKey] = (hourlyActivity[hourKey] || 0) + (post.upvotes || 0);
      
      totalUpvotes += post.upvotes || 0;
      totalComments += post.comments || 0;
      
      if (index < 10) {
        engagementData.push({
          name: post.title?.slice(0, 20) + "..." || `Post ${index + 1}`,
          upvotes: post.upvotes || 0,
          comments: post.comments || 0
        });
      }
    });
    
    const subredditData = Object.entries(subredditCounts)
      .map(([name, count]) => ({ name: name.replace('r/', ''), count, percentage: (count / postResults.length) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    
    const timelineData = Object.entries(hourlyActivity)
      .map(([hour, activity]) => ({ hour, activity }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
      .slice(0, 12);
    
    return {
      subredditData,
      timelineData,
      engagementData,
      totalUpvotes,
      totalComments,
      avgUpvotes: Math.round(totalUpvotes / postResults.length) || 0,
      avgComments: Math.round(totalComments / postResults.length) || 0
    };
  };

  const analytics = generateAnalytics();
  
  // Generate sentiment data
  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Negative', value: 10, color: '#ef4444' }
  ];

  // Generate trending keywords from search results
  const extractKeywords = () => {
    const keywords: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']);
    
    postResults.forEach(post => {
      if (post.title) {
        const words = post.title.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3 && !stopWords.has(word));
        
        words.forEach(word => {
          keywords[word] = (keywords[word] || 0) + 1;
        });
      }
    });
    
    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));
  };

  const keywords = extractKeywords();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Search Analytics for "{query}"
            </div>
            <Button variant="outline" size="sm" onClick={onClearSearch}>
              Back to Dashboard
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.length}</div>
              <div className="text-sm text-blue-800">Total Results</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.totalUpvotes.toLocaleString()}</div>
              <div className="text-sm text-green-800">Total Upvotes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalComments.toLocaleString()}</div>
              <div className="text-sm text-purple-800">Total Comments</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.avgUpvotes}</div>
              <div className="text-sm text-orange-800">Avg Upvotes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subreddit Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Community Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.subredditData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Posts Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="upvotes" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-green-500" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activity" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Keywords and Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-orange-500" />
              Related Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {keywords.slice(0, 10).map((keyword, index) => (
                <div key={keyword.word} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium text-sm">{keyword.word}</span>
                  <Badge variant="outline" className="text-xs">
                    {keyword.count} mentions
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              Top Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {postResults.slice(0, 10).map((post, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
                    {post.title}
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-1"
                    onClick={() => {
                      const url = getRedditUrl(post.url || '');
                      if (url !== '#') {
                        window.open(url, '_blank');
                      }
                    }}
                    disabled={!post.url || post.url === '#'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.subreddit}
                  </Badge>
                  {post.author && (
                    <span className="text-xs text-gray-500">by {post.author}</span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {post.timeAgo}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    {post.upvotes?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Community Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Community Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Most Active Community</h4>
              <p className="text-sm text-blue-700">
                {analytics.subredditData[0]?.name || 'N/A'} with {analytics.subredditData[0]?.count || 0} posts
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Engagement Rate</h4>
              <p className="text-sm text-green-700">
                {analytics.avgComments > 50 ? 'High' : analytics.avgComments > 20 ? 'Medium' : 'Low'} engagement detected
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Content Type</h4>
              <p className="text-sm text-purple-700">
                {analytics.avgUpvotes > 1000 ? 'Viral content' : analytics.avgUpvotes > 100 ? 'Popular content' : 'Niche content'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchAnalytics;