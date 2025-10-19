import React, { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginView from "../views/LoginView";
import {supabase} from "../services/supabaseClient";
import type {User} from "@supabase/supabase-js";

export default function LoginPresenter() {
    const { loading } = useAuth() as any;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation() as any;
    const from = (location.state as any)?.from?.pathname || "/";

    const onLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await signIn(email, password);
            setSuccess("You are now logged in.");
            setTimeout(() => navigate(from, { replace: true }), 1300);
        } catch (e: any) {
            setErr(e.message);
        }
    };

    const onSignup = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await signUp(email, password);
            setSuccess("Account created! Check your email for a confirmation link.");
            console.log(email, password);
        } catch (e: any) {
            setErr(e.message);
        }
    };

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    }

    async function signUp(email: string, password: string) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    }
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async function getCurrentUser(): Promise<User | null> {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user ?? null;
    }

    return (
        <LoginView
            email={email}
            password={password}
            loading={loading}
            err={err}
            success={success}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onLogin={onLogin}
            onSignup={onSignup}
        />
    );
}
