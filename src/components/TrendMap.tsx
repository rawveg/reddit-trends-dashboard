import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe } from "lucide-react";
import { useState } from "react";

interface RegionData {
  region: string;
  mentions: number;
  growth: string;
  topSubreddits: string[];
}

const TrendMap = () => {
  const [selectedMetric, setSelectedMetric] = useState("mentions");
  
  const regionData: RegionData[] = [
    {
      region: "North America",
      mentions: 45230,
      growth: "+34%",
      topSubreddits: ["r/technology", "r/news", "r/politics"]
    },
    {
      region: "Europe",
      mentions: 32890,
      growth: "+28%",
      topSubreddits: ["r/europe", "r/worldnews", "r/science"]
    },
    {
      region: "Asia Pacific",
      mentions: 28450,
      growth: "+67%",
      topSubreddits: ["r/technology", "r/gaming", "r/anime"]
    },
    {
      region: "South America",
      mentions: 12340,
      growth: "+23%",
      topSubreddits: ["r/worldnews", "r/soccer", "r/brasil"]
    },
    {
      region: "Africa",
      mentions: 8920,
      growth: "+45%",
      topSubreddits: ["r/worldnews", "r/technology", "r/africa"]
    },
    {
      region: "Oceania",
      mentions: 6780,
      growth: "+19%",
      topSubreddits: ["r/australia", "r/newzealand", "r/worldnews"]
    }
  ];

  const getIntensityColor = (mentions: number) => {
    const max = Math.max(...regionData.map(r => r.mentions));
    const intensity = mentions / max;
    
    if (intensity > 0.8) return "bg-orange-600";
    if (intensity > 0.6) return "bg-orange-500";
    if (intensity > 0.4) return "bg-orange-400";
    if (intensity > 0.2) return "bg-orange-300";
    return "bg-orange-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-orange-500" />
          Geographic Trends
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentions">Mentions</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simplified world map representation */}
        <div className="relative bg-gray-100 rounded-lg p-6 min-h-64">
          <div className="text-center text-gray-500 text-sm mb-4">
            Interactive World Map (Simplified View)
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {regionData.map((region) => (
              <div
                key={region.region}
                className={`p-4 rounded-lg border-2 border-white shadow-sm cursor-pointer transition-all hover:scale-105 ${getIntensityColor(region.mentions)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-white" />
                  <h4 className="font-semibold text-white text-sm">{region.region}</h4>
                </div>
                <p className="text-white text-xs font-medium">
                  {region.mentions.toLocaleString()} mentions
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {region.growth}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Region details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Regional Breakdown</h4>
          {regionData.map((region) => (
            <div key={region.region} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-sm">{region.region}</h5>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {region.mentions.toLocaleString()}
                  </span>
                  <Badge
                    variant={region.growth.startsWith("+") ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {region.growth}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {region.topSubreddits.map(sub => (
                  <Badge key={sub} variant="outline" className="text-xs">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Activity Level:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-600 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendMap;