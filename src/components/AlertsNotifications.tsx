import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, X, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  keyword: string;
  threshold: number;
  isActive: boolean;
  currentValue: number;
  triggered: boolean;
}

const AlertsNotifications = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      keyword: "artificial intelligence",
      threshold: 10000,
      isActive: true,
      currentValue: 15420,
      triggered: true
    },
    {
      id: "2",
      keyword: "cryptocurrency",
      threshold: 15000,
      isActive: true,
      currentValue: 11250,
      triggered: false
    }
  ]);

  const [newKeyword, setNewKeyword] = useState("");
  const [newThreshold, setNewThreshold] = useState("");

  const addAlert = () => {
    if (newKeyword && newThreshold) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        keyword: newKeyword,
        threshold: parseInt(newThreshold),
        isActive: true,
        currentValue: Math.floor(Math.random() * 20000),
        triggered: false
      };
      setAlerts([...alerts, newAlert]);
      setNewKeyword("");
      setNewThreshold("");
    }
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const recentNotifications = [
    {
      id: "1",
      message: "AI mentions exceeded 10,000 threshold",
      time: "2 hours ago",
      type: "threshold",
      severity: "high"
    },
    {
      id: "2",
      message: "New trending topic detected: quantum computing",
      time: "4 hours ago",
      type: "trending",
      severity: "medium"
    },
    {
      id: "3",
      message: "Unusual spike in climate change discussions",
      time: "6 hours ago",
      type: "spike",
      severity: "high"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new alert */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Create New Alert</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Keyword or topic"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Threshold"
              type="number"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              className="w-24"
            />
            <Button onClick={addAlert} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Active alerts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Active Alerts</h4>
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-sm">{alert.keyword}</h5>
                  {alert.triggered && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Triggered
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAlert(alert.id)}
                    className="h-auto p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-gray-600">
                <p>Threshold: {alert.threshold.toLocaleString()} mentions</p>
                <p>Current: {alert.currentValue.toLocaleString()} mentions</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className={`h-1 rounded-full ${
                      alert.currentValue >= alert.threshold ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min((alert.currentValue / alert.threshold) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent notifications */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Recent Notifications</h4>
          {recentNotifications.map((notification) => (
            <div key={notification.id} className="p-3 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {notification.type === "trending" && (
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  )}
                  {notification.type === "threshold" && (
                    <Bell className="w-4 h-4 text-orange-500" />
                  )}
                  {notification.type === "spike" && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <Badge
                    variant={notification.severity === "high" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {notification.severity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsNotifications;