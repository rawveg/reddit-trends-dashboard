import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle, ExternalLink, Clock } from "lucide-react";

interface Discussion {
  title: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  url: string;
}

interface TopDiscussionsProps {
  topic: string;
}

const TopDiscussions = ({ topic }: TopDiscussionsProps) => {
  // Mock data - in real app this would come from Reddit API
  const discussions: Discussion[] = [
    {
      title: `The future of ${topic} in 2024: What experts are saying`,
      subreddit: "r/technology",
      upvotes: 2340,
      comments: 456,
      timeAgo: "3 hours ago",
      url: "#"
    },
    {
      title: `Breaking: Major breakthrough in ${topic} research`,
      subreddit: "r/science",
      upvotes: 1890,
      comments: 234,
      timeAgo: "5 hours ago",
      url: "#"
    },
    {
      title: `ELI5: How does ${topic} actually work?`,
      subreddit: "r/explainlikeimfive",
      upvotes: 1567,
      comments: 189,
      timeAgo: "8 hours ago",
      url: "#"
    },
    {
      title: `${topic} megathread - Discussion and updates`,
      subreddit: "r/worldnews",
      upvotes: 1234,
      comments: 567,
      timeAgo: "12 hours ago",
      url: "#"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          Top Discussions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {discussions.map((discussion, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
                {discussion.title}
              </h4>
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {discussion.subreddit}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {discussion.timeAgo}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                {discussion.upvotes.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {discussion.comments}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopDiscussions;