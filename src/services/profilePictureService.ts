import { supabase } from "./supabaseClient";


export async function fetchAvatarUrl() {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
        throw new Error("User not logged in or token invalid");
    }

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch(`/api/profile`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    })

    if (!response.ok) {
        throw new Error(`Failed to save game score: ${response.statusText}`);
    }

    const prof = await response.json();

    const avatarPublicUrl = prof?.avatar_url
        ? supabase.storage.from("avatars").getPublicUrl(prof.avatar_url).data.publicUrl
        : null;

    return avatarPublicUrl;
}

    


