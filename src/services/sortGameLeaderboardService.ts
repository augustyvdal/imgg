import { supabase } from "./supabaseClient";

export type SortRow = {
  id: string;
  user_id: string | null;
  username: string | null;
  round_streak: number;
  category: string | null;
  created_at: string;
};
// Submit a round streak score for the current user. Requires the user to be signed in.
export async function submitSortStreak(round_streak: number, category?: string) {
    if (round_streak == null || Number.isNaN(round_streak)) throw new Error("Invalid round streak");

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
};

// Get top scores from the leaderboard, optionally filtered by category.
export async function getSortLeaderboard(limit = 20, category?: string) {
  const query = supabase
    .from("sort_game_leaderboard")
    .select("id, user_id, username, round_streak, category, created_at")
    .order("round_streak", { ascending: false })
    .limit(limit);

  const { data, error } = category
    ? await query.eq("category", category)
    : await query;

  if (error) throw error;

  return (data ?? []) as SortRow[];
}
