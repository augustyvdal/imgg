import React, { FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  email: string;
  password: string;
  loading: boolean;
  err: string | null;
  success: string | null;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onLogin: (e: FormEvent) => void;
  onSignup: (e: FormEvent) => void;
};

export default function LoginView({
  email, password, loading, err, success,
  onEmailChange, onPasswordChange, onLogin, onSignup
}: Props) {
    const { transitioning } = useAuth();

    if (transitioning) return null;
  return (
    <div className="page-background">
      {success && (
        <div className="fixed top-[40%] left-1/2 -translate-x-1/2 z-50" role="status" aria-live="polite">
          <div className="rounded-lg bg-col2 text-white px-4 py-2 shadow-md">{success}</div>
        </div>
      )}

      <div className="max-w-md mx-auto p-6 gap-y-2 flex flex-col">
        <h1 className="text-black dark:text-white text-2xl font-semibold mb-4">Sign in</h1>

        <form className="space-y-3" onSubmit={onLogin}>
          <input
            className="text-black dark:text-white w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-col1"
            placeholder="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <input
            className="text-black dark:text-white w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-col1"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <button className="w-full btn--default" disabled={loading}>
            Sign in
          </button>
        </form>

        <button className="w-full btn--default" onClick={onSignup} disabled={loading}>
          Create account
        </button>

        {err && <p className="text-red-600 mt-3">{err}</p>}
      </div>
    </div>
  );
}
