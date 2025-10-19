import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyProfile, updateMyProfile, uploadAvatar, type Profile } from "../services/profileService";
import { supabase } from "../services/supabaseClient";
import { getMatchHistory } from "../services/guessGameHistoryService";

export default function ProfilePage() {
  const { user, loading } = useAuth() as any;
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [category, setCategory] = useState<"movie" | "tv">("movie");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);


  useEffect(() => {
    (async () => {
      if (!user) return;
      const p = await getMyProfile();
      setProfile(p);
      setUsername(p?.username ?? "");
      if (p?.avatar_url) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(p.avatar_url);
        setAvatarUrl(data.publicUrl);
      }
    })().catch(e => setErr(e.message));
  }, [user]);

  const toReversed = <T,>(arr: readonly T[]) =>
  arr.map((_, i, a) => a[a.length - 1 - i]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoadingGames(true);
      setErr(null);
      try {
        const matchHistory = await getMatchHistory(category);
        setGames(matchHistory.filter((gameScore) => gameScore != null).toReversed());
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoadingGames(false);
      }
    })();
  }, [user, category]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setOk(null); setSaving(true);
    try {
      await updateMyProfile({ username: username || null });
      setOk("Profile saved!");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = async (file: File | null) => {
    if (!file) return;
    setErr(null); setOk(null); setUploading(true);
    try {
      const { publicUrl } = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
      setOk("Avatar updated!");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="page-background">
      <h1 className="text-black dark:text-white text-2xl font-semibold">Your Profile</h1>

      <div className="flex items-center gap-4">
        <img
          src={avatarUrl ?? "https://placehold.co/96x96?text=👤"}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <label className="text-red-700 dark:text-red-400 cursor-pointer border rounded px-3 py-2">
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

      <form onSubmit={onSave} className="space-y-3">
        <div>
          <label className="text-black dark:text-white block text-sm mb-1">Email</label>
          <input className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-500 w-full border rounded p-2" value={user.email} disabled/>
        </div>

        <div>
          <label className="text-black dark:text-white block text-sm mb-1">Username</label>
          <input
            className="text-gray-800 dark:text-gray-300 w-full border border-gray-700 dark:border-gray-400 rounded p-2"
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {err && <p className="text-red-600">{err}</p>}
      {ok && <p className="text-green-700">{ok}</p>}

      {/*Category select*/}
      <div className="flex items-center gap-2 mb-4 w-full max-w-md py-6">
        <select
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
          value={category}
          onChange={(e) => setCategory(e.target.value as "movie" | "tv")}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
        <button
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex-1"
          onClick={() => setCategory(category)}
          disabled={loadingGames}
        >
          {loadingGames ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/*Match history*/}
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
          {category === "movie" ? "Guess Movie Game History" : "Guess TV Shows Game History"}
        </h2>

        {loadingGames ? (
          <p className="text-gray-500">Loading games…</p>
        ) : games.length ? (
          <ol className="space-y-1">
            {games.map((gameScore, i) => (
              <li key={i} className="p-2 border-b text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                Game {games.length - i} Score: {gameScore}
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
