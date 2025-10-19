import { supabase } from "../services/supabaseClient";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import type { User } from "@supabase/supabase-js";

export class LoginModel {

    async signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }


    async signUp(email: string, password: string) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    }


    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }


    async getCurrentUser(): Promise<User | null> {
        const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
        return data.user ?? null;
    }


    getMyProfile = getMyProfile;
    updateMyProfile = updateMyProfile;
}
