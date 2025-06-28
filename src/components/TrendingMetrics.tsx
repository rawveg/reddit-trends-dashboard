import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MessageCircle, Users, Clock, Zap } from "lucide-react";

interface TrendingMetricsProps {
  totalMentions: number;
  totalPosts: number;
  activeSubreddits: number;
  avgSentiment: number;
  topGrowthRate: string;
  peakHour: string;
}

const TrendingMetrics = ({ 
  totalMentions, 
  totalPosts, 
  activeSubreddits, 
  avgSentiment, 
  topGrowthRate,
  peakHour 
}: TrendingMetricsProps) => {
  const metrics = [
    {
      title: "Total Mentions",
      value: totalMentions.toLocaleString(),
      icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
      change: "+12%",
      positive: true
    },
    {
      title: "Active Posts",
      value: totalPosts.toLocaleString(),
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      change: "+8%",
      positive: true
    },
    {
      title: "Communities",
      value: activeSubreddits.toString(),
      icon: <Users className="w-6 h-6 text-green-500" />,
      change: "+5%",
      positive: true
    },
    {
      title: "Avg Sentiment",
      value: avgSentiment.toFixed(1),
      icon: avgSentiment > 6 ? <TrendingUp className="w-6 h-6 text-green-500" /> : <TrendingDown className="w-6 h-6 text-red-500" />,
      change: avgSentiment > 6 ? "+0.3" : "-0.2",
      positive: avgSentiment > 6
    },
    {
      title: "Top Growth",
      value: topGrowthRate,
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      change: "vs yesterday",
      positive: true
    },
    {
      title: "Peak Activity",
      value: peakHour,
      icon: <Clock className="w-6 h-6 text-indigo-500" />,
      change: "EST",
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <Badge 
                variant={metric.positive ? "default" : "destructive"} 
                className="text-xs"
              >
                {metric.change}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">
              {metric.title}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrendingMetrics;