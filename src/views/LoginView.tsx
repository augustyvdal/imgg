import React, { FormEvent } from "react";

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
  onEmailChange, onPasswordChange, onLogin, onSignup,
}: Props) {
  return (
    <div className="page-background">
      {success && (
        <div className="fixed top-[40%] left-1/2 -translate-x-1/2 z-50" role="status" aria-live="polite">
          <div className="rounded-lg bg-green-600 text-white px-4 py-2 shadow-md">{success}</div>
        </div>
      )}

      <div className="max-w-md mx-auto p-6">
        <h1 className="text-black dark:text-white text-2xl font-semibold mb-4">Sign in</h1>

        <form className="space-y-3" onSubmit={onLogin}>
          <input
            className="text-black dark:text-white w-full border rounded p-2"
            placeholder="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <input
            className="text-black dark:text-white w-full border rounded p-2"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white rounded p-2" disabled={loading}>
            Sign in
          </button>
        </form>

        <button className="w-full bg-blue-600 text-white rounded disabled:opacity-60 p-2 mt-3" onClick={onSignup} disabled={loading}>
          Create account
        </button>

        {err && <p className="text-red-600 mt-3">{err}</p>}
      </div>
    </div>
  );
}
