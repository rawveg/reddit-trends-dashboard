import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp, TrendingDown } from "lucide-react";

interface Hashtag {
  tag: string;
  mentions: number;
  growth: string;
  category: string;
}

const TrendingHashtags = () => {
  const hashtags: Hashtag[] = [
    { tag: "#AI", mentions: 8420, growth: "+67%", category: "Technology" },
    { tag: "#ClimateChange", mentions: 6890, growth: "+34%", category: "Environment" },
    { tag: "#Crypto", mentions: 5670, growth: "-23%", category: "Finance" },
    { tag: "#SpaceX", mentions: 4320, growth: "+89%", category: "Space" },
    { tag: "#Gaming", mentions: 3890, growth: "+12%", category: "Entertainment" },
    { tag: "#Tesla", mentions: 3450, growth: "+45%", category: "Technology" },
    { tag: "#Bitcoin", mentions: 2980, growth: "-18%", category: "Finance" },
    { tag: "#NASA", mentions: 2670, growth: "+56%", category: "Space" },
  ];

  const categories = ["All", "Technology", "Environment", "Finance", "Space", "Entertainment"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-orange-500" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Badge key={category} variant="outline" className="text-xs cursor-pointer hover:bg-orange-50">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hashtags.map((hashtag, index) => (
            <div key={hashtag.tag} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-500">#{index + 1}</span>
                  {hashtag.growth.startsWith("+") ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
                <Badge
                  variant={hashtag.growth.startsWith("+") ? "default" : "destructive"}
                  className="text-xs"
                >
                  {hashtag.growth}
                </Badge>
              </div>
              
              <h4 className="font-semibold text-blue-600 mb-1">{hashtag.tag}</h4>
              <p className="text-xs text-gray-600 mb-2">
                {hashtag.mentions.toLocaleString()} mentions
              </p>
              <Badge variant="outline" className="text-xs">
                {hashtag.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingHashtags;