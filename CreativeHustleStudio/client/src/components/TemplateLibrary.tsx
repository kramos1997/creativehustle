import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const TemplateLibrary = () => {
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const isTemplateAccessible = (template: any) => {
    return template.tier === "free" || user?.tier === "premium" || user?.tier === "lifetime";
  };

  const handleDownload = (template: any) => {
    if (!isTemplateAccessible(template)) {
      toast({
        title: "Premium Required",
        description: "This template requires a premium subscription.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started",
      description: `Downloading ${template.title}...`,
    });
    
    // Mock download - in production, this would trigger actual file download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${template.title} has been downloaded successfully.`,
      });
    }, 1000);
  };

  const getIconColor = (category: string) => {
    switch (category) {
      case "business":
        return "from-green-400 to-green-600";
      case "planning":
        return "from-pink-400 to-pink-600";
      case "finance":
        return "from-blue-400 to-blue-600";
      default:
        return "from-purple-400 to-purple-600";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Template Library</h3>
          <Link href="/templates">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.slice(0, 4).map((template: any) => {
            const isAccessible = isTemplateAccessible(template);

            return (
              <div
                key={template.id}
                className={`border rounded-xl p-4 transition-all ${
                  isAccessible
                    ? "hover:shadow-md border-gray-200"
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getIconColor(
                      template.category
                    )} rounded-xl flex items-center justify-center ${
                      !isAccessible ? "opacity-60" : ""
                    }`}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant={template.tier === "free" ? "secondary" : "outline"}
                    className={
                      template.tier === "free"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {template.tier === "free" ? "Free" : "Premium"}
                  </Badge>
                </div>
                <h4
                  className={`font-semibold mb-2 ${
                    isAccessible ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {template.title}
                </h4>
                <p
                  className={`text-sm mb-4 ${
                    isAccessible ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {template.description}
                </p>
                <Button
                  onClick={() => handleDownload(template)}
                  className={`w-full ${
                    isAccessible
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                  disabled={!isAccessible}
                >
                  {isAccessible ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Upgrade to Access
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateLibrary;
