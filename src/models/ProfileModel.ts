import { supabase } from "../services/supabaseClient";
import { getMyProfile, updateMyProfile, uploadAvatar, type Profile } from "../services/profileService";

type ProfileModelState = {
    profile: Profile | null | undefined;
    avatarPublicUrl: string | null;
    loadingProfile: boolean;
    saving: boolean;
    uploading: boolean;
    error: string | null;
};

export default {
    createInitialState(): ProfileModelState {
        return {
            profile: null,
            avatarPublicUrl: null,
            loadingProfile: false,
            saving: false,
            uploading: false,
            error: null,
        };
    },

    async init(state: ProfileModelState): Promise<ProfileModelState> {
        try {
            const p = await getMyProfile();
            const avatarPublicUrl = p?.avatar_url
                ? supabase.storage.from("avatars").getPublicUrl(p.avatar_url).data.publicUrl
                : null;

            return {
                ...state,
                profile: p,
                avatarPublicUrl,
                loadingProfile: false,
                error: null,
            };
        } catch (e: any) {
            return {
                ...state,
                error: e.message ?? "Failed to load profile",
                loadingProfile: false,
            };
        }
    },

    async setUsername(state: ProfileModelState, username: string | null): Promise<ProfileModelState> {
        try {
            await updateMyProfile({ username });
            return {
                ...state,
                saving: false,
                error: null,
                profile: state.profile ? { ...state.profile, username } : state.profile,
            };
        } catch (e: any) {
            return {
                ...state,
                error: e.message ?? "Failed to update username",
                saving: false,
            };
        }
    },

    async setAvatar(state: ProfileModelState, file: File): Promise<ProfileModelState> {
        try {
            const { path, publicUrl } = await uploadAvatar(file);
            const updatedProfile = state.profile
                ? { ...state.profile, avatar_url: path }
                : state.profile;

            return {
                ...state,
                uploading: false,
                avatarPublicUrl: publicUrl,
                profile: updatedProfile,
                error: null,
            };
        } catch (e: any) {
            return {
                ...state,
                error: e.message ?? "Failed to upload avatar",
                uploading: false,
            };
        }
    },

    displayName(state: ProfileModelState): string | null {
        return state.profile?.username ?? null;
    },
};
