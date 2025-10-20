import React from "react";
import type { LeaderboardRow } from "../services/leaderboardService";
import type { SortRow } from "../services/sortGameLeaderboardService";

interface Props {
  higherLowerRows: LeaderboardRow[];
  sortRows: SortRow[];
  loading: boolean;
  error: string | null;
  category?: string;
  onCategoryChange: (value?: string) => void;
  onReload: () => void;
  goToHome: () => void;
}

export default function LeaderboardView({ higherLowerRows, sortRows, loading, error, category, onCategoryChange, onReload, goToHome }: Readonly<Props>) {
  return (
    <div className="page-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <button className="btn--default absolute left-6" onClick={goToHome}>Main Menu</button>
          <h1 className="text-black dark:text-white text-2xl font-semibold">Leaderboards</h1>
          <div className="flex gap-2">
            <select
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 cursor-pointer rounded px-2 py-1 flex-1"
              value={category ?? ""}
              onChange={(e) => onCategoryChange(e.target.value || undefined)}
            >
              <option value="">All Categories</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
            <button
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 cursor-pointer rounded px-2 py-1 flex-1"
              onClick={onReload}
              disabled={loading}
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <LeaderboardSection title="Higher or Lower" loading={loading} rows={higherLowerRows} />
        <LeaderboardSection title="Sort Game" loading={loading} rows={sortRows} isSort />
      </div>
    </div>
  );
}

function LeaderboardSection({
  title,
  loading,
  rows,
  isSort = false,
}: {
  title: string;
  loading: boolean;
  rows: any[];
  isSort?: boolean;
}) {
  return (
    <div className="pt-20 flex flex-col items-center mb-6">
      <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">{title}</h2>
      <ol className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="p-2 border-b text-gray-800 dark:text-gray-300">
            <span>
              <strong>{isSort ? `Round Streak: ${r.round_streak}` : `Score: ${r.score}`}</strong>{" "}
              {r.username || "Anonymous"} {new Date(r.created_at).toLocaleDateString()}{" "}
              {r.category ? (r.category === "movie" ? "Movies" : "TV Shows") : ""}
            </span>
          </li>
        ))}
        {!loading && rows.length === 0 && (
          <p className="text-gray-500 text-center">No scores yet.</p>
        )}
      </ol>
    </div>
  );
}
