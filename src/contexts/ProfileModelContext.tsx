import React, { createContext, useContext, useEffect, useState } from "react";
import ProfileModel from "../models/ProfileModel";
import { useAuth } from "./AuthContext";

const ProfileModelCtx = createContext<any>(null);

export function ProfileModelProvider({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const [state, setState] = useState(ProfileModel.createInitialState());

    useEffect(() => {
        if (!loading) {
            if (user) {
                ProfileModel.init(state).then(setState);
            } else {
                setState(ProfileModel.createInitialState());
            }
        }
    }, [user, loading]);

    return (
        <ProfileModelCtx.Provider value={{ state, setState, model: ProfileModel }}>
            {children}
        </ProfileModelCtx.Provider>
    );
}

export function useProfileModel() {
    const ctx = useContext(ProfileModelCtx);
    if (!ctx) throw new Error("useProfileModel must be used within ProfileModelProvider");
    return ctx;
}
