import React, { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginView from "../views/LoginView";

export default function LoginPresenter() {
    const { loading, signIn, signUp } = useAuth() as any;
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
