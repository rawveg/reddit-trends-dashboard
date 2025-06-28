import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle, Clock, Wifi, WifiOff, ExternalLink, Timer } from "lucide-react";

interface DataSourceIndicatorProps {
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  dataCount?: number;
}

const DataSourceIndicator = ({ lastUpdated, isLoading, error, onRefresh, dataCount = 0 }: DataSourceIndicatorProps) => {
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

  const isRateLimited = error?.includes('Rate limited') || error?.includes('429');

  const getStatusIcon = () => {
    if (isRateLimited) return <Timer className="w-5 h-5 text-yellow-500" />;
    if (error) return <WifiOff className="w-5 h-5 text-red-500" />;
    if (dataCount > 0) return <Wifi className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isRateLimited) return "Rate Limited";
    if (error) return "Connection Error";
    if (dataCount > 0) return "Live Data";
    return "No Data";
  };

  const getStatusColor = () => {
    if (isRateLimited) return "secondary";
    if (error) return "destructive";
    if (dataCount > 0) return "default";
    return "secondary";
  };

  const getBorderColor = () => {
    if (isRateLimited) return 'border-l-yellow-500';
    if (error) return 'border-l-red-500';
    if (dataCount > 0) return 'border-l-green-500';
    return 'border-l-yellow-500';
  };

  return (
    <Card className={`border-l-4 ${getBorderColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">Reddit API</span>
                <Badge variant={getStatusColor()} className="text-xs">
                  {getStatusText()}
                </Badge>
                {dataCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {dataCount} items
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                <Clock className="w-3 h-3" />
                <span>Last updated: {getTimeSinceUpdate()}</span>
              </div>
              
              {error && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-red-600">{error}</p>
                  {isRateLimited && (
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                      <p className="text-xs text-yellow-800">
                        <strong>Rate Limiting Active:</strong> Reddit limits API requests to prevent abuse. 
                        The app will automatically retry when the limit resets. Please avoid manual refreshes.
                      </p>
                    </div>
                  )}
                  {!isRateLimited && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://api.allorigins.win/', '_blank')}
                        className="text-xs h-6"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Check CORS Proxy
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {!error && dataCount === 0 && !isLoading && (
                <p className="text-xs text-yellow-600 mt-1">
                  Attempting to fetch data via CORS proxy...
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || isRateLimited}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : isRateLimited ? 'Rate Limited' : 'Refresh'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceIndicator;