import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, X, BarChart3 } from "lucide-react";
import { useState } from "react";

interface TrendComparisonProps {
  availableTopics: string[];
}

const TrendComparison = ({ availableTopics }: TrendComparisonProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["artificial intelligence"]);
  
  // Mock comparison data
  const comparisonData = [
    { day: "Mon", "artificial intelligence": 2400, "climate change": 1800, "cryptocurrency": 1200 },
    { day: "Tue", "artificial intelligence": 1398, "climate change": 2200, "cryptocurrency": 1600 },
    { day: "Wed", "artificial intelligence": 9800, "climate change": 2800, "cryptocurrency": 2100 },
    { day: "Thu", "artificial intelligence": 3908, "climate change": 1900, "cryptocurrency": 1800 },
    { day: "Fri", "artificial intelligence": 4800, "climate change": 2400, "cryptocurrency": 2200 },
    { day: "Sat", "artificial intelligence": 3800, "climate change": 2100, "cryptocurrency": 1900 },
    { day: "Sun", "artificial intelligence": 4300, "climate change": 2300, "cryptocurrency": 2000 },
  ];

  const colors = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic) && selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const removeTopic = (topic: string) => {
    if (selectedTopics.length > 1) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Compare Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {selectedTopics.map((topic, index) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              <div 
                className="w-2 h-2 rounded-full mr-1" 
                style={{ backgroundColor: colors[index] }}
              />
              {topic}
              {selectedTopics.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => removeTopic(topic)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </Badge>
          ))}
          
          {selectedTopics.length < 5 && (
            <div className="relative">
              <select
                className="text-xs border rounded px-2 py-1 bg-white"
                onChange={(e) => {
                  if (e.target.value) {
                    addTopic(e.target.value);
                    e.target.value = "";
                  }
                }}
                value=""
              >
                <option value="">+ Add topic</option>
                {availableTopics
                  .filter(topic => !selectedTopics.includes(topic))
                  .map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            {selectedTopics.map((topic, index) => (
              <Line
                key={topic}
                type="monotone"
                dataKey={topic}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ fill: colors[index] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendComparison;