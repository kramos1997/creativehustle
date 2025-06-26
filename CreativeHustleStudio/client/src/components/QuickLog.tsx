import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ActivityType } from "@/types";

const activitySchema = z.object({
  type: z.enum(["client_work", "practice", "marketing", "admin"]),
  hours: z.coerce.number().min(0.1).max(24),
  income: z.coerce.number().min(0).default(0),
  description: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

const QuickLog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: "client_work",
      hours: 0,
      income: 0,
      description: "",
    },
  });

  const activityType = watch("type");

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

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Log</h3>
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
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="Brief description of the work"
              {...register("description")}
              className="w-full"
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
  );
};

export default QuickLog;
