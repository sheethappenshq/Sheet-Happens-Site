import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("TomSpace Admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  game: text("game").notNull().default("snake"),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteStats = pgTable("site_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorCount: integer("visitor_count").notNull().default(1337),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  createdAt: true,
});

export const insertSiteStatsSchema = createInsertSchema(siteStats).omit({
  id: true,
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type SiteStats = typeof siteStats.$inferSelect;
export type InsertSiteStats = z.infer<typeof insertSiteStatsSchema>;
