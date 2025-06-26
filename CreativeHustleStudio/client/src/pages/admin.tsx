import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, FileText, BarChart3, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  tier: z.enum(["free", "premium"]),
  orderIndex: z.coerce.number().min(1),
  status: z.enum(["draft", "published"]),
  estimatedMinutes: z.coerce.number().min(1),
});

const templateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tier: z.enum(["free", "premium"]),
  downloadUrl: z.string().optional(),
  fileType: z.string().default("pdf"),
});

type ModuleForm = z.infer<typeof moduleSchema>;
type TemplateForm = z.infer<typeof templateSchema>;

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  // Queries
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["/api/modules"],
  });

  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Module form
  const moduleForm = useForm<ModuleForm>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      tier: "free",
      orderIndex: 1,
      status: "draft",
      estimatedMinutes: 15,
    },
  });

  // Template form
  const templateForm = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tier: "free",
      downloadUrl: "",
      fileType: "pdf",
    },
  });

  // Mutations
  const createModuleMutation = useMutation({
    mutationFn: (data: ModuleForm) => apiRequest("POST", "/api/modules", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Success", description: "Module created successfully!" });
      setIsModuleDialogOpen(false);
      moduleForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ModuleForm> }) =>
      apiRequest("PATCH", `/api/modules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Success", description: "Module updated successfully!" });
      setIsModuleDialogOpen(false);
      setSelectedModule(null);
      moduleForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/modules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules"] });
      toast({ title: "Success", description: "Module deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: TemplateForm) => apiRequest("POST", "/api/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Success", description: "Template created successfully!" });
      setIsTemplateDialogOpen(false);
      templateForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TemplateForm> }) =>
      apiRequest("PATCH", `/api/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Success", description: "Template updated successfully!" });
      setIsTemplateDialogOpen(false);
      setSelectedTemplate(null);
      templateForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Success", description: "Template deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Handlers
  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    moduleForm.reset(module);
    setIsModuleDialogOpen(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    templateForm.reset(template);
    setIsTemplateDialogOpen(true);
  };

  const handleAddModule = () => {
    setSelectedModule(null);
    moduleForm.reset();
    setIsModuleDialogOpen(true);
  };

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    templateForm.reset();
    setIsTemplateDialogOpen(true);
  };

  const onModuleSubmit = (data: ModuleForm) => {
    if (selectedModule) {
      updateModuleMutation.mutate({ id: selectedModule.id, data });
    } else {
      createModuleMutation.mutate(data);
    }
  };

  const onTemplateSubmit = (data: TemplateForm) => {
    if (selectedTemplate) {
      updateTemplateMutation.mutate({ id: selectedTemplate.id, data });
    } else {
      createTemplateMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management System</h1>
          <p className="text-gray-600">
            Manage curriculum modules, templates, users, and analytics for Dorm Desk Studio.
          </p>
        </div>

        <Tabs defaultValue="curriculum" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Curriculum
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Curriculum Management */}
          <TabsContent value="curriculum" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Manage Curriculum Modules</h2>
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddModule} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedModule ? "Edit Module" : "Create New Module"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={moduleForm.handleSubmit(onModuleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input {...moduleForm.register("title")} />
                        {moduleForm.formState.errors.title && (
                          <p className="text-red-500 text-sm">{moduleForm.formState.errors.title.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="orderIndex">Order Index</Label>
                        <Input type="number" {...moduleForm.register("orderIndex")} />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input {...moduleForm.register("description")} />
                      {moduleForm.formState.errors.description && (
                        <p className="text-red-500 text-sm">{moduleForm.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea {...moduleForm.register("content")} rows={6} />
                      {moduleForm.formState.errors.content && (
                        <p className="text-red-500 text-sm">{moduleForm.formState.errors.content.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tier">Tier</Label>
                        <Select onValueChange={(value) => moduleForm.setValue("tier", value as "free" | "premium")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(value) => moduleForm.setValue("status", value as "draft" | "published")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estimatedMinutes">Duration (minutes)</Label>
                        <Input type="number" {...moduleForm.register("estimatedMinutes")} />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createModuleMutation.isPending || updateModuleMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {selectedModule ? "Update" : "Create"} Module
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {modulesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="pt-6">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                modules?.map((module: any) => (
                  <Card key={module.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600">
                            Status: {module.status} • Tier: {module.tier}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditModule(module)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteModuleMutation.mutate(module.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Order:</span>
                          <span className="font-medium text-gray-900 ml-1">{module.orderIndex}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-900 ml-1">{module.estimatedMinutes} min</span>
                        </div>
                        <div>
                          <Badge variant={module.tier === "free" ? "secondary" : "outline"}>
                            {module.tier}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Template Management */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Manage Templates</h2>
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddTemplate} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedTemplate ? "Edit Template" : "Create New Template"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input {...templateForm.register("title")} />
                      {templateForm.formState.errors.title && (
                        <p className="text-red-500 text-sm">{templateForm.formState.errors.title.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea {...templateForm.register("description")} rows={3} />
                      {templateForm.formState.errors.description && (
                        <p className="text-red-500 text-sm">{templateForm.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input {...templateForm.register("category")} />
                      </div>
                      <div>
                        <Label htmlFor="tier">Tier</Label>
                        <Select onValueChange={(value) => templateForm.setValue("tier", value as "free" | "premium")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="downloadUrl">Download URL</Label>
                      <Input {...templateForm.register("downloadUrl")} placeholder="/templates/file.pdf" />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {selectedTemplate ? "Update" : "Create"} Template
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templatesLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-24 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                templates?.map((template: any) => (
                  <Card key={template.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{template.title}</h3>
                        <Badge variant={template.tier === "free" ? "secondary" : "outline"}>
                          {template.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteTemplateMutation.mutate(template.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-500">User management features will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-green-600">342</div>
                  <div className="text-sm text-gray-600">Premium Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(var(--warm))" }}>$2,394</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold" style={{ color: "hsl(var(--creative))" }}>89%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Analytics</h3>
                  <p className="text-gray-500">Advanced analytics and reporting features will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
