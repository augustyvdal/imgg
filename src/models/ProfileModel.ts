import { makeAutoObservable, runInAction } from "mobx";
import { supabase } from "../services/supabaseClient";
import { getMyProfile, updateMyProfile, uploadAvatar, type Profile } from "../services/profileService";

export class ProfileModel {

  profile: Profile | null = null;
  avatarPublicUrl: string | null = null;
  loadingProfile = false;
  saving = false;
  uploading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }


  async init() {
    this.error = null;
    this.loadingProfile = true;
    try {
      const p = await getMyProfile();
      const avatarPublicUrl = p?.avatar_url
        ? supabase.storage.from("avatars").getPublicUrl(p.avatar_url).data.publicUrl
        : null;

      runInAction(() => {
        this.profile = p;
        this.avatarPublicUrl = avatarPublicUrl;
      });
    } catch (e: any) {
      runInAction(() => (this.error = e.message));
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  }


  async setUsername(username: string | null) {
    this.saving = true;
    this.error = null;
    try {
      await updateMyProfile({ username });
      runInAction(() => {
        if (this.profile) this.profile.username = username;
      });
    } catch (e: any) {
      runInAction(() => (this.error = e.message));
    } finally {
      runInAction(() => (this.saving = false));
    }
  }


  async setAvatar(file: File) {
    this.uploading = true;
    this.error = null;
    try {
      const { publicUrl } = await uploadAvatar(file);
      runInAction(() => {
        this.avatarPublicUrl = publicUrl;
        if (this.profile) this.profile.avatar_url = this.profile.avatar_url ?? ""; // path is updated in service
      });
    } catch (e: any) {
      runInAction(() => (this.error = e.message));
    } finally {
      runInAction(() => (this.uploading = false));
    }
  }


  get displayName() {
    return this.profile?.username ?? null;
  }
}
