// Login/Signup screen.
// Uses AuthContext (and AuthService) to handle login.
// Redirects to GameSelector after login.
import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, signUp, loading } = useAuth() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = (location.state as any)?.from?.pathname || "/";

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try { 
        await signIn(email, password); 
        navigate(from, { replace: true });
    } catch (e: any) { setErr(e.message); }
  };
  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try { await signUp(email, password); } catch (e: any) { setErr(e.message); }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 min-h-screen flex flex-col place-items-center-safe justify-center">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-black dark:text-white text-2xl font-semibold mb-4">Sign in</h1>

        <form className="space-y-3" onSubmit={onLogin}>
          <input
            className="text-black dark:text-white w-full border rounded p-2"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="text-black dark:text-white w-full border rounded p-2"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
