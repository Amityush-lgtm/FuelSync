// ──────────────────────────────────────────────────────────
// src/components/Navbar.jsx
// Top navigation bar with user menu
// ──────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Fuel, LayoutDashboard, ClipboardList, LogOut,
  Menu, X, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/bookings',  label: 'My Bookings', Icon: ClipboardList  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-fuel-500 flex items-center justify-center shadow-lg shadow-fuel-500/30 group-hover:bg-fuel-600 transition-colors">
              <Fuel size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-100">
              Fuel<span className="text-fuel-500">Sync</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-fuel-500/10 border border-fuel-500/20 text-fuel-400 text-[10px] font-mono font-semibold">
              <Zap size={9} />LIVE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-fuel-500/10 text-fuel-400 border border-fuel-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right: user + logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="w-7 h-7 rounded-lg bg-fuel-500/20 text-fuel-400 text-xs font-bold font-display flex items-center justify-center">
                {initials}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200 leading-none">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2 animate-slide-up">
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-fuel-500/10 text-fuel-400'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
