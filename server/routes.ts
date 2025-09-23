import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/blog/:id", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid blog post data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Game score routes
  app.get("/api/scores/:game", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const scores = await storage.getTopGameScores(req.params.game, limit);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game scores" });
    }
  });

  app.post("/api/scores", async (req, res) => {
    try {
      const validatedData = insertGameScoreSchema.parse(req.body);
      const score = await storage.createGameScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid score data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save score" });
    }
  });

  // Site stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site stats" });
    }
  });

  app.post("/api/stats/visit", async (req, res) => {
    try {
      const stats = await storage.incrementVisitorCount();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to increment visitor count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
