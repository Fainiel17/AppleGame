import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { eq, desc, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { scores, insertScoreSchema } from "../shared/schema";

const sql_client = neon(process.env.DATABASE_URL!);
const db = drizzle(sql_client);

export async function registerRoutes(app: Express): Promise<Server> {
  // Submit score
  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertScoreSchema.parse(req.body);
      const [newScore] = await db.insert(scores).values(scoreData).returning();
      res.json(newScore);
    } catch (error) {
      console.error("Error submitting score:", error);
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard/:period", async (req, res) => {
    try {
      const { period } = req.params;
      let dateFilter: any = undefined;
      
      const now = new Date();
      
      switch (period) {
        case "daily":
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          dateFilter = gte(scores.createdAt, today);
          break;
        case "weekly":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = gte(scores.createdAt, weekAgo);
          break;
        case "monthly":
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          dateFilter = gte(scores.createdAt, monthAgo);
          break;
        case "alltime":
          // No date filter for all-time
          break;
        default:
          return res.status(400).json({ error: "Invalid period" });
      }

      const query = db
        .select()
        .from(scores)
        .orderBy(desc(scores.score), desc(scores.createdAt))
        .limit(10);

      const results = dateFilter 
        ? await query.where(dateFilter)
        : await query;

      res.json(results);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
