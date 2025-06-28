import { useState, useEffect } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import SearchBar from "@/components/SearchBar";
import TrendingTopics from "@/components/TrendingTopics";
import TrendChart from "@/components/TrendChart";
import SubredditFilter from "@/components/SubredditFilter";
import StatsCards from "@/components/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);

  // Mock data - in a real app, this would come from Reddit API
  const mockTrendingTopics = [
    {
      id: "1",
      title: "Breaking: Major tech announcement shakes the industry",
      subreddit: "technology",
      score: 15420,
      comments: 2341,
      trend: "up" as const,
      changePercent: 245,
    },
    {
      id: "2",
      title: "Scientists discover new species in deep ocean",
      subreddit: "science",
      score: 12890,
      comments: 1876,
      trend: "up" as const,
      changePercent: 156,
    },
    {
      id: "3",
      title: "Gaming community rallies around indie developer",
      subreddit: "gaming",
      score: 9876,
      comments: 1234,
      trend: "stable" as const,
      changePercent: 12,
    },
    {
      id: "4",
      title: "New movie trailer breaks viewing records",
      subreddit: "movies",
      score: 8765,
      comments: 987,
      trend: "up" as const,
      changePercent: 89,
    },
    {
      id: "5",
      title: "Cryptocurrency market sees unexpected surge",
      subreddit: "cryptocurrency",
      score: 7654,
      comments: 2109,
      trend: "down" as const,
      changePercent: -23,
    },
  ];

  const mockChartData = [
    { date: "2024-01-01", mentions: 1200, sentiment: 65 },
    { date: "2024-01-02", mentions: 1890, sentiment: 72 },
    { date: "2024-01-03", mentions: 2340, sentiment: 68 },
    { date: "2024-01-04", mentions: 3210, sentiment: 78 },
    { date: "2024-01-05", mentions: 2890, sentiment: 74 },
    { date: "2024-01-06", mentions: 4120, sentiment: 82 },
    { date: "2024-01-07", mentions: 3650, sentiment: 79 },
  ];

  const mockSubreddits = [
    { value: "technology", label: "technology", subscribers: 14200000 },
    { value: "science", label: "science", subscribers: 28900000 },
    { value: "gaming", label: "gaming", subscribers: 37800000 },
    { value: "movies", label: "movies", subscribers: 31200000 },
    { value: "cryptocurrency", label: "cryptocurrency", subscribers: 5600000 },
    { value: "worldnews", label: "worldnews", subscribers: 32100000 },
    { value: "politics", label: "politics", subscribers: 8900000 },
    { value: "funny", label: "funny", subscribers: 52300000 },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger an API call to search Reddit
    console.log("Searching for:", query);
  };

  const handleSubredditChange = (selected: string[]) => {
    setSelectedSubreddits(selected);
    // In a real app, this would filter the data
    console.log("Selected subreddits:", selected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reddit Trends</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover what's trending across Reddit communities
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <SubredditFilter
            subreddits={mockSubreddits}
            selectedSubreddits={selectedSubreddits}
            onSelectionChange={handleSubredditChange}
          />
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards
            totalMentions={45230}
            totalComments={12890}
            activeSubreddits={156}
            trendingScore={87}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending Topics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendingTopics topics={mockTrendingTopics} />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTrendingTopics.slice(0, 3).map((topic) => (
                      <div key={topic.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{topic.title}</p>
                          <p className="text-xs text-gray-500">r/{topic.subreddit} • 2 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TrendChart
              data={mockChartData}
              title={searchQuery ? `Trends for "${searchQuery}"` : "Overall Reddit Trends"}
            />
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Explore Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockSubreddits.map((subreddit) => (
                    <div key={subreddit.value} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium">r/{subreddit.label}</h3>
                      <p className="text-sm text-gray-500">
                        {subreddit.subscribers.toLocaleString()} subscribers
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;