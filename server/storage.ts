import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type GameScore, type InsertGameScore, type SiteStats, type InsertSiteStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  // Game score methods
  getTopGameScores(game: string, limit?: number): Promise<GameScore[]>;
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  
  // Site stats methods
  getSiteStats(): Promise<SiteStats>;
  incrementVisitorCount(): Promise<SiteStats>;
  updateSiteStats(stats: Partial<InsertSiteStats>): Promise<SiteStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private gameScores: GameScore[];
  private siteStats: SiteStats;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.gameScores = [];
    this.siteStats = {
      id: randomUUID(),
      visitorCount: 1337,
      lastUpdated: new Date()
    };
    
    // Initialize with some retro blog posts
    this.initializeBlogPosts();
  }

  private initializeBlogPosts() {
    const welcomePost: BlogPost = {
      id: randomUUID(),
      title: "Welcome to TomSpace '95!",
      content: "Welcome to my totally rad website! This is the future of the internet, dude! Check out the games section and don't forget to sign my guestbook!",
      author: "TomSpace Admin",
      createdAt: new Date('1995-12-15'),
      updatedAt: new Date('1995-12-15')
    };
    
    const techPost: BlogPost = {
      id: randomUUID(),
      title: "The Information Superhighway",
      content: "The World Wide Web is totally awesome! I'm using the latest HTML technologies to bring you this cutting-edge experience. Best viewed in Netscape Navigator!",
      author: "TomSpace Admin",
      createdAt: new Date('1995-12-20'),
      updatedAt: new Date('1995-12-20')
    };
    
    this.blogPosts.set(welcomePost.id, welcomePost);
    this.blogPosts.set(techPost.id, techPost);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...updateData,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Game score methods
  async getTopGameScores(game: string, limit: number = 10): Promise<GameScore[]> {
    return this.gameScores
      .filter(score => score.game === game)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = randomUUID();
    const score: GameScore = {
      id,
      playerName: insertScore.playerName,
      game: insertScore.game || "snake",
      score: insertScore.score,
      createdAt: new Date()
    };
    this.gameScores.push(score);
    return score;
  }
  
  // Site stats methods
  async getSiteStats(): Promise<SiteStats> {
    return this.siteStats;
  }

  async incrementVisitorCount(): Promise<SiteStats> {
    this.siteStats.visitorCount++;
    this.siteStats.lastUpdated = new Date();
    return this.siteStats;
  }

  async updateSiteStats(updateData: Partial<InsertSiteStats>): Promise<SiteStats> {
    this.siteStats = {
      ...this.siteStats,
      ...updateData,
      lastUpdated: new Date()
    };
    return this.siteStats;
  }
}

export const storage = new MemStorage();
