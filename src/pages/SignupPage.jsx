// ──────────────────────────────────────────────────────────
// src/pages/SignupPage.jsx
// New user registration
// ──────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner, ErrorBanner } from '../components/ui';

export default function SignupPage() {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [busy,     setBusy]     = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (password.length < 6) return;
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch {
      // handled by context
    } finally {
      setBusy(false);
    }
  }, [register, name, email, password, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern flex items-center justify-center p-4">
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
            Create your account to start booking
          </p>
        </div>

        <div className="card p-6 shadow-2xl shadow-black/40">
          <h2 className="font-display text-xl font-bold text-slate-100 mb-6">
            Create Account
          </h2>

          <ErrorBanner message={error} onDismiss={clearError} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="input pl-10"
                />
              </div>
            </div>

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
              <label className="label" htmlFor="password">
                Password
                <span className="text-slate-600 font-normal ml-1">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle visibility"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full mt-2"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size={16} /> Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-fuel-400 hover:text-fuel-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
