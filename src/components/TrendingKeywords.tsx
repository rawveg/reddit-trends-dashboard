import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp } from "lucide-react";

const TrendingKeywords = () => {
  const keywords = [
    { word: 'artificial', mentions: 1240, growth: 45, size: 'text-4xl' },
    { word: 'intelligence', mentions: 1180, growth: 42, size: 'text-3xl' },
    { word: 'climate', mentions: 890, growth: 23, size: 'text-3xl' },
    { word: 'technology', mentions: 756, growth: 18, size: 'text-2xl' },
    { word: 'breakthrough', mentions: 634, growth: 67, size: 'text-2xl' },
    { word: 'research', mentions: 567, growth: 12, size: 'text-xl' },
    { word: 'innovation', mentions: 445, growth: 34, size: 'text-xl' },
    { word: 'development', mentions: 389, growth: 8, size: 'text-lg' },
    { word: 'future', mentions: 334, growth: 29, size: 'text-lg' },
    { word: 'science', mentions: 298, growth: 15, size: 'text-lg' },
    { word: 'discovery', mentions: 267, growth: 56, size: 'text-base' },
    { word: 'analysis', mentions: 234, growth: 21, size: 'text-base' },
    { word: 'impact', mentions: 198, growth: 38, size: 'text-base' },
    { word: 'global', mentions: 176, growth: 14, size: 'text-sm' },
    { word: 'study', mentions: 145, growth: 9, size: 'text-sm' },
  ];

  const getColor = (growth: number) => {
    if (growth > 40) return 'text-red-500';
    if (growth > 25) return 'text-orange-500';
    if (growth > 15) return 'text-blue-500';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-orange-500" />
          Trending Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 flex flex-wrap items-center justify-center gap-2 p-4">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className={`font-bold cursor-pointer hover:scale-110 transition-transform ${keyword.size} ${getColor(keyword.growth)}`}
              style={{
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                margin: `${Math.random() * 10}px`
              }}
              title={`${keyword.mentions} mentions, +${keyword.growth}% growth`}
            >
              {keyword.word}
            </span>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-500">{keywords.length}</div>
            <div className="text-xs text-gray-600">Keywords</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">
              {keywords.reduce((sum, k) => sum + k.mentions, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Mentions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              +{Math.round(keywords.reduce((sum, k) => sum + k.growth, 0) / keywords.length)}%
            </div>
            <div className="text-xs text-gray-600">Avg Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingKeywords;