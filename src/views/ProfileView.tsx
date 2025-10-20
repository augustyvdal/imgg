// src/views/ProfileView.tsx
import React, { FormEvent } from "react";


type Props = {
  // identity / gating
  userEmail: string;

  // profile form
  username: string;
  onUsernameChange: (v: string) => void;
  saving: boolean;
  onSave: (e: FormEvent) => void;

  // avatar
  avatarUrl: string | null;
  uploading: boolean;
  onPickFile: (file: File | null) => void;

  // notifications
  err: string | null;
  ok: string | null;

  // match history
  category: "movie" | "tv";
  onCategoryChange: (c: "movie" | "tv") => void;
  loadingGames: boolean;
  games: number[];
  onRefresh: () => void;
};

export default function ProfileView({
  userEmail,
  username,
  onUsernameChange,
  saving,
  onSave,
  avatarUrl,
  uploading,
  onPickFile,
  err,
  ok,
  category,
  onCategoryChange,
  loadingGames,
  games,
  onRefresh,
}: Props) {
  return (
    <div className="page-background">
      <h1 className="text-black dark:text-white text-2xl font-semibold">Your Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl ?? "https://placehold.co/96x96?text=👤"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <label className="text-$primary_1 dark:text-$primary_1 cursor-pointer border rounded px-3 py-2">
          {uploading ? "Uploading..." : "Change avatar"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Profile form */}
      <form onSubmit={onSave} className="space-y-3">
        <div>
          <label className="text-black dark:text-white block text-sm mb-1">Email</label>
          <input
            className="bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-500 w-full border border-gray-400 dark:border-gray-600 rounded p-2"
            value={userEmail}
            disabled
          />
        </div>

        <div>
          <label className="text-black dark:text-white block text-sm mb-1">Username</label>
          <input
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 w-full border border-gray-700 dark:border-gray-400 rounded p-2 focus:outline-none focus:ring-2 focus:ring-$primary_1"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
          />
        </div>

        <button
          className="btn--default"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {err && <p className="text-red-600">{err}</p>}
      {ok && <p className="text-green-700">{ok}</p>}

      {/* Category + Refresh */}
      <div className="flex items-center gap-2 mb-4 w-full max-w-md py-6">
        <select
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 cursor-pointer rounded px-2 py-1 flex-1"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as "movie" | "tv")}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <button
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 cursor-pointer rounded px-2 py-1 flex-1"
          onClick={onRefresh}
          disabled={loadingGames}
        >
          {loadingGames ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Match history */}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
          {category === "movie" ? "Guess Movie Game History" : "Guess TV Shows Game History"}
        </h2>

        {loadingGames ? (
          <p className="text-gray-500">Loading games…</p>
        ) : games.length ? (
          <ol className="space-y-1">
            {games.map((score, i) => (
              <li
                key={`${i}-${score}`}
                className="p-2 border-b text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
              >
                Game {games.length - i} Score: {score}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 text-center">No games found for this category.</p>
        )}
      </div>
    </div>
  );
}
