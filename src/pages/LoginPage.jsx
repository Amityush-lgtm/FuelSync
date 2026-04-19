// ──────────────────────────────────────────────────────────
// src/pages/LoginPage.jsx
// Email/password login + link to signup
// ──────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Fuel, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner, ErrorBanner } from '../components/ui';

export default function LoginPage() {
  const { login, error, clearError, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [busy,     setBusy]     = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // error handled by context
    } finally {
      setBusy(false);
    }
  }, [login, email, password, navigate, from]);

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuel-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-fuel-500 shadow-2xl shadow-fuel-500/40 mb-4">
            <Fuel size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">
            Fuel<span className="text-fuel-500">Sync</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Smart fuel booking during crisis situations
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-display text-xl font-bold text-slate-100 flex-1">
              Sign In
            </h2>
            <span className="badge badge-green">
              <Zap size={10} /> Live
            </span>
          </div>

          <ErrorBanner message={error} onDismiss={clearError} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || loading}
              className="btn-primary w-full mt-2"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size={16} /> Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <p className="text-[11px] text-slate-500 font-medium mb-1">
              🧪 Demo — create a free account below
            </p>
            <p className="text-[11px] text-slate-600">
              Or use any email you register on the signup page.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-fuel-400 hover:text-fuel-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
