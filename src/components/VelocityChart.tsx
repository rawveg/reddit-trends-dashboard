import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts";
import { Zap, TrendingUp } from "lucide-react";

const VelocityChart = () => {
  const velocityData = [
    { time: '1h ago', velocity: 45, momentum: 120, posts: 23 },
    { time: '45m ago', velocity: 67, momentum: 180, posts: 34 },
    { time: '30m ago', velocity: 89, momentum: 240, posts: 45 },
    { time: '15m ago', velocity: 123, momentum: 320, posts: 67 },
    { time: 'Now', velocity: 156, momentum: 420, posts: 89 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Topic Velocity & Momentum
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={velocityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="posts" fill="#e5e7eb" name="Posts" />
            <Line yAxisId="right" type="monotone" dataKey="velocity" stroke="#f59e0b" strokeWidth={3} name="Velocity" />
            <Line yAxisId="right" type="monotone" dataKey="momentum" stroke="#ef4444" strokeWidth={3} name="Momentum" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VelocityChart;