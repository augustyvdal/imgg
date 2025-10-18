import { getTopScores, type LeaderboardRow } from "../services/leaderboardService";
import { getSortLeaderboard, type SortRow } from "../services/sortGameLeaderboardService";

export interface LeaderboardData {
  higherLowerRows: LeaderboardRow[];
  sortRows: SortRow[];
}

export async function fetchLeaderboardData(
  limit: number,
  category?: string
): Promise<LeaderboardData> {
  const higherLowerRows = await getTopScores(limit, category);
  const sortRows = await getSortLeaderboard(limit, category);
  return { higherLowerRows, sortRows };
}
