import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Network, Users, X, TrendingUp, Zap, Clock } from "lucide-react";
import { useState } from "react";

interface NetworkGraphProps {
  onTopicClick?: (topic: string) => void;
}

const NetworkGraph = ({ onTopicClick }: NetworkGraphProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const connections = [
    { from: 'AI', to: 'Technology', strength: 85, posts: 234 },
    { from: 'AI', to: 'Science', strength: 72, posts: 156 },
    { from: 'Climate', to: 'Science', strength: 68, posts: 189 },
    { from: 'Crypto', to: 'Technology', strength: 91, posts: 267 },
    { from: 'Gaming', to: 'Technology', strength: 76, posts: 198 },
    { from: 'Politics', to: 'WorldNews', strength: 89, posts: 345 },
  ];

  const topics = [
    { name: 'AI', x: 50, y: 20, size: 40, color: '#f97316' },
    { name: 'Technology', x: 80, y: 50, size: 35, color: '#3b82f6' },
    { name: 'Science', x: 20, y: 50, size: 30, color: '#10b981' },
    { name: 'Climate', x: 10, y: 80, size: 25, color: '#06b6d4' },
    { name: 'Crypto', x: 70, y: 80, size: 28, color: '#8b5cf6' },
    { name: 'Gaming', x: 90, y: 20, size: 22, color: '#f59e0b' },
    { name: 'Politics', x: 30, y: 10, size: 32, color: '#ef4444' },
    { name: 'WorldNews', x: 60, y: 90, size: 26, color: '#84cc16' },
  ];

  // Topic data for the side panel
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
      ],
      keyInsights: [
        "ChatGPT and LLMs driving 40% of discussions",
        "Ethical AI concerns up 120% this month",
        "Job displacement fears balanced by productivity gains"
      ],
      topSubreddits: ["r/MachineLearning", "r/artificial", "r/technology"],
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
      ],
      keyInsights: [
        "Apple and Google dominate consumer discussions",
        "Open source projects gaining significant traction",
        "Privacy concerns driving decentralization trends"
      ],
      topSubreddits: ["r/technology", "r/programming", "r/gadgets"],
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
      ],
      keyInsights: [
        "Renewable energy adoption accelerating globally",
        "Carbon capture technology gaining investor interest",
        "Youth climate activism driving policy discussions"
      ],
      topSubreddits: ["r/climate", "r/environment", "r/renewableenergy"],
      peakHours: "6-8 PM EST",
      averageEngagement: 67
    }
  };

  const handleTopicClick = (topicName: string) => {
    setSelectedTopic(topicName);
    if (onTopicClick) {
      onTopicClick(topicName);
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedTopic(null);
  };

  const getTopicData = (topic: string) => {
    return topicData[topic as keyof typeof topicData] || {
      fullName: topic,
      totalMentions: Math.floor(Math.random() * 10000) + 5000,
      growth: `+${Math.floor(Math.random() * 50) + 10}%`,
      sentiment: Math.floor(Math.random() * 40) + 50,
      description: `${topic} is an active topic with growing engagement across multiple communities.`,
      connections: [
        { topic: "Related Topic 1", strength: 75, posts: 150, sentiment: 70, description: "Strong thematic connection" },
      ],
      keyInsights: [
        `${topic} discussions are trending upward`,
        "Community engagement is above average"
      ],
      topSubreddits: ["r/general", "r/discussion"],
      peakHours: "2-4 PM EST",
      averageEngagement: 70
    };
  };

  const data = selectedTopic ? getTopicData(selectedTopic) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-500" />
          Topic Network & Relationships
        </CardTitle>
        <p className="text-sm text-gray-600">Click on any topic node to view detailed analysis and connections</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {/* Main Network Graph */}
          <div className={`${selectedTopic ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
            <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full">
                {connections.map((conn, index) => {
                  const fromTopic = topics.find(t => t.name === conn.from);
                  const toTopic = topics.find(t => t.name === conn.to);
                  if (!fromTopic || !toTopic) return null;
                  
                  // Highlight connections for selected topic
                  const isHighlighted = selectedTopic && (conn.from === selectedTopic || conn.to === selectedTopic);
                  
                  return (
                    <line
                      key={index}
                      x1={`${fromTopic.x}%`}
                      y1={`${fromTopic.y}%`}
                      x2={`${toTopic.x}%`}
                      y2={`${toTopic.y}%`}
                      stroke={isHighlighted ? "#f97316" : "#d1d5db"}
                      strokeWidth={isHighlighted ? Math.max(2, conn.strength / 15) : Math.max(1, conn.strength / 20)}
                      opacity={isHighlighted ? 0.8 : 0.6}
                    />
                  );
                })}
              </svg>
              
              {/* Topic nodes */}
              {topics.map((topic, index) => {
                const isSelected = selectedTopic === topic.name;
                const isConnected = selectedTopic && connections.some(conn => 
                  (conn.from === selectedTopic && conn.to === topic.name) ||
                  (conn.to === selectedTopic && conn.from === topic.name)
                );
                
                return (
                  <div
                    key={index}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
                      isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                    } ${selectedTopic && !isSelected && !isConnected ? 'opacity-40' : ''}`}
                    style={{ 
                      left: `${topic.x}%`, 
                      top: `${topic.y}%`,
                      width: `${topic.size}px`,
                      height: `${topic.size}px`
                    }}
                    onClick={() => handleTopicClick(topic.name)}
                    title={`Click to analyze ${topic.name} connections`}
                  >
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-shadow ${
                        isSelected ? 'shadow-2xl ring-4 ring-orange-300' : 'group-hover:shadow-xl'
                      }`}
                      style={{ backgroundColor: topic.color }}
                    >
                      {topic.name.slice(0, 2)}
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Analyze {topic.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-sm">Strongest Connections</h4>
              <div className="grid grid-cols-2 gap-2">
                {connections.slice(0, 4).map((conn, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span>{conn.from} ↔ {conn.to}</span>
                    <Badge variant="outline" className="text-xs">
                      {conn.posts} posts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          {selectedTopic && data && (
            <div className="w-1/3 border-l pl-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-purple-600">{data.fullName}</h3>
                  <Button variant="ghost" size="sm" onClick={handleCloseSidePanel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{data.totalMentions.toLocaleString()}</div>
                    <div className="text-xs text-blue-800">Mentions</div>
                    <Badge variant="default" className="text-xs mt-1">{data.growth}</Badge>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{data.sentiment}%</div>
                    <div className="text-xs text-green-800">Sentiment</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-700">{data.description}</p>
                </div>

                {/* Connections */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <Network className="w-3 h-3" />
                    Connections
                  </h4>
                  <div className="space-y-2">
                    {data.connections.map((connection, index) => (
                      <div key={index} className="p-2 border rounded bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs">{connection.topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {connection.strength}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{connection.description}</p>
                        <Progress value={connection.strength} className="h-1 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Key Insights
                  </h4>
                  <div className="space-y-1">
                    {data.keyInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-1 text-xs">
                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-700">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communities */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
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

                {/* Activity Pattern */}
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded">
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Activity Pattern
                  </h4>
                  <div className="text-xs text-gray-700">
                    <p>Peak: {data.peakHours}</p>
                    <p>Engagement: {data.averageEngagement}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkGraph;