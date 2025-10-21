export interface LeaderboardRow {
  id: string;
  username: string | null;
  score?: number;
  round_streak?: number;
  category: string | null;
  created_at: string;
}

export interface LeaderboardData {
  higherLowerRows: LeaderboardRow[];
  sortRows: LeaderboardRow[];
}

export async function fetchLeaderboardData(
  limit = 20,
  category?: string
): Promise<LeaderboardData> {
  const query = new URLSearchParams();
  query.append("limit", String(limit));
  if (category) query.append("category", category);

  const response = await fetch(`/api/leaderboard?${query.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  const data = await response.json();

  // Expecting backend to return { higherLowerRows, sortRows }
  return {
    higherLowerRows: data.higherLowerRows ?? [],
    sortRows: data.sortRows ?? [],
  };
}
