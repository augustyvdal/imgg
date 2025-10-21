import express, { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";

const leaderboardRouter = express.Router();

/** GET /api/leaderboard */
leaderboardRouter.get("/", async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const category = req.query.category ? String(req.query.category) : null;

  try {
    // Build base query for Higher/Lower
    let hlQuery = supabase
      .from("leaderboard")
      .select("id, username, score, category, created_at")
      .order("score", { ascending: false })
      .limit(limit);

    if (category) hlQuery = hlQuery.eq("category", category);

    const { data: higherLowerRows, error: hlError } = await hlQuery;
    if (hlError) throw hlError;

    // Build base query for Sort Game
    let sortQuery = supabase
      .from("sort_game_leaderboard")
      .select("id, username, round_streak, category, created_at")
      .order("round_streak", { ascending: false })
      .limit(limit);

    if (category) sortQuery = sortQuery.eq("category", category);

    const { data: sortRows, error: sortError } = await sortQuery;
    if (sortError) throw sortError;

    res.json({ higherLowerRows, sortRows });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

/** POST /api/leaderboard */
leaderboardRouter.post("/", async (req: Request, res: Response) => {
  const { username, score, category } = req.body;

  if (!username || typeof score !== "number") {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const { error } = await supabase.from("leaderboard").insert([
      {
        username,
        score,
        category: category ?? null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Score submitted successfully" });
  } catch (err) {
    console.error("Error submitting score:", err);
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default leaderboardRouter;
