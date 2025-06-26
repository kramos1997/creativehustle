import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  tier: text("tier").notNull().default("free"), // "free" | "premium" | "lifetime"
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  tier: text("tier").notNull().default("free"), // "free" | "premium"
  orderIndex: integer("order_index").notNull(),
  status: text("status").notNull().default("draft"), // "draft" | "published"
  estimatedMinutes: integer("estimated_minutes").notNull().default(15),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tier: text("tier").notNull().default("free"), // "free" | "premium"
  downloadUrl: text("download_url"),
  fileType: text("file_type").notNull().default("pdf"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  progress: integer("progress").notNull().default(0), // 0-100
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "client_work" | "practice" | "marketing" | "admin"
  hours: decimal("hours", { precision: 4, scale: 2 }).notNull(),
  income: decimal("income", { precision: 10, scale: 2 }).default("0"),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  day: integer("day").notNull(), // 1-7
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  tier: true,
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  content: true,
  tier: true,
  orderIndex: true,
  status: true,
  estimatedMinutes: true,
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  title: true,
  description: true,
  category: true,
  tier: true,
  downloadUrl: true,
  fileType: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  moduleId: true,
  completed: true,
  progress: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  hours: true,
  income: true,
  description: true,
});

export const insertChallengeProgressSchema = createInsertSchema(challengeProgress).pick({
  userId: true,
  day: true,
  completed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertChallengeProgress = z.infer<typeof insertChallengeProgressSchema>;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;
