import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Search, TrendingUp, MessageCircle, Users, Calendar, AlertTriangle } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useRedditData } from "@/hooks/useRedditData";
import DataSourceIndicator from "@/components/DataSourceIndicator";
import ApiSetupGuide from "@/components/ApiSetupGuide";
import TrendingTopicCard from "@/components/TrendingTopicCard";
import SearchFilters from "@/components/SearchFilters";
import TopDiscussions from "@/components/TopDiscussions";
import TrendComparison from "@/components/TrendComparison";
import SentimentAnalysis from "@/components/SentimentAnalysis";
import TrendingHashtags from "@/components/TrendingHashtags";
import LiveFeed from "@/components/LiveFeed";
import TrendMap from "@/components/TrendMap";
import AlertsNotifications from "@/components/AlertsNotifications";
import SearchResults from "@/components/SearchResults";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    trendingTopics, 
    recentPosts, 
    subredditData, 
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

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      try {
        const results = await searchReddit(searchTerm);
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
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Generate chart data from actual trending topics
  const weeklyData = trendingTopics.length > 0 ? [
    { day: "Mon", mentions: Math.floor(selectedTopic.mentions * 0.7) },
    { day: "Tue", mentions: Math.floor(selectedTopic.mentions * 0.8) },
    { day: "Wed", mentions: Math.floor(selectedTopic.mentions * 0.9) },
    { day: "Thu", mentions: Math.floor(selectedTopic.mentions * 0.85) },
    { day: "Fri", mentions: Math.floor(selectedTopic.mentions * 1.1) },
    { day: "Sat", mentions: Math.floor(selectedTopic.mentions * 0.95) },
    { day: "Sun", mentions: selectedTopic.mentions },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <MessageCircle className="text-orange-500" />
            Reddit Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time Reddit trend analysis using live data from Reddit's public API. 
            Discover what's trending across communities right now.
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

        {/* Show explanation when no data */}
        {trendingTopics.length === 0 && !loading && (
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
                onClick={handleSearch} 
                className="bg-orange-500 hover:bg-orange-600 px-6"
                disabled={loading || !searchTerm.trim()}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {isSearching && (
          <SearchResults 
            query={searchTerm}
            results={searchResults}
            onClearSearch={handleClearSearch}
          />
        )}

        {/* Main Content - Only show when not searching and have data */}
        {!isSearching && trendingTopics.length > 0 && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Trending Now
                    </CardTitle>
                    <CardDescription>
                      Live trending topics from Reddit
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.slice(0, 5).map((topic, index) => (
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

                <SearchFilters onFiltersChange={handleFiltersChange} />
                <TrendingHashtags />
              </div>

              {/* Main Content Area */}
              <div className="xl:col-span-3 space-y-6">
                {/* Weekly Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-500" />
                      {selectedTopic.term} - Trend Analysis
                    </CardTitle>
                    <CardDescription>
                      Estimated weekly pattern based on current mentions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="mentions"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Tabs for different views */}
                <Tabs defaultValue="discussions" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="subreddits">Subreddits</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                    <TabsTrigger value="geographic">Geographic</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="discussions">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-orange-500" />
                          Recent Posts about {selectedTopic.term}
                        </CardTitle>
                        <CardDescription>
                          Live posts from Reddit mentioning this topic
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedTopic.posts?.slice(0, 5).map((post, index) => (
                          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <h4 className="font-medium text-sm leading-tight mb-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span>r/{post.subreddit}</span>
                              <span>•</span>
                              <span>{post.upvotes} upvotes</span>
                              <span>•</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-8 text-gray-500">
                            <p>No posts available for this topic</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="subreddits">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-500" />
                          Top Subreddits
                        </CardTitle>
                        <CardDescription>
                          Communities discussing {selectedTopic.term}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedTopic.subreddits.map((subreddit, index) => (
                            <div key={subreddit} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="font-medium">{subreddit}</span>
                              <span className="text-sm text-gray-600">Active</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sentiment">
                    <SentimentAnalysis topic={selectedTopic.term} />
                  </TabsContent>

                  <TabsContent value="compare">
                    <TrendComparison availableTopics={trendingTopics.map(t => t.term)} />
                  </TabsContent>

                  <TabsContent value="geographic">
                    <TrendMap />
                  </TabsContent>

                  <TabsContent value="alerts">
                    <AlertsNotifications />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reddit Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {recentPosts.slice(0, 10).map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-sm leading-tight mb-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>r/{post.subreddit}</span>
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
                  <CardTitle>Analytics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {trendingTopics.reduce((sum, topic) => sum + topic.mentions, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Mentions</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {trendingTopics.length}
                      </div>
                      <div className="text-sm text-gray-600">Trending Topics</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {recentPosts.length}
                      </div>
                      <div className="text-sm text-gray-600">Recent Posts</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        Live
                      </div>
                      <div className="text-sm text-gray-600">Data Source</div>
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
              <p className="text-gray-600">Fetching live Reddit data...</p>
            </CardContent>
          </Card>
        )}

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;