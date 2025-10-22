import express, { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";

const leaderboardRouter = express.Router();

/** GET /api/leaderboard */
leaderboardRouter.get("/", async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const category = req.query.category ? String(req.query.category) : null;

  try {
    // Build base query for Higher/Lower
    const hlBase = supabase
      .from("leaderboard")
      .select("id, username, score, category, created_at")
      .order("score", { ascending: false })
      .limit(limit);

    const hlQuery = category ? hlBase.eq("category", category) : hlBase;

    const { data: higherLowerRows, error: hlError } = await hlQuery;
    if (hlError) throw hlError;

    // Build base query for Sort Game
    const sortBase = supabase
      .from("sort_game_leaderboard")
      .select("id, username, round_streak, category, created_at")
      .order("round_streak", { ascending: false })
      .limit(limit);

    const sortQuery = category ? sortBase.eq("category", category) : sortBase;

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
  try {
    const { score, category } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
        return res.status(401).json({ error: "Unauthorized user" });
    }

    const user = userData.user;

    const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

    const username = profile?.username ?? "Anonymous";

    const { data: existing } = await supabase
    .from("leaderboard")
    .select("id, score")
    .eq("user_id", user.id)
    .eq("category", category ?? null)
    .maybeSingle();

    if (existing) {
      if (score > existing.score) {
        const { error: updateErr } = await supabase
          .from("leaderboard")
          .update({ score, username })
          .eq("id", existing.id);
        if (updateErr) throw updateErr;
      }
    } else {
      const { error: insertErr } = await supabase.from("leaderboard").insert({
        user_id: user.id,
        username,
        score,
        category: category ?? null,
      });
      if (insertErr) throw insertErr;
    }

    res.status(201).json({ message: "Score submitted successfully" });
  } catch (err) {
    console.error("Error submitting score:", err);
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default leaderboardRouter;
