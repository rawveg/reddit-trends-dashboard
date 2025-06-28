import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle, ExternalLink, Clock, Search } from "lucide-react";

interface SearchResult {
  type: "post" | "subreddit" | "topic";
  title: string;
  subreddit?: string;
  upvotes?: number;
  comments?: number;
  timeAgo?: string;
  mentions?: number;
  growth?: string;
  description?: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  onClearSearch: () => void;
}

const SearchResults = ({ query, results, onClearSearch }: SearchResultsProps) => {
  const postResults = results.filter(r => r.type === "post");
  const subredditResults = results.filter(r => r.type === "subreddit");
  const topicResults = results.filter(r => r.type === "topic");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-500" />
              Search Results for "{query}"
            </div>
            <Button variant="outline" size="sm" onClick={onClearSearch}>
              Clear Search
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            Found {results.length} results across posts, subreddits, and topics
          </div>
        </CardContent>
      </Card>

      {/* Topic Results */}
      {topicResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topicResults.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg capitalize">{result.title}</h4>
                  <Badge
                    variant={result.growth?.startsWith("+") ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {result.growth}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {result.mentions?.toLocaleString()} mentions
                </p>
                {result.description && (
                  <p className="text-sm text-gray-700">{result.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Subreddit Results */}
      {subredditResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Subreddits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subredditResults.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-600">{result.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {result.mentions?.toLocaleString()} posts
                  </Badge>
                </div>
                {result.description && (
                  <p className="text-sm text-gray-700">{result.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Post Results */}
      {postResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postResults.map((result, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
                    {result.title}
                  </h4>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {result.subreddit}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {result.timeAgo}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    {result.upvotes?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {result.comments}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {results.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching for different keywords or check your spelling.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;