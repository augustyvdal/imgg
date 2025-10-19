import React, { createContext, useContext, useEffect, useMemo } from "react";
import { ProfileModel } from "../models/ProfileModel";
import { useAuth } from "./AuthContext";

const ProfileModelCtx = createContext<ProfileModel | null>(null);

export function ProfileModelProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const model = useMemo(() => new ProfileModel(), []);

  useEffect(() => {
    if (!loading) {
      if (user) model.init();  
      else {
        model.profile = null;
        model.avatarPublicUrl = null;
        model.error = null;
      }
    }
  }, [user, loading, model]);

  return <ProfileModelCtx.Provider value={model}>{children}</ProfileModelCtx.Provider>;
}

export function useProfileModel() {
  const ctx = useContext(ProfileModelCtx);
  if (!ctx) throw new Error("useProfileModel must be used within ProfileModelProvider");
  return ctx;
}
