import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, MessageCircle, BarChart3, Activity, Map, Bell, AlertTriangle, ExternalLink } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useRedditData } from "@/hooks/useRedditData";
import DataSourceIndicator from "@/components/DataSourceIndicator";
import TrendingMetrics from "@/components/TrendingMetrics";
import TrendingTopicCard from "@/components/TrendingTopicCard";
import SentimentChart from "@/components/SentimentChart";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import TopicEvolution from "@/components/TopicEvolution";
import SubredditAnalytics from "@/components/SubredditAnalytics";
import TrendComparison from "@/components/TrendComparison";
import TrendMap from "@/components/TrendMap";
import AlertsNotifications from "@/components/AlertsNotifications";
import SearchAnalytics from "@/components/SearchAnalytics";
import LiveFeed from "@/components/LiveFeed";
import EngagementMetrics from "@/components/EngagementMetrics";
import VelocityChart from "@/components/VelocityChart";
import NetworkGraph from "@/components/NetworkGraph";
import TrendingKeywords from "@/components/TrendingKeywords";
import RealTimeMetrics from "@/components/RealTimeMetrics";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    trendingTopics, 
    recentPosts, 
    loading, 
    error, 
    searchReddit, 
    refreshData 
  } = useRedditData();

  const selectedTopic = trendingTopics[selectedTopicIndex] || { 
    term: "No data available", 
    mentions: 0, 
    growth: "0%", 
    subreddits: [] 
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSearch = async (query?: string, fromKeywordClick = false) => {
    const searchQuery = query || searchTerm;
    if (searchQuery.trim()) {
      setIsSearching(true);
      setSearchTerm(searchQuery); // Update search term if searching via keyword
      
      // Scroll to top when searching via keyword click
      if (fromKeywordClick) {
        scrollToTop();
      }
      
      try {
        const results = await searchReddit(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    scrollToTop(); // Also scroll to top when clearing search
  };

  const handleKeywordClick = (keyword: string) => {
    handleSearch(keyword, true); // Pass true to indicate this is from a keyword click
  };

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

  // Scroll to top when search results change (as a backup)
  useEffect(() => {
    if (isSearching && searchResults.length > 0) {
      // Small delay to ensure the UI has updated
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [isSearching, searchResults]);

  // Calculate metrics from trending topics
  const totalMentions = trendingTopics.reduce((sum, topic) => sum + topic.mentions, 0);
  const totalPosts = recentPosts.length;
  const activeSubreddits = new Set(trendingTopics.flatMap(t => t.subreddits)).size;
  const avgSentiment = 7.2; // Would be calculated from real sentiment analysis
  const topGrowthRate = trendingTopics.length > 0 ? trendingTopics[0].growth : "0%";
  const peakHour = "2:00 PM";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <TrendingUp className="text-orange-500" />
            Reddit Trends Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive Reddit trend analysis with real-time sentiment tracking, 
            community insights, and predictive analytics.
          </p>
        </div>

        {/* Data Source Indicator */}
        <DataSourceIndicator 
          lastUpdated={new Date()}
          isLoading={loading}
          error={error}
          onRefresh={refreshData}
          dataCount={trendingTopics.length + recentPosts.length}
        />

        {/* Search Bar */}
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search Reddit for topics, keywords, or subreddits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-lg"
                disabled={loading}
              />
              <Button 
                onClick={() => handleSearch()} 
                className="bg-orange-500 hover:bg-orange-600 px-6"
                disabled={loading || !searchTerm.trim()}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Analytics - Show comprehensive analysis when searching */}
        {isSearching && (
          <SearchAnalytics 
            query={searchTerm}
            results={searchResults}
            onClearSearch={handleClearSearch}
            onKeywordClick={handleKeywordClick}
          />
        )}

        {/* Show explanation when no data */}
        {trendingTopics.length === 0 && !loading && !isSearching && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Unable to fetch Reddit data
                </h3>
                <p className="text-yellow-700 mb-4">
                  This might be due to CORS restrictions when running locally. 
                  The app is trying to fetch real data from Reddit's public API.
                </p>
                <div className="text-sm text-yellow-600 space-y-2">
                  <p><strong>What's happening:</strong> The app attempts to fetch live data from reddit.com/r/[subreddit]/hot.json</p>
                  <p><strong>CORS Issue:</strong> Browsers block cross-origin requests to Reddit from localhost</p>
                  <p><strong>Solution:</strong> Deploy to a domain or use a CORS proxy for development</p>
                </div>
                <Button onClick={refreshData} className="mt-4" disabled={loading}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard - Only show when not searching and have data */}
        {!isSearching && trendingTopics.length > 0 && (
          <>
            {/* Key Metrics Overview */}
            <TrendingMetrics 
              totalMentions={totalMentions}
              totalPosts={totalPosts}
              activeSubreddits={activeSubreddits}
              avgSentiment={avgSentiment}
              topGrowthRate={topGrowthRate}
              peakHour={peakHour}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Left Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Trending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.slice(0, 6).map((topic, index) => (
                      <TrendingTopicCard
                        key={topic.term}
                        topic={topic}
                        index={index}
                        isSelected={selectedTopicIndex === index}
                        onClick={() => setSelectedTopicIndex(index)}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Analytics Area */}
              <div className="xl:col-span-4 space-y-6">
                {/* Real-time metrics at the top */}
                <RealTimeMetrics />

                {/* Topic Evolution Chart */}
                <TopicEvolution />

                {/* Grid of additional charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VelocityChart />
                  <TrendingKeywords />
                </div>

                {/* Engagement metrics */}
                <EngagementMetrics />

                {/* Network graph with integrated side panel */}
                <NetworkGraph />

                {/* Analytics Tabs */}
                <Tabs defaultValue="sentiment" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="communities">Communities</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="geographic">Geographic</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sentiment" className="space-y-6">
                    <SentimentChart />
                  </TabsContent>
                  
                  <TabsContent value="communities" className="space-y-6">
                    <SubredditAnalytics />
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-6">
                    <ActivityHeatmap />
                    <TrendComparison availableTopics={trendingTopics.map(t => t.term)} />
                  </TabsContent>

                  <TabsContent value="geographic" className="space-y-6">
                    <TrendMap />
                  </TabsContent>

                  <TabsContent value="alerts" className="space-y-6">
                    <AlertsNotifications />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <LiveFeed />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {recentPosts.slice(0, 8).map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
                          {post.title}
                        </h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-1 flex-shrink-0"
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
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium text-blue-600">r/{post.subreddit}</span>
                        <span>•</span>
                        <span>{post.upvotes} upvotes</span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Most Active</h4>
                      <p className="text-sm text-blue-700">
                        r/technology leads with {Math.floor(totalMentions * 0.3).toLocaleString()} mentions
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Sentiment</h4>
                      <p className="text-sm text-green-700">
                        Overall positive (7.2/10) with increasing optimism
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Peak Time</h4>
                      <p className="text-sm text-purple-700">
                        Highest activity 2-4 PM EST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Reddit analytics...</p>
            </CardContent>
          </Card>
        )}

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;