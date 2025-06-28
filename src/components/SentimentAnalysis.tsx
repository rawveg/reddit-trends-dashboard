import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, TrendingUp } from "lucide-react";

interface SentimentAnalysisProps {
  topic: string;
}

const SentimentAnalysis = ({ topic }: SentimentAnalysisProps) => {
  const sentimentData = {
    positive: 65,
    neutral: 25,
    negative: 10,
    overallScore: 7.2,
    trend: "+12%"
  };

  const topPositiveKeywords = ["breakthrough", "amazing", "revolutionary", "excellent", "promising"];
  const topNegativeKeywords = ["concerning", "disappointing", "problematic", "risky", "uncertain"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-orange-500" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {sentimentData.overallScore}/10
          </div>
          <div className="text-sm text-gray-600 mb-1">Overall Sentiment Score</div>
          <Badge variant="default" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            {sentimentData.trend} vs last week
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Positive</span>
            </div>
            <span className="text-sm font-bold">{sentimentData.positive}%</span>
          </div>
          <Progress value={sentimentData.positive} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Meh className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Neutral</span>
            </div>
            <span className="text-sm font-bold">{sentimentData.neutral}%</span>
          </div>
          <Progress value={sentimentData.neutral} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Negative</span>
            </div>
            <span className="text-sm font-bold">{sentimentData.negative}%</span>
          </div>
          <Progress value={sentimentData.negative} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-sm mb-2 text-green-600">Top Positive Keywords</h5>
            <div className="flex flex-wrap gap-1">
              {topPositiveKeywords.map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs text-green-600 border-green-200">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-medium text-sm mb-2 text-red-600">Top Negative Keywords</h5>
            <div className="flex flex-wrap gap-1">
              {topNegativeKeywords.map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs text-red-600 border-red-200">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;