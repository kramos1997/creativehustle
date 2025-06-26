import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const BizChallenge = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: challengeProgress } = useQuery({
    queryKey: ["/api/challenge"],
  });

  const updateChallengeMutation = useMutation({
    mutationFn: (data: { day: number; completed: boolean }) =>
      apiRequest("POST", "/api/challenge", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenge"] });
      toast({
        title: "Challenge Updated!",
        description: "Great job completing today's challenge!",
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

  const getCompletedDays = () => {
    return challengeProgress?.filter((cp: any) => cp.completed).length || 0;
  };

  const getCurrentDay = () => {
    const completed = getCompletedDays();
    return Math.min(completed + 1, 7);
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedDays() / 7) * 100);
  };

  const handleCompleteChallenge = () => {
    const currentDay = getCurrentDay();
    if (currentDay <= 7) {
      updateChallengeMutation.mutate({
        day: currentDay,
        completed: true,
      });
    }
  };

  const challengeContent = {
    1: "Set up your creative workspace and define your business goals",
    2: "Research your target audience and competitors",
    3: "Create your first portfolio piece and price it competitively",
    4: "Set up your social media presence and post your first content",
    5: "Reach out to 3 potential clients or collaborators",
    6: "Create a simple website or online portfolio",
    7: "Launch your business and celebrate your achievement!",
  };

  const currentDay = getCurrentDay();
  const completedDays = getCompletedDays();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="gradient-bg rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">7-Day Biz Challenge</h3>
        <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
          Day {completedDays === 7 ? 7 : currentDay}
        </span>
      </div>
      
      <p className="text-white/90 mb-4">
        {completedDays === 7
          ? "Congratulations! You've completed the 7-Day Business Challenge! 🎉"
          : `Launch your creative business in just one week! Today's challenge: ${
              challengeContent[currentDay as keyof typeof challengeContent]
            }`}
      </p>
      
      <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span>Challenge Progress</span>
          <span>{completedDays}/7 Days</span>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <Button
        onClick={handleCompleteChallenge}
        disabled={updateChallengeMutation.isPending || completedDays === 7}
        className="bg-white text-primary hover:bg-gray-50 font-semibold"
      >
        {updateChallengeMutation.isPending
          ? "Updating..."
          : completedDays === 7
          ? "Challenge Complete!"
          : "Complete Today's Challenge"}
      </Button>
    </div>
  );
};

export default BizChallenge;
