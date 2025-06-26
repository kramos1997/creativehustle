import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ActivityType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Clock, DollarSign, TrendingUp, Calendar } from "lucide-react";

const activitySchema = z.object({
  type: z.enum(["client_work", "practice", "marketing", "admin"]),
  hours: z.coerce.number().min(0.1).max(24),
  income: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

const Tracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: "client_work",
      hours: 0,
      income: 0,
      description: "",
    },
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: ActivityForm) => apiRequest("POST", "/api/activities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Activity Logged",
        description: "Your activity has been successfully logged!",
      });
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ActivityForm) => {
    createActivityMutation.mutate(data);
  };

  const activityOptions = [
    { value: "client_work", label: "Client Work" },
    { value: "practice", label: "Practice/Study" },
    { value: "marketing", label: "Marketing" },
    { value: "admin", label: "Admin Tasks" },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "client_work":
        return "text-green-600 bg-green-100";
      case "practice":
        return "text-primary bg-primary/10";
      case "marketing":
        return "text-pink-600 bg-pink-100";
      case "admin":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActivityLabel = (type: string) => {
    return activityOptions.find(option => option.value === type)?.label || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hustle Tracker</h1>
          <p className="text-gray-600">
            Track your creative work hours, income, and progress toward your goals.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalHours || 0}</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${stats?.totalIncome?.toFixed(0) || "0"}
              </div>
              <div className="text-sm text-gray-600">Total Income</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${stats?.thisMonthIncome?.toFixed(0) || "0"}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.activeProjects || 0}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Log Activity Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Log New Activity</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Type
                    </Label>
                    <Select onValueChange={(value) => setValue("type", value as ActivityType)} defaultValue="client_work">
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {activityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Spent
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      placeholder="2.5"
                      {...register("hours")}
                      className="w-full"
                    />
                    {errors.hours && (
                      <p className="text-red-500 text-sm mt-1">{errors.hours.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
                      Income Earned ($)
                    </Label>
                    <Input
                      id="income"
                      type="number"
                      step="0.01"
                      placeholder="50.00"
                      {...register("income")}
                      className="w-full"
                    />
                    {errors.income && (
                      <p className="text-red-500 text-sm mt-1">{errors.income.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the work..."
                      {...register("description")}
                      className="w-full"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createActivityMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {createActivityMutation.isPending ? "Logging..." : "Log Activity"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Activity History */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h3>
                
                {activitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities?.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity: any) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          <span className="text-xs font-medium">
                            {getActivityLabel(activity.type).charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {activity.description || getActivityLabel(activity.type)}
                            </h4>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.hours}h
                                {parseFloat(activity.income) > 0 && (
                                  <span className="text-green-600 ml-2">
                                    +${activity.income}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="capitalize">
                              {getActivityLabel(activity.type)}
                            </span>
                            <span>
                              {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                    <p className="text-gray-500">Start logging your creative work to track your progress!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;
