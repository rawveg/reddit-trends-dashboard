import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const ActivityHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate mock activity data (0-100 intensity)
  const getActivityIntensity = (day: number, hour: number) => {
    // Simulate higher activity during work hours and weekends
    const isWeekend = day >= 5;
    const isWorkHour = hour >= 9 && hour <= 17;
    const isEveningPeak = hour >= 19 && hour <= 22;
    
    let base = Math.random() * 30;
    if (isWeekend) base += 20;
    if (isWorkHour) base += 25;
    if (isEveningPeak) base += 30;
    
    return Math.min(100, base);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity < 20) return 'bg-gray-100';
    if (intensity < 40) return 'bg-orange-200';
    if (intensity < 60) return 'bg-orange-400';
    if (intensity < 80) return 'bg-orange-600';
    return 'bg-orange-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hour labels */}
          <div className="flex items-center gap-1">
            <div className="w-12"></div>
            {[0, 6, 12, 18].map(hour => (
              <div key={hour} className="flex-1 text-xs text-gray-500 text-center">
                {hour}:00
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-1">
                <div className="w-12 text-xs text-gray-600 font-medium">{day}</div>
                <div className="flex gap-1 flex-1">
                  {hours.map(hour => {
                    const intensity = getActivityIntensity(dayIndex, hour);
                    return (
                      <div
                        key={hour}
                        className={`h-3 flex-1 rounded-sm ${getIntensityColor(intensity)} hover:scale-110 transition-transform cursor-pointer`}
                        title={`${day} ${hour}:00 - ${intensity.toFixed(0)}% activity`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Less active</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-800 rounded-sm"></div>
            </div>
            <span>More active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;