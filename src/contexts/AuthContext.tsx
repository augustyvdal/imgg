import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import Spinner from "../components/Spinner";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    transitioning: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setTransitioning(true);
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setTransitioning(true);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setTransitioning(true);
        if (error) throw error;
    };

    // Hide transition spinner a bit later (after rerender)
    useEffect(() => {
        if (transitioning && user) {
            const timer = setTimeout(() => setTransitioning(false), 1200);
            return () => clearTimeout(timer);
        }
    }, [transitioning, user]);

    // Show transition spinner after login
    if (transitioning) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-col3/90 z-50">
                <Spinner />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{user, session, loading, transitioning, signUp, signIn, signOut,}}>
            {children}
        </AuthContext.Provider>
    );
}
