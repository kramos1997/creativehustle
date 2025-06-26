import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Clock, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Curriculum = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["/api/modules"],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const updateProgressMutation = useMutation({
    mutationFn: (data: { moduleId: number; progress: number; completed: boolean }) =>
      apiRequest("POST", "/api/progress", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress Updated",
        description: "Your module progress has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getModuleProgress = (moduleId: number) => {
    return progress?.find((p: any) => p.moduleId === moduleId);
  };

  const isModuleAccessible = (module: any) => {
    return module.tier === "free" || user?.tier === "premium" || user?.tier === "lifetime";
  };

  const handleStartModule = (moduleId: number) => {
    const currentProgress = getModuleProgress(moduleId);
    const newProgress = Math.min((currentProgress?.progress || 0) + 25, 100);
    
    updateProgressMutation.mutate({
      moduleId,
      progress: newProgress,
      completed: newProgress === 100,
    });
  };

  if (modulesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Startup Curriculum</h1>
          <p className="text-gray-600">
            Master the fundamentals of building a creative business from your dorm room.
          </p>
        </div>

        <div className="space-y-6">
          {modules?.map((module: any) => {
            const moduleProgress = getModuleProgress(module.id);
            const isAccessible = isModuleAccessible(module);
            const isCompleted = moduleProgress?.completed;
            const progressPercent = moduleProgress?.progress || 0;

            return (
              <Card
                key={module.id}
                className={`transition-all ${
                  isCompleted
                    ? "border-green-200 bg-green-50"
                    : progressPercent > 0
                    ? "border-primary/20 bg-primary/5"
                    : !isAccessible
                    ? "border-gray-200 bg-gray-50"
                    : "hover:shadow-md"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500"
                            : progressPercent > 0
                            ? "bg-primary"
                            : !isAccessible
                            ? "bg-gray-300"
                            : "bg-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : !isAccessible ? (
                          <Lock className="w-5 h-5 text-gray-600" />
                        ) : (
                          <span className="text-white font-bold">
                            {module.orderIndex}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            !isAccessible ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {module.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            !isAccessible ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={module.tier === "free" ? "secondary" : "outline"}
                        className={
                          module.tier === "free"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      >
                        {module.tier === "free" ? "Free" : "Premium"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.estimatedMinutes} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Beginner Level</span>
                    </div>
                  </div>

                  {isAccessible && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2">
                        {module.content.substring(0, 200)}...
                      </p>
                    </div>
                  )}

                  {progressPercent > 0 && progressPercent < 100 && isAccessible && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-600">{progressPercent}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-700">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div>
                      {isCompleted ? (
                        <Button variant="outline" disabled>
                          Completed
                        </Button>
                      ) : !isAccessible ? (
                        <Button variant="outline" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Upgrade Required
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStartModule(module.id)}
                          disabled={updateProgressMutation.isPending}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {progressPercent > 0 ? "Continue" : "Start Module"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
