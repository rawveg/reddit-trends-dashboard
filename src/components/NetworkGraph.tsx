import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Users } from "lucide-react";

interface NetworkGraphProps {
  onTopicClick?: (topic: string) => void;
}

const NetworkGraph = ({ onTopicClick }: NetworkGraphProps) => {
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

  const handleTopicClick = (topicName: string) => {
    if (onTopicClick) {
      onTopicClick(topicName);
    }
  };

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
        <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, index) => {
              const fromTopic = topics.find(t => t.name === conn.from);
              const toTopic = topics.find(t => t.name === conn.to);
              if (!fromTopic || !toTopic) return null;
              
              return (
                <line
                  key={index}
                  x1={`${fromTopic.x}%`}
                  y1={`${fromTopic.y}%`}
                  x2={`${toTopic.x}%`}
                  y2={`${toTopic.y}%`}
                  stroke="#d1d5db"
                  strokeWidth={Math.max(1, conn.strength / 20)}
                  opacity={0.6}
                />
              );
            })}
          </svg>
          
          {/* Topic nodes */}
          {topics.map((topic, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-all duration-200 group"
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
                className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-xl transition-shadow"
                style={{ backgroundColor: topic.color }}
              >
                {topic.name.slice(0, 2)}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Analyze {topic.name}
              </div>
            </div>
          ))}
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
      </CardContent>
    </Card>
  );
};

export default NetworkGraph;