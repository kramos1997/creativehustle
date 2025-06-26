import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Lock, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Templates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const filteredTemplates = templates?.filter((template: any) => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "business", "planning", "finance"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Library</h1>
          <p className="text-gray-600">
            Download professionally designed templates to streamline your creative business.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates?.map((template: any) => {
            const isAccessible = isTemplateAccessible(template);

            return (
              <Card
                key={template.id}
                className={`transition-all ${
                  isAccessible
                    ? "hover:shadow-lg cursor-pointer"
                    : "opacity-60"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${getIconColor(
                        template.category
                      )} rounded-xl flex items-center justify-center ${
                        !isAccessible ? "opacity-60" : ""
                      }`}
                    >
                      <FileText className="w-8 h-8 text-white" />
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

                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isAccessible ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {template.title}
                  </h3>
                  
                  <p
                    className={`text-sm mb-4 ${
                      isAccessible ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {template.description}
                  </p>

                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.category}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleDownload(template)}
                    className={`w-full ${
                      isAccessible
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    disabled={!isAccessible}
                  >
                    {isAccessible ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Premium Only
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
