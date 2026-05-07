import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login(email, password);
      else await signup(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-100">DSA Sheet</h1>
          <p className="mt-1 text-sm text-slate-400">
            {isLogin ? "Welcome back. Log in to resume your progress." : "Create an account to start tracking."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl border border-ink-700 p-1 text-sm">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={`rounded-lg px-3 py-2 transition ${isLogin ? "bg-accent text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className={`rounded-lg px-3 py-2 transition ${!isLogin ? "bg-accent text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Full name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                required
                minLength={2}
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? (isLogin ? "Logging in..." : "Creating...") : isLogin ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
