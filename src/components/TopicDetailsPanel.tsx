import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, TrendingUp, Users, MessageCircle, ArrowUp, Network, Zap, Clock } from "lucide-react";

interface Connection {
  topic: string;
  strength: number;
  posts: number;
  sentiment: number;
  description: string;
}

interface TopicDetailsPanelProps {
  topic: string;
  onClose: () => void;
}

const TopicDetailsPanel = ({ topic, onClose }: TopicDetailsPanelProps) => {
  // Mock data - in a real app this would come from your data analysis
  const topicData = {
    AI: {
      fullName: "Artificial Intelligence",
      totalMentions: 15420,
      growth: "+67%",
      sentiment: 78,
      description: "AI discussions are dominated by breakthrough announcements, ethical concerns, and practical applications across industries.",
      connections: [
        { topic: "Technology", strength: 85, posts: 234, sentiment: 82, description: "Strong overlap in tech innovation discussions" },
        { topic: "Science", strength: 72, posts: 156, sentiment: 85, description: "Research breakthroughs and academic papers" },
        { topic: "Ethics", strength: 68, posts: 89, sentiment: 65, description: "Concerns about AI safety and regulation" },
        { topic: "Business", strength: 61, posts: 123, sentiment: 75, description: "Commercial applications and market impact" }
      ],
      keyInsights: [
        "ChatGPT and LLMs driving 40% of discussions",
        "Ethical AI concerns up 120% this month",
        "Job displacement fears balanced by productivity gains",
        "Regulatory discussions intensifying globally"
      ],
      topSubreddits: ["r/MachineLearning", "r/artificial", "r/technology", "r/singularity"],
      peakHours: "2-4 PM EST",
      averageEngagement: 89
    },
    Technology: {
      fullName: "Technology",
      totalMentions: 12890,
      growth: "+34%",
      sentiment: 72,
      description: "Technology discussions span from consumer electronics to enterprise solutions, with strong focus on innovation and disruption.",
      connections: [
        { topic: "AI", strength: 85, posts: 234, sentiment: 82, description: "AI integration across tech products" },
        { topic: "Gaming", strength: 76, posts: 198, sentiment: 88, description: "Gaming hardware and software innovations" },
        { topic: "Crypto", strength: 71, posts: 167, sentiment: 65, description: "Blockchain technology applications" },
        { topic: "Climate", strength: 58, posts: 134, sentiment: 70, description: "Green tech and sustainability solutions" }
      ],
      keyInsights: [
        "Apple and Google dominate consumer discussions",
        "Open source projects gaining significant traction",
        "Privacy concerns driving decentralization trends",
        "5G and edge computing emerging as key themes"
      ],
      topSubreddits: ["r/technology", "r/programming", "r/gadgets", "r/apple"],
      peakHours: "12-2 PM EST",
      averageEngagement: 76
    },
    Climate: {
      fullName: "Climate Change",
      totalMentions: 8650,
      growth: "+23%",
      sentiment: 58,
      description: "Climate discussions focus on environmental impact, policy changes, and technological solutions to address global warming.",
      connections: [
        { topic: "Science", strength: 68, posts: 189, sentiment: 72, description: "Scientific research and climate data" },
        { topic: "Politics", strength: 64, posts: 145, sentiment: 45, description: "Policy debates and political action" },
        { topic: "Technology", strength: 58, posts: 134, sentiment: 70, description: "Clean energy and green tech solutions" },
        { topic: "Economics", strength: 52, posts: 98, sentiment: 55, description: "Economic impact and carbon markets" }
      ],
      keyInsights: [
        "Renewable energy adoption accelerating globally",
        "Carbon capture technology gaining investor interest",
        "Youth climate activism driving policy discussions",
        "Corporate ESG commitments under scrutiny"
      ],
      topSubreddits: ["r/climate", "r/environment", "r/renewableenergy", "r/climatechange"],
      peakHours: "6-8 PM EST",
      averageEngagement: 67
    }
  };

  const data = topicData[topic as keyof typeof topicData] || {
    fullName: topic,
    totalMentions: Math.floor(Math.random() * 10000) + 5000,
    growth: `+${Math.floor(Math.random() * 50) + 10}%`,
    sentiment: Math.floor(Math.random() * 40) + 50,
    description: `${topic} is an active topic with growing engagement across multiple communities.`,
    connections: [
      { topic: "Related Topic 1", strength: 75, posts: 150, sentiment: 70, description: "Strong thematic connection" },
      { topic: "Related Topic 2", strength: 65, posts: 120, sentiment: 65, description: "Moderate overlap in discussions" }
    ],
    keyInsights: [
      `${topic} discussions are trending upward`,
      "Community engagement is above average",
      "Cross-platform mentions increasing"
    ],
    topSubreddits: ["r/general", "r/discussion"],
    peakHours: "2-4 PM EST",
    averageEngagement: 70
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-500" />
            {data.fullName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Overview Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{data.totalMentions.toLocaleString()}</div>
            <div className="text-sm text-blue-800">Total Mentions</div>
            <Badge variant="default" className="text-xs mt-1">{data.growth}</Badge>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.sentiment}%</div>
            <div className="text-sm text-green-800">Positive Sentiment</div>
            <div className="w-full bg-green-200 rounded-full h-1 mt-1">
              <div className="bg-green-500 h-1 rounded-full" style={{ width: `${data.sentiment}%` }}></div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Overview</h4>
          <p className="text-sm text-gray-700">{data.description}</p>
        </div>

        {/* Network Connections */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Network className="w-4 h-4" />
            Connected Topics
          </h4>
          <div className="space-y-3">
            {data.connections.map((connection, index) => (
              <div key={index} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{connection.topic}</h5>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {connection.strength}% strength
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {connection.posts} posts
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-2">{connection.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>Connection Strength</span>
                  <span>{connection.strength}%</span>
                </div>
                <Progress value={connection.strength} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Key Insights
          </h4>
          <div className="space-y-2">
            {data.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community Activity */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Top Communities
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.topSubreddits.map((subreddit, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {subreddit}
              </Badge>
            ))}
          </div>
        </div>

        {/* Activity Patterns */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Activity Patterns
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-purple-50 rounded">
              <div className="font-medium text-purple-800">Peak Hours</div>
              <div className="text-purple-700">{data.peakHours}</div>
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <div className="font-medium text-orange-800">Avg Engagement</div>
              <div className="text-orange-700">{data.averageEngagement}%</div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trend Analysis
          </h4>
          <p className="text-sm text-gray-700">
            {topic} shows {data.growth.startsWith('+') ? 'strong positive' : 'declining'} momentum with 
            {data.sentiment > 70 ? ' highly positive' : data.sentiment > 50 ? ' moderately positive' : ' mixed'} community sentiment. 
            The topic demonstrates significant cross-community engagement with {data.connections.length} major topic intersections.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicDetailsPanel;