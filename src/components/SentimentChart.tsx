import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { Smile, Meh, Frown, TrendingUp } from "lucide-react";

const SentimentChart = () => {
  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Negative', value: 10, color: '#ef4444' }
  ];

  const hourlysentiment = [
    { hour: '00:00', positive: 45, neutral: 35, negative: 20 },
    { hour: '04:00', positive: 52, neutral: 30, negative: 18 },
    { hour: '08:00', positive: 68, neutral: 22, negative: 10 },
    { hour: '12:00', positive: 72, neutral: 20, negative: 8 },
    { hour: '16:00', positive: 65, neutral: 25, negative: 10 },
    { hour: '20:00', positive: 58, neutral: 28, negative: 14 },
  ];

  const topicSentiment = [
    { topic: 'AI', positive: 78, neutral: 15, negative: 7 },
    { topic: 'Climate', positive: 45, neutral: 35, negative: 20 },
    { topic: 'Crypto', positive: 35, neutral: 40, negative: 25 },
    { topic: 'Gaming', positive: 82, neutral: 12, negative: 6 },
    { topic: 'Politics', positive: 25, neutral: 30, negative: 45 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Sentiment Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-green-500" />
            Overall Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Sentiment Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            24h Sentiment Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlysentiment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Topic Sentiment Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Meh className="w-5 h-5 text-orange-500" />
            Topic Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topicSentiment} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="topic" type="category" width={60} />
              <Tooltip />
              <Bar dataKey="positive" stackId="a" fill="#10b981" />
              <Bar dataKey="neutral" stackId="a" fill="#6b7280" />
              <Bar dataKey="negative" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentChart;