// Handles storing and retrieving highscores from backend (Firebase/Supabase).
// Exports saveHighscore, getLeaderboard.
import { supabase } from "./supabaseClient";

export type LeaderboardRow = {
  id: string;
  user_id: string | null;
  username: string | null;
  score: number;
  category: string | null;
  created_at: string;
};

// Submit a score for the current user. Requires the user to be signed in.
export async function submitScore(score: number, category?: string) {
  if (score == null || Number.isNaN(score)) throw new Error("Invalid score");

  // Ensure user is signed in, if not do nothing
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) return;
  const user = userData.user;
  if (!user) return;

  // get username from profiles table if available
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const username: string | null = profile?.username ?? null;

  // check if user already has a score for this category
  const { data: existing } = await supabase
    .from("leaderboard")
    .select("id, score")
    .eq("user_id", user.id)
    .eq("category", category ?? null)
    .maybeSingle();

  if (existing) {
    // if new score is higher, update it
    if (score > existing.score) {
      const { error: updateErr } = await supabase
        .from("leaderboard")
        .update({ score, username })
        .eq("id", existing.id);
      if (updateErr) throw updateErr;
    }
  } else {
    // no existing score → insert a new one
    const { error: insertErr } = await supabase.from("leaderboard").insert({
      user_id: user.id,
      username,
      score,
      category: category ?? null,
    });
    if (insertErr) throw insertErr;
  }
}


// Only keep top score per user
export async function getTopScores(limit = 20, category?: string) {
  const { data, error } = await supabase.rpc("get_top_scores", {
    p_category: category ?? null,
    p_limit: limit,
  });
  if (error) throw error;
  return (data ?? []) as LeaderboardRow[];
}

/** (Optional) Get the current user's best score, optionally per category. */
export async function getMyBestScore(category?: string) {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userData.user;
  if (!user) return null;

  const query = category
    ? supabase
        .from("leaderboard")
        .select("id, username, score, category, created_at")
        .order("score", { ascending: false })
        .eq("category", category)
    : supabase
        .from("leaderboard")
        .select("id, username, score, category, created_at")
        .order("score", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data?.[0] ?? null;
}
