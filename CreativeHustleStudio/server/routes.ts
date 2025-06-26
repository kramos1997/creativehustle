import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertActivitySchema, insertUserProgressSchema, insertChallengeProgressSchema } from "@shared/schema";

// Initialize Stripe with secret key
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock authentication middleware
  app.use((req, res, next) => {
    // Mock user authentication - in production, use proper auth
    (req as any).user = { id: 1 }; // Default to user ID 1
    (req as any).isAuthenticated = () => true;
    next();
  });

  // Get current user
  app.get("/api/user", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get modules
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user progress
  app.get("/api/progress", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update progress
  app.post("/api/progress", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const data = insertUserProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.createOrUpdateProgress(data);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user activities
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const activities = await storage.getUserActivities(userId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create activity
  app.post("/api/activities", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const data = insertActivitySchema.parse({ ...req.body, userId });
      const activity = await storage.createActivity(data);
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get challenge progress
  app.get("/api/challenge", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const progress = await storage.getUserChallengeProgress(userId);
      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update challenge progress
  app.post("/api/challenge", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { day, completed } = req.body;
      const progress = await storage.updateChallengeProgress(userId, day, completed);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Mock Stripe payment intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!stripe) {
        // Mock response for development
        res.json({ 
          clientSecret: "pi_mock_client_secret_for_demo",
          amount: amount * 100 
        });
        return;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Mock subscription creation
  app.post('/api/create-subscription', async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!stripe) {
        // Mock response for development
        res.json({ 
          clientSecret: "seti_mock_client_secret_for_demo",
          subscriptionId: "sub_mock_subscription_id"
        });
        return;
      }

      // Real Stripe implementation would go here
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_default',
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Upgrade user to premium
  app.post("/api/upgrade", async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { tier } = req.body;
      const user = await storage.updateUserTier(userId, tier);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
