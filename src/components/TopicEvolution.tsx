import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Clock } from "lucide-react";

const TopicEvolution = () => {
  const evolutionData = [
    { time: '6h ago', ai: 2400, climate: 1800, crypto: 1200, gaming: 1600, politics: 2200 },
    { time: '5h ago', ai: 2800, climate: 1900, crypto: 1100, gaming: 1700, politics: 2100 },
    { time: '4h ago', ai: 3200, climate: 2100, crypto: 1300, gaming: 1800, politics: 1900 },
    { time: '3h ago', ai: 4100, climate: 2300, crypto: 1500, gaming: 1900, politics: 1800 },
    { time: '2h ago', ai: 4800, climate: 2200, crypto: 1800, gaming: 2100, politics: 1700 },
    { time: '1h ago', ai: 5200, climate: 2400, crypto: 2200, gaming: 2300, politics: 1600 },
    { time: 'Now', ai: 5800, climate: 2600, crypto: 2500, gaming: 2400, politics: 1500 },
  ];

  const topics = [
    { key: 'ai', name: 'AI', color: '#f97316' },
    { key: 'climate', name: 'Climate', color: '#10b981' },
    { key: 'crypto', name: 'Crypto', color: '#3b82f6' },
    { key: 'gaming', name: 'Gaming', color: '#8b5cf6' },
    { key: 'politics', name: 'Politics', color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Topic Evolution (Last 6 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {topics.map(topic => (
              <Line
                key={topic.key}
                type="monotone"
                dataKey={topic.key}
                stroke={topic.color}
                strokeWidth={3}
                dot={{ fill: topic.color, strokeWidth: 2, r: 4 }}
                name={topic.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopicEvolution;