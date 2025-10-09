import { supabase } from "./supabaseClient";

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error; 
  return (data as Profile) ?? null;
}

export async function updateMyProfile(updates: Partial<Pick<Profile, "username" | "avatar_url">>) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw error;
}

export async function uploadAvatar(file: File): Promise<{ path: string; publicUrl: string }> {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error("Not signed in");

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `avatars/${user.id}-${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase
    .storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${ext}`,
    });

  if (uploadErr) throw uploadErr;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = data.publicUrl;

  await updateMyProfile({ avatar_url: path });

  return { path, publicUrl };
}
