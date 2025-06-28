import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [timeRange, setTimeRange] = useState("24h");
  const [sortBy, setSortBy] = useState("mentions");
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);

  const popularSubreddits = [
    "r/technology", "r/worldnews", "r/science", "r/gaming", 
    "r/politics", "r/AskReddit", "r/funny", "r/pics"
  ];

  const addSubreddit = (subreddit: string) => {
    if (!selectedSubreddits.includes(subreddit)) {
      const newSelection = [...selectedSubreddits, subreddit];
      setSelectedSubreddits(newSelection);
      onFiltersChange({ timeRange, sortBy, subreddits: newSelection });
    }
  };

  const removeSubreddit = (subreddit: string) => {
    const newSelection = selectedSubreddits.filter(s => s !== subreddit);
    setSelectedSubreddits(newSelection);
    onFiltersChange({ timeRange, sortBy, subreddits: newSelection });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Time Range</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentions">Most Mentions</SelectItem>
              <SelectItem value="growth">Highest Growth</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Subreddits</label>
          <Select onValueChange={addSubreddit}>
            <SelectTrigger>
              <SelectValue placeholder="Add subreddit filter" />
            </SelectTrigger>
            <SelectContent>
              {popularSubreddits
                .filter(sub => !selectedSubreddits.includes(sub))
                .map(sub => (
                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedSubreddits.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedSubreddits.map(sub => (
                <Badge key={sub} variant="secondary" className="text-xs">
                  {sub}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeSubreddit(sub)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;