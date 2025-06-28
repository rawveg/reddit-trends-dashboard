import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Search, TrendingUp, MessageCircle, Users, Calendar, Globe, Hash, Radio, Bell } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
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

// Mock data for trending topics
const trendingTopics = [
  { term: "artificial intelligence", mentions: 15420, growth: "+45%", subreddits: ["r/MachineLearning", "r/technology", "r/singularity"] },
  { term: "climate change", mentions: 12890, growth: "+23%", subreddits: ["r/environment", "r/science", "r/worldnews"] },
  { term: "cryptocurrency", mentions: 11250, growth: "-12%", subreddits: ["r/CryptoCurrency", "r/Bitcoin", "r/ethereum"] },
  { term: "space exploration", mentions: 9870, growth: "+67%", subreddits: ["r/space", "r/SpaceX", "r/nasa"] },
  { term: "gaming", mentions: 8940, growth: "+18%", subreddits: ["r/gaming", "r/pcmasterrace", "r/nintendo"] },
  { term: "electric vehicles", mentions: 7650, growth: "+34%", subreddits: ["r/electricvehicles", "r/teslamotors", "r/cars"] },
  { term: "mental health", mentions: 6890, growth: "+28%", subreddits: ["r/mentalhealth", "r/depression", "r/anxiety"] },
];

// Mock data for charts
const weeklyData = [
  { day: "Mon", mentions: 2400 },
  { day: "Tue", mentions: 1398 },
  { day: "Wed", mentions: 9800 },
  { day: "Thu", mentions: 3908 },
  { day: "Fri", mentions: 4800 },
  { day: "Sat", mentions: 3800 },
  { day: "Sun", mentions: 4300 },
];

const subredditData = [
  { name: "r/technology", mentions: 3400 },
  { name: "r/worldnews", mentions: 2800 },
  { name: "r/science", mentions: 2200 },
  { name: "r/gaming", mentions: 1900 },
  { name: "r/politics", mentions: 1600 },
];

// Mock search data
const mockSearchData = {
  "ai": [
    { type: "topic" as const, title: "artificial intelligence", mentions: 15420, growth: "+45%", description: "Discussions about AI technology, machine learning, and automation" },
    { type: "topic" as const, title: "machine learning", mentions: 8930, growth: "+67%", description: "Technical discussions about ML algorithms and applications" },
    { type: "subreddit" as const, title: "r/MachineLearning", mentions: 2340, description: "Community for machine learning researchers and practitioners" },
    { type: "subreddit" as const, title: "r/artificial", mentions: 1890, description: "General AI discussion and news" },
    { type: "post" as const, title: "New AI breakthrough achieves human-level performance", subreddit: "r/technology", upvotes: 2340, comments: 456, timeAgo: "3 hours ago" },
    { type: "post" as const, title: "How AI is changing the job market", subreddit: "r/futurology", upvotes: 1890, comments: 234, timeAgo: "5 hours ago" },
  ],
  "climate": [
    { type: "topic" as const, title: "climate change", mentions: 12890, growth: "+23%", description: "Environmental discussions and climate science" },
    { type: "topic" as const, title: "global warming", mentions: 7650, growth: "+18%", description: "Temperature rise and environmental impact discussions" },
    { type: "subreddit" as const, title: "r/environment", mentions: 3400, description: "Environmental news and discussion" },
    { type: "subreddit" as const, title: "r/climatechange", mentions: 2100, description: "Climate science and policy discussions" },
    { type: "post" as const, title: "Climate summit reaches historic agreement", subreddit: "r/worldnews", upvotes: 3450, comments: 567, timeAgo: "2 hours ago" },
    { type: "post" as const, title: "New study shows accelerating ice melt", subreddit: "r/science", upvotes: 2890, comments: 345, timeAgo: "4 hours ago" },
  ],
  "crypto": [
    { type: "topic" as const, title: "cryptocurrency", mentions: 11250, growth: "-12%", description: "Digital currency discussions and market analysis" },
    { type: "topic" as const, title: "bitcoin", mentions: 8940, growth: "-8%", description: "Bitcoin price, technology, and adoption discussions" },
    { type: "subreddit" as const, title: "r/CryptoCurrency", mentions: 4200, description: "General cryptocurrency discussion and news" },
    { type: "subreddit" as const, title: "r/Bitcoin", mentions: 3100, description: "Bitcoin-focused community" },
    { type: "post" as const, title: "Bitcoin reaches new monthly high", subreddit: "r/CryptoCurrency", upvotes: 1890, comments: 234, timeAgo: "1 hour ago" },
    { type: "post" as const, title: "Ethereum 2.0 update progress", subreddit: "r/ethereum", upvotes: 1567, comments: 189, timeAgo: "6 hours ago" },
  ]
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(trendingTopics[0]);
  const [filters, setFilters] = useState({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const query = searchTerm.toLowerCase();
        let results: any[] = [];
        
        // Search through mock data
        Object.entries(mockSearchData).forEach(([key, data]) => {
          if (query.includes(key) || key.includes(query)) {
            results = [...results, ...data];
          }
        });
        
        // Also search through trending topics
        trendingTopics.forEach(topic => {
          if (topic.term.toLowerCase().includes(query) || query.includes(topic.term.toLowerCase())) {
            results.push({
              type: "topic",
              title: topic.term,
              mentions: topic.mentions,
              growth: topic.growth,
              description: `Trending topic with ${topic.mentions.toLocaleString()} mentions`
            });
          }
        });
        
        // Remove duplicates
        const uniqueResults = results.filter((result, index, self) => 
          index === self.findIndex(r => r.title === result.title && r.type === result.type)
        );
        
        setSearchResults(uniqueResults);
      }, 500);
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
            Discover what's trending across Reddit communities in real-time. 
            Track discussions, analyze sentiment, and explore emerging topics.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search for topics, keywords, or subreddits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 text-lg"
              />
              <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600 px-6">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {isSearching && searchResults.length >= 0 && (
          <SearchResults 
            query={searchTerm}
            results={searchResults}
            onClearSearch={handleClearSearch}
          />
        )}

        {/* Main Content - Only show when not searching */}
        {!isSearching && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Sidebar - Trending Topics and Filters */}
              <div className="xl:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Trending Now
                    </CardTitle>
                    <CardDescription>
                      Most discussed topics in the last 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {trendingTopics.slice(0, 5).map((topic, index) => (
                      <TrendingTopicCard
                        key={topic.term}
                        topic={topic}
                        index={index}
                        isSelected={selectedTopic.term === topic.term}
                        onClick={() => setSelectedTopic(topic)}
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
                      {selectedTopic.term} - Weekly Trend
                    </CardTitle>
                    <CardDescription>
                      Mentions over the past week
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
                <Tabs defaultValue="subreddits" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="subreddits">Subreddits</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                    <TabsTrigger value="geographic">Geographic</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subreddits">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-500" />
                          Top Subreddits
                        </CardTitle>
                        <CardDescription>
                          Communities driving the conversation about {selectedTopic.term}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={subredditData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="mentions" fill="#f97316" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="discussions">
                    <TopDiscussions topic={selectedTopic.term} />
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

            {/* Bottom Section - Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveFeed />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {trendingTopics.reduce((sum, topic) => sum + topic.mentions, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Mentions Today</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {trendingTopics.length}
                      </div>
                      <div className="text-sm text-gray-600">Trending Topics</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {trendingTopics.filter(t => t.growth.startsWith("+")).length}
                      </div>
                      <div className="text-sm text-gray-600">Growing Topics</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600">Live Monitoring</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;