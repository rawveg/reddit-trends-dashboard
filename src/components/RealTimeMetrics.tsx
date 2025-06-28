import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Zap, Users, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const RealTimeMetrics = () => {
  const [liveData, setLiveData] = useState([
    { time: '5m ago', posts: 45, comments: 123, upvotes: 567 },
    { time: '4m ago', posts: 52, comments: 134, upvotes: 623 },
    { time: '3m ago', posts: 48, comments: 145, upvotes: 689 },
    { time: '2m ago', posts: 61, comments: 156, upvotes: 734 },
    { time: '1m ago', posts: 58, comments: 167, upvotes: 789 },
    { time: 'Now', posts: 67, comments: 178, upvotes: 845 },
  ]);

  const [currentMetrics, setCurrentMetrics] = useState({
    postsPerMinute: 67,
    commentsPerMinute: 178,
    upvotesPerMinute: 845,
    activeUsers: 12450
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const newDataPoint = {
        time: 'Now',
        posts: Math.floor(Math.random() * 30) + 50,
        comments: Math.floor(Math.random() * 50) + 150,
        upvotes: Math.floor(Math.random() * 200) + 700
      };

      setLiveData(prev => [...prev.slice(1), newDataPoint]);
      setCurrentMetrics({
        postsPerMinute: newDataPoint.posts,
        commentsPerMinute: newDataPoint.comments,
        upvotesPerMinute: newDataPoint.upvotes,
        activeUsers: Math.floor(Math.random() * 2000) + 11000
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Live Activity Stream
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={liveData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Area type="monotone" dataKey="posts" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
              <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Real-Time Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium">Posts/min</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {currentMetrics.postsPerMinute}
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">Comments/min</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {currentMetrics.commentsPerMinute}
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium">Upvotes/min</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {currentMetrics.upvotesPerMinute}
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {currentMetrics.activeUsers.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMetrics;