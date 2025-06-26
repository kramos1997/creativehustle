import { 
  users, modules, templates, userProgress, activities, challengeProgress,
  type User, type InsertUser, type Module, type InsertModule,
  type Template, type InsertTemplate, type UserProgress, type InsertUserProgress,
  type Activity, type InsertActivity, type ChallengeProgress, type InsertChallengeProgress
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTier(id: number, tier: string): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId: string): Promise<User>;

  // Modules
  getModules(): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, updates: Partial<InsertModule>): Promise<Module>;
  deleteModule(id: number): Promise<boolean>;

  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<boolean>;

  // User Progress
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined>;
  createOrUpdateProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Activities
  getUserActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserStats(userId: number): Promise<{
    totalHours: number;
    totalIncome: number;
    thisMonthIncome: number;
    activeProjects: number;
  }>;

  // Challenge Progress
  getUserChallengeProgress(userId: number): Promise<ChallengeProgress[]>;
  updateChallengeProgress(userId: number, day: number, completed: boolean): Promise<ChallengeProgress>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private modules: Map<number, Module>;
  private templates: Map<number, Template>;
  private userProgress: Map<number, UserProgress>;
  private activities: Map<number, Activity>;
  private challengeProgress: Map<number, ChallengeProgress>;
  private currentUserId: number;
  private currentModuleId: number;
  private currentTemplateId: number;
  private currentProgressId: number;
  private currentActivityId: number;
  private currentChallengeId: number;

  constructor() {
    this.users = new Map();
    this.modules = new Map();
    this.templates = new Map();
    this.userProgress = new Map();
    this.activities = new Map();
    this.challengeProgress = new Map();
    this.currentUserId = 1;
    this.currentModuleId = 1;
    this.currentTemplateId = 1;
    this.currentProgressId = 1;
    this.currentActivityId = 1;
    this.currentChallengeId = 1;

    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "sarah_artist",
      email: "sarah@example.com",
      password: "password123",
      tier: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create sample modules
    const sampleModules: Module[] = [
      {
        id: 1,
        title: "Finding Your Creative Niche",
        description: "Discover what makes your art unique",
        content: "In this module, you'll learn how to identify your unique creative style...",
        tier: "free",
        orderIndex: 1,
        status: "published",
        estimatedMinutes: 12,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Pricing Your Creative Work",
        description: "Learn to value your time and talent",
        content: "Pricing is one of the biggest challenges for creative entrepreneurs...",
        tier: "free",
        orderIndex: 2,
        status: "published",
        estimatedMinutes: 18,
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Building Your Brand Identity",
        description: "Create a memorable visual presence",
        content: "Your brand is more than just a logo - it's your entire visual identity...",
        tier: "premium",
        orderIndex: 3,
        status: "published",
        estimatedMinutes: 25,
        createdAt: new Date(),
      },
      {
        id: 4,
        title: "Marketing on Social Media",
        description: "Grow your audience authentically",
        content: "Social media marketing for creatives requires a different approach...",
        tier: "premium",
        orderIndex: 4,
        status: "published",
        estimatedMinutes: 30,
        createdAt: new Date(),
      },
    ];

    sampleModules.forEach(module => {
      this.modules.set(module.id, module);
    });
    this.currentModuleId = 5;

    // Create sample templates
    const sampleTemplates: Template[] = [
      {
        id: 1,
        title: "Basic Pricing Calculator",
        description: "Simple spreadsheet to calculate your artwork pricing",
        category: "business",
        tier: "free",
        downloadUrl: "/templates/pricing-calculator.pdf",
        fileType: "pdf",
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Goal Setting Worksheet",
        description: "Set and track your creative business goals",
        category: "planning",
        tier: "free",
        downloadUrl: "/templates/goal-worksheet.pdf",
        fileType: "pdf",
        createdAt: new Date(),
      },
      {
        id: 3,
        title: "Complete Business Planner",
        description: "90-day roadmap with goals, milestones, and action items",
        category: "business",
        tier: "premium",
        downloadUrl: "/templates/business-planner.pdf",
        fileType: "pdf",
        createdAt: new Date(),
      },
      {
        id: 4,
        title: "Financial Tracker",
        description: "Track income, expenses, and profit margins",
        category: "finance",
        tier: "premium",
        downloadUrl: "/templates/financial-tracker.xlsx",
        fileType: "excel",
        createdAt: new Date(),
      },
    ];

    sampleTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
    this.currentTemplateId = 5;

    // Create sample progress
    const sampleProgress: UserProgress[] = [
      {
        id: 1,
        userId: 1,
        moduleId: 1,
        completed: true,
        progress: 100,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        moduleId: 2,
        completed: false,
        progress: 65,
        completedAt: null,
        createdAt: new Date(),
      },
    ];

    sampleProgress.forEach(progress => {
      this.userProgress.set(progress.id, progress);
    });
    this.currentProgressId = 3;

    // Create sample activities
    const sampleActivities: Activity[] = [
      {
        id: 1,
        userId: 1,
        type: "client_work",
        hours: "3.0",
        income: "75.00",
        description: "Logo design for local cafe",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        type: "practice",
        hours: "2.5",
        income: "0.00",
        description: "Digital painting practice",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    ];

    sampleActivities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
    this.currentActivityId = 3;

    // Create sample challenge progress
    const sampleChallengeProgress: ChallengeProgress[] = [
      {
        id: 1,
        userId: 1,
        day: 1,
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        day: 2,
        completed: true,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        day: 3,
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
    ];

    sampleChallengeProgress.forEach(progress => {
      this.challengeProgress.set(progress.id, progress);
    });
    this.currentChallengeId = 4;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      tier: insertUser.tier || 'free',
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserTier(id: number, tier: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, tier };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Module methods
  async getModules(): Promise<Module[]> {
    return Array.from(this.modules.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.currentModuleId++;
    const module: Module = {
      ...insertModule,
      id,
      tier: insertModule.tier || 'free',
      status: insertModule.status || 'published',
      estimatedMinutes: insertModule.estimatedMinutes || 30,
      createdAt: new Date(),
    };
    this.modules.set(id, module);
    return module;
  }

  async updateModule(id: number, updates: Partial<InsertModule>): Promise<Module> {
    const module = this.modules.get(id);
    if (!module) throw new Error("Module not found");
    
    const updatedModule = { ...module, ...updates };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }

  async deleteModule(id: number): Promise<boolean> {
    return this.modules.delete(id);
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = {
      ...insertTemplate,
      id,
      tier: insertTemplate.tier || 'free',
      downloadUrl: insertTemplate.downloadUrl || null,
      fileType: insertTemplate.fileType || 'pdf',
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template> {
    const template = this.templates.get(id);
    if (!template) throw new Error("Template not found");
    
    const updatedTemplate = { ...template, ...updates };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.userId === userId && p.moduleId === moduleId);
  }

  async createOrUpdateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserModuleProgress(insertProgress.userId, insertProgress.moduleId);
    
    if (existing) {
      const updated = { 
        ...existing, 
        ...insertProgress,
        completedAt: insertProgress.completed ? new Date() : null 
      };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = {
        ...insertProgress,
        id,
        completed: insertProgress.completed || false,
        progress: insertProgress.progress || 0,
        completedAt: insertProgress.completed ? new Date() : null,
        createdAt: new Date(),
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }

  // Activity methods
  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      ...insertActivity,
      id,
      description: insertActivity.description || null,
      income: insertActivity.income || null,
      date: new Date(),
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getUserStats(userId: number): Promise<{
    totalHours: number;
    totalIncome: number;
    thisMonthIncome: number;
    activeProjects: number;
  }> {
    const activities = await this.getUserActivities(userId);
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalHours = activities.reduce((sum, activity) => sum + parseFloat(activity.hours), 0);
    const totalIncome = activities.reduce((sum, activity) => {
      const income = activity.income;
      return sum + (income ? parseFloat(income) : 0);
    }, 0);
    const thisMonthIncome = activities
      .filter(activity => activity.date >= thisMonth)
      .reduce((sum, activity) => {
        const income = activity.income;
        return sum + (income ? parseFloat(income) : 0);
      }, 0);

    // Mock active projects count
    const activeProjects = 3;

    return {
      totalHours: Math.round(totalHours),
      totalIncome,
      thisMonthIncome,
      activeProjects,
    };
  }

  // Challenge methods
  async getUserChallengeProgress(userId: number): Promise<ChallengeProgress[]> {
    return Array.from(this.challengeProgress.values()).filter(cp => cp.userId === userId);
  }

  async updateChallengeProgress(userId: number, day: number, completed: boolean): Promise<ChallengeProgress> {
    const existing = Array.from(this.challengeProgress.values())
      .find(cp => cp.userId === userId && cp.day === day);
    
    if (existing) {
      const updated = { 
        ...existing, 
        completed,
        completedAt: completed ? new Date() : null 
      };
      this.challengeProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentChallengeId++;
      const progress: ChallengeProgress = {
        id,
        userId,
        day,
        completed,
        completedAt: completed ? new Date() : null,
        createdAt: new Date(),
      };
      this.challengeProgress.set(id, progress);
      return progress;
    }
  }
}

export const storage = new MemStorage();
