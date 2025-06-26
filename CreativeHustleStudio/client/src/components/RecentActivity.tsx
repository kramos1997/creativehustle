import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "client_work":
        return "bg-green-500";
      case "practice":
        return "bg-primary";
      case "marketing":
        return "bg-[hsl(var(--creative))]";
      case "admin":
        return "bg-[hsl(var(--warm))]";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "client_work":
        return "Client Work";
      case "practice":
        return "Practice/Study";
      case "marketing":
        return "Marketing";
      case "admin":
        return "Admin Tasks";
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities?.slice(0, 5).map((activity: any) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {activity.description || `Logged ${activity.hours} hours of ${getActivityLabel(activity.type)}`}
                  {parseFloat(activity.income) > 0 && ` - $${activity.income}`}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {(!activities || activities.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent activities. Start logging your creative work!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
