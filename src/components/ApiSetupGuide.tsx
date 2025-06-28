import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Key, Settings, Database } from "lucide-react";

const ApiSetupGuide = () => {
  const steps = [
    {
      title: "Create Reddit App",
      description: "Go to Reddit's app preferences and create a new application",
      action: "Visit reddit.com/prefs/apps",
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: "Get API Credentials",
      description: "Copy your client ID and client secret",
      action: "Save credentials securely",
      icon: <Key className="w-5 h-5" />
    },
    {
      title: "Configure Environment",
      description: "Add your Reddit API credentials to environment variables",
      action: "Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET",
      icon: <Database className="w-5 h-5" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-500" />
          Connect to Reddit API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            To get real Reddit data, you'll need to set up Reddit API access. 
            This will replace the placeholder data with live trending topics, posts, and analytics.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                {step.icon}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                
                <Badge variant="outline" className="text-xs">
                  {step.action}
                </Badge>
              </div>
              
              <Badge className="text-xs">
                Step {index + 1}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://www.reddit.com/prefs/apps', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Reddit Apps
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://github.com/reddit-archive/reddit/wiki/API', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            API Docs
          </Button>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Reddit API has rate limits. For production use, consider implementing 
            caching and respecting Reddit's API guidelines.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiSetupGuide;