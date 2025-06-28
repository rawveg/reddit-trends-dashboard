import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, ArrowUp, MessageCircle, ExternalLink, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface LivePost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  timeAgo: string;
  isNew: boolean;
}

const LiveFeed = () => {
  const [posts, setPosts] = useState<LivePost[]>([
    {
      id: "1",
      title: "Breaking: New AI model achieves human-level performance",
      subreddit: "r/MachineLearning",
      author: "u/researcher123",
      upvotes: 234,
      comments: 45,
      timeAgo: "2 min ago",
      isNew: true
    },
    {
      id: "2",
      title: "Climate summit reaches historic agreement",
      subreddit: "r/worldnews",
      author: "u/newsreporter",
      upvotes: 1890,
      comments: 234,
      timeAgo: "5 min ago",
      isNew: false
    },
    {
      id: "3",
      title: "SpaceX successfully launches new satellite constellation",
      subreddit: "r/SpaceX",
      author: "u/spacefan",
      upvotes: 567,
      comments: 89,
      timeAgo: "8 min ago",
      isNew: false
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new posts
      const newPost: LivePost = {
        id: Date.now().toString(),
        title: "New trending discussion about emerging technology",
        subreddit: "r/technology",
        author: "u/techuser" + Math.floor(Math.random() * 1000),
        upvotes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        timeAgo: "just now",
        isNew: true
      };

      setPosts(prev => [newPost, ...prev.slice(0, 9)]);

      // Remove "new" status after 3 seconds
      setTimeout(() => {
        setPosts(prev => prev.map(post => 
          post.id === newPost.id ? { ...post, isNew: false } : post
        ));
      }, 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className={`w-5 h-5 ${isLive ? 'text-red-500' : 'text-gray-400'}`} />
            Live Feed
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-500 font-medium">LIVE</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? "Pause" : "Resume"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`p-3 border rounded-lg transition-all duration-300 ${
              post.isNew 
                ? "bg-orange-50 border-orange-200 shadow-sm" 
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
                {post.title}
              </h4>
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {post.subreddit}
              </Badge>
              <span className="text-xs text-gray-500">{post.author}</span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {post.timeAgo}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                {post.upvotes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LiveFeed;