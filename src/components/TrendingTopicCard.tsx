import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendingTopicCardProps {
  topic: {
    term: string;
    mentions: number;
    growth: string;
    subreddits: string[];
  };
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const TrendingTopicCard = ({ topic, index, isSelected, onClick }: TrendingTopicCardProps) => {
  const isPositiveGrowth = topic.growth.startsWith("+");
  
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "bg-orange-50 border-orange-200 shadow-sm"
          : "hover:bg-gray-50 border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-orange-500">#{index + 1}</span>
          {isPositiveGrowth ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <Badge
          variant={isPositiveGrowth ? "default" : "destructive"}
          className="text-xs font-semibold"
        >
          {topic.growth}
        </Badge>
      </div>
      
      <h3 className="font-bold text-gray-900 mb-2 text-lg capitalize">
        {topic.term}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 font-medium">
        {topic.mentions.toLocaleString()} mentions
      </p>
      
      <div className="flex flex-wrap gap-1">
        {topic.subreddits.slice(0, 2).map((sub) => (
          <Badge key={sub} variant="outline" className="text-xs">
            {sub}
          </Badge>
        ))}
        {topic.subreddits.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{topic.subreddits.length - 2} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TrendingTopicCard;