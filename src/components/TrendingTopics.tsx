import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageCircle, ArrowUp } from "lucide-react";

interface TrendingTopic {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  comments: number;
  trend: "up" | "down" | "stable";
  changePercent: number;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics = ({ topics }: TrendingTopicsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending on Reddit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-2">{topic.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      r/{topic.subreddit}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ArrowUp className="h-3 w-3" />
                      {topic.score.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MessageCircle className="h-3 w-3" />
                      {topic.comments.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(topic.trend)}
                <span className={`text-xs font-medium ${getTrendColor(topic.trend)}`}>
                  {topic.changePercent > 0 ? "+" : ""}{topic.changePercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;