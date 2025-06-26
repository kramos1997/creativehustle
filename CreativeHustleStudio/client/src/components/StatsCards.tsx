import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserStats } from "@/types";

const StatsCards = () => {
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const progressPercentage = 23; // Mock progress calculation

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Earned This Month</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats?.thisMonthIncome?.toFixed(0) || "0"}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hours Hustled</p>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--creative))" }}>
                {stats?.totalHours || 0}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "hsl(var(--creative) / 0.1)" }}
            >
              <Clock className="w-6 h-6" style={{ color: "hsl(var(--creative))" }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-2xl font-bold" style={{ color: "hsl(var(--warm))" }}>
                {stats?.activeProjects || 0}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "hsl(var(--warm) / 0.1)" }}
            >
              <Briefcase className="w-6 h-6" style={{ color: "hsl(var(--warm))" }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
