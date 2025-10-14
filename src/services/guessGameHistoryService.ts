import { supabase } from "./supabaseClient";

export type MatchHistory = {
  user_id: string;
  username: string;
  category: string | null;
  game_1: number;
  game_2: number;
  game_3: number;
  game_4: number;
  game_5: number;
  game_6: number;
  game_7: number;
  game_8: number;
  game_9: number;
  game_10: number;
  updated_at: string;
};

// Submit new game score for the signed in user.
export async function submitMatchScore(score: number, category?: string) {
    if (score == null || Number.isNaN(score)) throw new Error("Invalid score");

    // Ensure user is signed in
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("You must be signed in to submit a score");

    // Fetch username from profiles
    const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

    const username = profile?.username ?? "Anonymous";

    // Fetch the current users match history for the category
    const { data: existing, error: fetchError } = await supabase
        .from("guess_game_history")
        .select(
        "game_1, game_2, game_3, game_4, game_5, game_6, game_7, game_8, game_9, game_10"
        )
        .eq("user_id", user.id)
        .eq("category", category)
        .maybeSingle();

    if (fetchError) throw fetchError;
    
    // Take the old scores if there are any, otherwise initialize an array of 10 zeros
    const oldScores = existing? [existing.game_1,existing.game_2,existing.game_3, existing.game_4,
        existing.game_5,existing.game_6,existing.game_7,existing.game_8,existing.game_9,
        existing.game_10,]: Array(10).fill(0);

    // Create new scores array with the latest score at the end and removes the first (oldest)
    const newScores = [...oldScores.slice(1), score]; 

    // Upsert the new scores into the database, meaning update if exists, insert if not
    const { error: upsertError } = await supabase.from("guess_game_history").upsert(
        [{user_id: user.id,username,
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
        game_10: newScores[9], updated_at: new Date().toISOString(),},],{ onConflict: "user_id,category" }
    );

    if (upsertError) throw upsertError;
}

// Get the match history for the signed in user.
export async function getMatchHistory(category?: string) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("You must be signed in to view match history");

    const { data, error } = await supabase
        .from("guess_game_history")
        .select("game_1, game_2, game_3, game_4, game_5, game_6, game_7, game_8, game_9, game_10")
        .eq("user_id", user.id)
        .eq("category", category)
        .single();

    if (error) throw error;

    return [data.game_1, data.game_2, data.game_3, data.game_4, data.game_5, data.game_6, data.game_7, data.game_8, data.game_9, data.game_10];
}