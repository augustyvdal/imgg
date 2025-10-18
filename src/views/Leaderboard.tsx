// Displays leaderboard scores.
// Uses ScoreService to fetch data, Chart.js/D3 to visualize.
import { useEffect, useState } from "react";
import { getTopScores, type LeaderboardRow } from "../services/leaderboardService";
import { getSortLeaderboard, type SortRow } from "../services/sortGameLeaderboardService";

export default function LeaderboardPage() {
  const [higherLowerRows, setHigherLowerRows] = useState<LeaderboardRow[]>([]);
  const [sortRows, setSortRows] = useState<SortRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined); // 'movie' | 'tv' | undefined

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const higherLowerData = await getTopScores(20, category);
      setHigherLowerRows(higherLowerData);
      const sortData = await getSortLeaderboard(20, category);
      setSortRows(sortData);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [category]);

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-black dark:text-white text-2xl font-semibold">Leaderboards</h1>
          <div className="flex gap-2">
            <select
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || undefined)}
            >
              <option value="">All Categories</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
            <button className="bg-white dark:bg-gray-800 text-gray-800 cursor-pointer dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1" onClick={load} disabled={loading}>
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {err && <p className="text-red-600 mb-3">{err}</p>}

        <div className="flex flex-col items-center">
          <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">Higher or Lower</h2>
          <ol className="space-y-2">
          {higherLowerRows.map((r, i) => (
              <li
              key={r.id}
              className="p-2 border-b text-gray-800 dark:text-gray-300"
              >
              <span>
                  <strong>Score: {r.score}</strong>{" "}
                  {r.username || "Anonymous"}{" "}
                  {new Date(r.created_at).toLocaleDateString()}{" "}
                  {r.category
                  ? r.category === "movie"
                      ? "Movies"
                      : "TV Shows"
                  : ""}
              </span>
              </li>
          ))}

          {!loading && higherLowerRows.length === 0 && (
              <p className="text-gray-500 text-center">No scores yet.</p>
          )}
          </ol>
        </div>
         
        <div className="flex flex-col items-center">
          <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">Sort Game</h2>
          <ol className="space-y-2">
            {sortRows.map((row, i) => (
              <li key={row.id} className="p-2 border-b text-gray-800 dark:text-gray-300">
                <span>
                  <strong>Round Streak: {row.round_streak}</strong>{" "}
                  {row.username || "Anonymous"}{" "}
                  {new Date(row.created_at).toLocaleDateString()}{" "}
                  {row.category ? (row.category === "movie" ? "Movies" : "TV Shows") : ""}
                </span>
              </li>
            ))}
            {!loading && sortRows.length === 0 && (
              <p className="text-gray-500 text-center">No scores yet.</p>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
