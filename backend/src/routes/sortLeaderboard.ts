import express, { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";

const sortLeaderboardRouter = express.Router();

/** POST /api/sortLeaderboard */
sortLeaderboardRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { round_streak, category } = req.body;
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

    // Fetch the current users match history for the category
    const { data: existing, error: fetchError } = await supabase
        .from("sort_game_leaderboard")
        .select("round_streak")
        .eq("user_id", user.id)
        .eq("category", category)
        .maybeSingle();

    if (fetchError) throw fetchError;

    // Check if there is an existing row.
    if (existing) {
        // Update if new round streak is higher
        if (round_streak > existing.round_streak) {
            const { error: updateError } = await supabase
                .from("sort_game_leaderboard")
                .update({round_streak, username})
                .eq("user_id", user.id)
                .eq("category", category);
            if (updateError) throw updateError;
        }
    } else {
        // Insert new row
        const { error: insertError } = await supabase
            .from("sort_game_leaderboard")
            .insert([
                {
                    user_id: user.id,
                    username,
                    category,
                    round_streak,
                    created_at: new Date().toISOString(),
                },
            ]);

        if (insertError) throw insertError;
    }

    res.status(201).json({ message: "Score submitted successfully" });
  } catch (err) {
    console.error("Error submitting score:", err);
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default sortLeaderboardRouter;