import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, CheckCircle, Clock, Wifi, WifiOff, Activity, Timer, ExternalLink, Info } from "lucide-react";
import { useState } from "react";

interface DataSourceIndicatorProps {
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  dataCount?: number;
}

const DataSourceIndicator = ({ lastUpdated, isLoading, error, onRefresh, dataCount = 0 }: DataSourceIndicatorProps) => {
  const [testingProxy, setTestingProxy] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<'unknown' | 'working' | 'failed'>('unknown');

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

  const testCorsProxy = async () => {
    setTestingProxy(true);
    try {
      // Test the CORS proxy with a simple Reddit API call
      const testUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.reddit.com/r/test.json?limit=1');
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.children) {
          setProxyStatus('working');
        } else {
          setProxyStatus('failed');
        }
      } else {
        setProxyStatus('failed');
      }
    } catch (err) {
      setProxyStatus('failed');
    } finally {
      setTestingProxy(false);
    }
  };

  const isRateLimited = error?.includes('Rate limited') || error?.includes('429');
  const isCorsIssue = error?.includes('CORS') || error?.includes('fetch') || proxyStatus === 'failed';

  const getStatusIcon = () => {
    if (isRateLimited) return <Timer className="w-5 h-5 text-yellow-500" />;
    if (error) return <WifiOff className="w-5 h-5 text-red-500" />;
    if (dataCount > 0) return <Wifi className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isRateLimited) return "Rate Limited";
    if (isCorsIssue) return "CORS Proxy Down";
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

  const getProxyStatusBadge = () => {
    if (proxyStatus === 'working') {
      return <Badge variant="default" className="text-xs bg-green-100 text-green-800">Proxy OK</Badge>;
    }
    if (proxyStatus === 'failed') {
      return <Badge variant="destructive" className="text-xs">Proxy Down</Badge>;
    }
    return null;
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
                {getProxyStatusBadge()}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                <Clock className="w-3 h-3" />
                <span>Last updated: {getTimeSinceUpdate()}</span>
              </div>
              
              {error && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-red-600">{error}</p>
                  
                  {isRateLimited && (
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="text-xs text-yellow-800">
                        <strong>Rate Limiting Active:</strong> Reddit limits API requests to prevent abuse. 
                        The app will automatically retry when the limit resets. Please avoid manual refreshes.
                      </p>
                    </div>
                  )}
                  
                  {isCorsIssue && (
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-800 space-y-2">
                          <p><strong>CORS Proxy Unavailable:</strong> The service we use to bypass browser restrictions is currently down.</p>
                          <div className="space-y-1">
                            <p><strong>Why this happens:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Browsers block direct requests to Reddit from web apps</li>
                              <li>We rely on a third-party CORS proxy service</li>
                              <li>These free services can be unreliable</li>
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <p><strong>Solutions:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Wait for the proxy service to come back online</li>
                              <li>Try refreshing in a few minutes</li>
                              <li>For production use, set up your own backend API</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isRateLimited && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={testCorsProxy}
                        disabled={testingProxy}
                        className="text-xs h-6"
                      >
                        <Activity className={`w-3 h-3 mr-1 ${testingProxy ? 'animate-pulse' : ''}`} />
                        {testingProxy ? 'Testing...' : 'Test Proxy'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.redditstatus.com/', '_blank')}
                        className="text-xs h-6"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Reddit Status
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