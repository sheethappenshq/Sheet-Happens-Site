// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  blogPosts;
  gameScores;
  siteStats;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.blogPosts = /* @__PURE__ */ new Map();
    this.gameScores = [];
    this.siteStats = {
      id: randomUUID(),
      visitorCount: 1337,
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.initializeBlogPosts();
  }
  initializeBlogPosts() {
    const welcomePost = {
      id: randomUUID(),
      title: "Welcome to TomSpace '95!",
      content: "Welcome to my totally rad website! This is the future of the internet, dude! Check out the games section and don't forget to sign my guestbook!",
      author: "TomSpace Admin",
      createdAt: /* @__PURE__ */ new Date("1995-12-15"),
      updatedAt: /* @__PURE__ */ new Date("1995-12-15")
    };
    const techPost = {
      id: randomUUID(),
      title: "The Information Superhighway",
      content: "The World Wide Web is totally awesome! I'm using the latest HTML technologies to bring you this cutting-edge experience. Best viewed in Netscape Navigator!",
      author: "TomSpace Admin",
      createdAt: /* @__PURE__ */ new Date("1995-12-20"),
      updatedAt: /* @__PURE__ */ new Date("1995-12-20")
    };
    this.blogPosts.set(welcomePost.id, welcomePost);
    this.blogPosts.set(techPost.id, techPost);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Blog methods
  async getAllBlogPosts() {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async getBlogPost(id) {
    return this.blogPosts.get(id);
  }
  async createBlogPost(insertPost) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const post = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, post);
    return post;
  }
  async updateBlogPost(id, updateData) {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return void 0;
    const updatedPost = {
      ...existingPost,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  async deleteBlogPost(id) {
    return this.blogPosts.delete(id);
  }
  // Game score methods
  async getTopGameScores(game, limit = 10) {
    return this.gameScores.filter((score) => score.game === game).sort((a, b) => b.score - a.score).slice(0, limit);
  }
  async createGameScore(insertScore) {
    const id = randomUUID();
    const score = {
      id,
      playerName: insertScore.playerName,
      game: insertScore.game || "snake",
      score: insertScore.score,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.gameScores.push(score);
    return score;
  }
  // Site stats methods
  async getSiteStats() {
    return this.siteStats;
  }
  async incrementVisitorCount() {
    this.siteStats.visitorCount++;
    this.siteStats.lastUpdated = /* @__PURE__ */ new Date();
    return this.siteStats;
  }
  async updateSiteStats(updateData) {
    this.siteStats = {
      ...this.siteStats,
      ...updateData,
      lastUpdated: /* @__PURE__ */ new Date()
    };
    return this.siteStats;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("TomSpace Admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  game: text("game").notNull().default("snake"),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var siteStats = pgTable("site_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorCount: integer("visitor_count").notNull().default(1337),
  lastUpdated: timestamp("last_updated").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  createdAt: true
});
var insertSiteStatsSchema = createInsertSchema(siteStats).omit({
  id: true,
  lastUpdated: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/:id", async (req, res) => {
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
  app2.post("/api/blog", async (req, res) => {
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
  app2.put("/api/blog/:id", async (req, res) => {
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
  app2.delete("/api/blog/:id", async (req, res) => {
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
  app2.get("/api/scores/:game", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const scores = await storage.getTopGameScores(req.params.game, limit);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game scores" });
    }
  });
  app2.post("/api/scores", async (req, res) => {
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
  app2.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSiteStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site stats" });
    }
  });
  app2.post("/api/stats/visit", async (req, res) => {
    try {
      const stats = await storage.incrementVisitorCount();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to increment visitor count" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/Sheet-Happens-Site/",
  // 👈 important: GitHub repo name
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    // 👈 must match deploy.yml
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
