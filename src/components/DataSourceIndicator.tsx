import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface DataSourceIndicatorProps {
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const DataSourceIndicator = ({ lastUpdated, isLoading, error, onRefresh }: DataSourceIndicatorProps) => {
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Reddit API Data</span>
                <Badge variant={error ? "destructive" : "default"} className="text-xs">
                  {error ? "Error" : "Live"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                <Clock className="w-3 h-3" />
                <span>Last updated: {getTimeSinceUpdate()}</span>
              </div>
              
              {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceIndicator;