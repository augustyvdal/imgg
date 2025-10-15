// Displays leaderboard scores.
// Uses ScoreService to fetch data, Chart.js/D3 to visualize.
import { useEffect, useState } from "react";
import { getTopScores, type LeaderboardRow } from "../services/leaderboardService";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined); // 'movie' | 'tv' | undefined

  const load = async () => {
    setLoading(true); setErr(null);
    try {
      const data = await getTopScores(20, category);
      setRows(data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [category]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-black dark:text-white text-2xl font-semibold">Leaderboard</h1>
          <div className="flex gap-2">
            <select
              className="bg-white dark:bg-gray-900 text-black dark:text-white border rounded px-2 py-1"
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || undefined)}
            >
              <option value="">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV</option>
            </select>
            <button className="border rounded px-3 py-1" onClick={load} disabled={loading}>
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {err && <p className="text-red-600 mb-3">{err}</p>}

          <ol className="space-y-2">
          {rows.map((r, i) => (
              <li
              key={r.id}
              className="text-black dark:text-white p-2 border-b border-gray-400 flex justify-between"
              >
              <span>
                  <strong>Score {r.score}</strong>{" "}
                  {r.username || "Anonymous"}{" "}
                  {new Date(r.created_at).toLocaleDateString()}{" "}
                  {r.category
                  ? r.category === "movie"
                      ? "Movie"
                      : "Series"
                  : ""}
              </span>
              </li>
          ))}

          {!loading && rows.length === 0 && (
              <p className="text-gray-500 text-center">No scores yet.</p>
          )}
          </ol>
      </div>
    </div>
  );
}
