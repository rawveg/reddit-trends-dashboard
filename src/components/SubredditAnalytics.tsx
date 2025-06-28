import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Users, MessageCircle, TrendingUp, Activity } from "lucide-react";

const SubredditAnalytics = () => {
  const subredditData = [
    { name: 'r/technology', posts: 3400, engagement: 85, growth: 12, subscribers: '2.1M' },
    { name: 'r/worldnews', posts: 2800, engagement: 78, growth: 8, subscribers: '1.8M' },
    { name: 'r/science', posts: 2200, engagement: 92, growth: 15, subscribers: '1.5M' },
    { name: 'r/gaming', posts: 1900, engagement: 88, growth: 22, subscribers: '1.2M' },
    { name: 'r/politics', posts: 1600, engagement: 65, growth: -5, subscribers: '900K' },
    { name: 'r/cryptocurrency', posts: 1400, engagement: 82, growth: 18, subscribers: '800K' },
  ];

  const engagementData = subredditData.map(sub => ({
    name: sub.name.replace('r/', ''),
    posts: sub.posts,
    engagement: sub.engagement,
    growth: sub.growth
  }));

  return (
    <div className="space-y-6">
      {/* Subreddit Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subredditData.map((subreddit, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-600">{subreddit.name}</h4>
                <Badge 
                  variant={subreddit.growth > 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {subreddit.growth > 0 ? '+' : ''}{subreddit.growth}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-orange-500" />
                  <span>{subreddit.posts} posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{subreddit.subscribers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>{subreddit.engagement}% eng.</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>{subreddit.growth > 0 ? 'Growing' : 'Declining'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts vs Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Posts vs Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="posts" name="Posts" />
                <YAxis dataKey="engagement" name="Engagement %" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">r/{data.name}</p>
                          <p>Posts: {data.posts}</p>
                          <p>Engagement: {data.engagement}%</p>
                          <p>Growth: {data.growth}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter dataKey="engagement" fill="#f97316" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Growth Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="growth" 
                  fill={(entry) => entry > 0 ? "#10b981" : "#ef4444"}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubredditAnalytics;