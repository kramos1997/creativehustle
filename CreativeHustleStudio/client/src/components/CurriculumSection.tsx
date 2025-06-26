import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CurriculumSection = () => {
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

  if (modulesLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getModuleProgress = (moduleId: number) => {
    return progress?.find((p: any) => p.moduleId === moduleId);
  };

  const getCompletedCount = () => {
    return progress?.filter((p: any) => p.completed).length || 0;
  };

  const isModuleAccessible = (module: any) => {
    return module.tier === "free" || user?.tier === "premium" || user?.tier === "lifetime";
  };

  const handleContinue = (moduleId: number) => {
    const currentProgress = getModuleProgress(moduleId);
    const newProgress = Math.min((currentProgress?.progress || 0) + 10, 100);
    
    updateProgressMutation.mutate({
      moduleId,
      progress: newProgress,
      completed: newProgress === 100,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Startup Curriculum</h3>
          <Badge variant="secondary">
            {getCompletedCount()}/{modules?.length || 0} Complete
          </Badge>
        </div>

        <div className="space-y-4">
          {modules?.map((module: any) => {
            const moduleProgress = getModuleProgress(module.id);
            const isAccessible = isModuleAccessible(module);
            const isCompleted = moduleProgress?.completed;
            const progressPercent = moduleProgress?.progress || 0;

            return (
              <div
                key={module.id}
                className={`border rounded-xl p-4 transition-all ${
                  isCompleted
                    ? "border-green-200 bg-green-50"
                    : progressPercent > 0
                    ? "border-primary/20 bg-primary/5"
                    : !isAccessible
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : !isAccessible ? (
                        <Lock className="w-4 h-4 text-gray-600" />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {module.orderIndex}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${!isAccessible ? "text-gray-500" : "text-gray-900"}`}>
                        {module.title}
                      </h4>
                      <p className={`text-sm ${!isAccessible ? "text-gray-400" : "text-gray-600"}`}>
                        {module.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    ) : !isAccessible ? (
                      <Badge variant="secondary" style={{ backgroundColor: "hsl(var(--warm) / 0.1)", color: "hsl(var(--warm))" }}>
                        Premium
                      </Badge>
                    ) : progressPercent > 0 ? (
                      <Button
                        onClick={() => handleContinue(module.id)}
                        disabled={updateProgressMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleContinue(module.id)}
                        disabled={updateProgressMutation.isPending}
                        variant="outline"
                      >
                        Start
                      </Button>
                    )}
                  </div>
                </div>
                {progressPercent > 0 && progressPercent < 100 && isAccessible && (
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{progressPercent}% complete</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumSection;
