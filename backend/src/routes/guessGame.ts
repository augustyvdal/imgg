import express, { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";

const guessGameRouter = express.Router();

guessGameRouter.post("/", async (req: Request, res: Response) => {
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

        const { data: existing, error: fetchError } = await supabase
            .from("guess_game_history")
            .select("game_1, game_2, game_3, game_4, game_5, game_6, game_7, game_8, game_9, game_10")
            .eq("user_id", user.id)
            .eq("category", category)
            .maybeSingle();

        if (fetchError) throw fetchError;

        // Take the old scores if there are any, otherwise initialize an array of 10 zeros
        const oldScores = existing? [existing.game_1,existing.game_2,existing.game_3, existing.game_4,
            existing.game_5,existing.game_6,existing.game_7,existing.game_8,existing.game_9,
            existing.game_10,]: Array(10).fill(null);

        // Create new scores array with the latest score at the end and removes the first (oldest)
        const newScores = [...oldScores.slice(1), score]; 

        // Upsert the new scores into the database, meaning update if exists, insert if not
        const { error: upsertError } = await supabase.from("guess_game_history").upsert(
            [{user_id: user.id,
            username,
            category, 
            game_1: newScores[0], 
            game_2: newScores[1], 
            game_3: newScores[2], 
            game_4: newScores[3], 
            game_5: newScores[4],
            game_6: newScores[5], 
            game_7: newScores[6], 
            game_8: newScores[7], 
            game_9: newScores[8],
            game_10: newScores[9], created_at: new Date().toISOString(),},],{ onConflict: "user_id,category" }
        );

        if (upsertError) throw upsertError;
        res.status(200).json({ message: "Match history updated successfully" });
    } catch (err) {
        console.error("Error updating match history:", err);
        res.status(500).json({ error: "Failed to update match history" });
    }

});

guessGameRouter.get("/", async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const category = req.query.category as string;

        if (!authHeader) {
            return res.status(401).json({ error: "Missing Authorization header" });
        }

        const token = authHeader.replace("Bearer ", "").trim();
        const { data: userData, error: userError } = await supabase.auth.getUser(token);

        if (userError || !userData?.user) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        const user = userData.user;

        const { data, error } = await supabase
            .from("guess_game_history")
            .select("game_1, game_2, game_3, game_4, game_5, game_6, game_7, game_8, game_9, game_10")
            .eq("user_id", user.id)
            .eq("category", category)
            .maybeSingle();
        if (error) throw error;

        const scores = data
        ? [
            data.game_1,
            data.game_2,
            data.game_3,
            data.game_4,
            data.game_5,
            data.game_6,
            data.game_7,
            data.game_8,
            data.game_9,
            data.game_10,
            ]
        : Array(10).fill(null);

        res.json({ scores });
    } catch (err) {
        console.error("Error fetching match history:", err);
        res.status(500).json({ error: "Failed to fetch match history" });
    }  
});

export default guessGameRouter;
