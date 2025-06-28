import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Heart, Share, Eye, MessageSquare } from "lucide-react";

const EngagementMetrics = () => {
  const engagementData = [
    { time: '00:00', upvotes: 1200, comments: 340, shares: 89, views: 4500 },
    { time: '04:00', upvotes: 800, comments: 220, shares: 45, views: 3200 },
    { time: '08:00', upvotes: 2100, comments: 580, shares: 156, views: 7800 },
    { time: '12:00', upvotes: 3400, comments: 890, shares: 234, views: 12000 },
    { time: '16:00', upvotes: 2800, comments: 720, shares: 189, views: 9500 },
    { time: '20:00', upvotes: 3100, comments: 810, shares: 201, views: 10200 },
  ];

  const topPostsEngagement = [
    { title: 'AI Breakthrough', upvotes: 4500, comments: 890 },
    { title: 'Climate Update', upvotes: 3200, comments: 650 },
    { title: 'Tech News', upvotes: 2800, comments: 420 },
    { title: 'Gaming Release', upvotes: 2400, comments: 380 },
    { title: 'Science Discovery', upvotes: 2100, comments: 340 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Engagement Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="upvotes" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
              <Area type="monotone" dataKey="comments" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="shares" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Top Posts Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPostsEngagement} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="upvotes" fill="#f97316" />
              <Bar dataKey="comments" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementMetrics;