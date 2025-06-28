import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Search, TrendingUp, MessageCircle, Users, Calendar } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

// Mock data for trending topics
const trendingTopics = [
  { term: "artificial intelligence", mentions: 15420, growth: "+45%", subreddits: ["r/MachineLearning", "r/technology", "r/singularity"] },
  { term: "climate change", mentions: 12890, growth: "+23%", subreddits: ["r/environment", "r/science", "r/worldnews"] },
  { term: "cryptocurrency", mentions: 11250, growth: "-12%", subreddits: ["r/CryptoCurrency", "r/Bitcoin", "r/ethereum"] },
  { term: "space exploration", mentions: 9870, growth: "+67%", subreddits: ["r/space", "r/SpaceX", "r/nasa"] },
  { term: "gaming", mentions: 8940, growth: "+18%", subreddits: ["r/gaming", "r/pcmasterrace", "r/nintendo"] },
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

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(trendingTopics[0]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // In a real app, this would fetch data from Reddit API
      console.log("Searching for:", searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <MessageCircle className="text-orange-500" />
            Reddit Trends
          </h1>
          <p className="text-xl text-gray-600">
            Discover what's trending across Reddit communities
          </p>
        </div>

        {/* Search Bar */}
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search for topics, keywords, or subreddits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending Topics */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Trending Now
              </CardTitle>
              <CardDescription>
                Most discussed topics in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.term}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTopic.term === topic.term
                      ? "bg-orange-50 border-orange-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">#{index + 1}</span>
                    <Badge
                      variant={topic.growth.startsWith("+") ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {topic.growth}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{topic.term}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {topic.mentions.toLocaleString()} mentions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {topic.subreddits.slice(0, 2).map((sub) => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                    {topic.subreddits.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{topic.subreddits.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
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
                      strokeWidth={2}
                      dot={{ fill: "#f97316" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Tabs defaultValue="subreddits" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subreddits">Top Subreddits</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subreddits">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Top Subreddits
                    </CardTitle>
                    <CardDescription>
                      Communities driving the conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={subredditData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="mentions" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>
                      Analysis of {selectedTopic.term} discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedTopic.mentions.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Mentions</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedTopic.subreddits.length}
                        </div>
                        <div className="text-sm text-gray-600">Active Subreddits</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedTopic.growth}
                        </div>
                        <div className="text-sm text-gray-600">24h Growth</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Popular Discussions:</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            "The future of {selectedTopic.term} in 2024"
                          </p>
                          <p className="text-xs text-gray-600">
                            r/technology • 2.3k upvotes • 456 comments
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">
                            "Breaking: Major developments in {selectedTopic.term}"
                          </p>
                          <p className="text-xs text-gray-600">
                            r/worldnews • 1.8k upvotes • 234 comments
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;