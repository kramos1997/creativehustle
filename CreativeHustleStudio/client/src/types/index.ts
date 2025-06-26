export interface UserStats {
  totalHours: number;
  totalIncome: number;
  thisMonthIncome: number;
  activeProjects: number;
}

export interface DashboardData {
  user: any;
  modules: any[];
  progress: any[];
  templates: any[];
  activities: any[];
  stats: UserStats;
  challengeProgress: any[];
}

export type ActivityType = "client_work" | "practice" | "marketing" | "admin";

export interface ActivityForm {
  type: ActivityType;
  hours: number;
  income: number;
  description?: string;
}
