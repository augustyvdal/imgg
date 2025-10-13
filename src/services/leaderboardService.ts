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

  // Get current user
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userData.user;
  if (!user) throw new Error("You must be signed in to submit a score");

  // Try to get username from profiles table (optional, nice for display)
  let username: string | null = null;
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profileErr && profile) username = profile.username;

  // Insert the score
  const { error: insertErr } = await supabase.from("leaderboard").insert({
    user_id: user.id,
    username,
    score,
    category: category ?? null,
  });

  if (insertErr) throw insertErr;
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

  let query = supabase
    .from("leaderboard")
    .select("score,created_at,category")
    .eq("user_id", user.id)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data?.[0] ?? null;
}
