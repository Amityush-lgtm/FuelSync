// ──────────────────────────────────────────────────────────
// src/components/ui/index.jsx
// Shared atomic UI components
// ──────────────────────────────────────────────────────────
import { Loader2 } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-fuel-500 ${className}`}
    />
  );
}

// ── Full-page loading screen ───────────────────────────────
export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-fuel-500/20 flex items-center justify-center">
          <Spinner size={28} />
        </div>
        <div className="absolute inset-0 rounded-full bg-fuel-500/5 animate-ping" />
      </div>
      <p className="text-slate-400 font-body text-sm">{message}</p>
    </div>
  );
}

// ── Error banner ───────────────────────────────────────────
export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in">
      <span className="text-red-400 mt-0.5">⚠</span>
      <p className="text-red-300 text-sm flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors ml-2"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="h-4 shimmer rounded-lg w-2/3" />
      <div className="h-3 shimmer rounded-lg w-1/2" />
      <div className="flex gap-2 mt-4">
        <div className="h-6 shimmer rounded-full w-20" />
        <div className="h-6 shimmer rounded-full w-20" />
      </div>
      <div className="h-10 shimmer rounded-xl mt-2" />
    </div>
  );
}

// ── Status badge mapper ────────────────────────────────────
const STATUS_STYLES = {
  pending:   'badge-yellow',
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-slate',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_STYLES[status] ?? 'badge-slate'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── Empty state ────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
        {Icon && <Icon size={28} className="text-slate-500" />}
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-slate-300">{title}</p>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {/* Panel */}
      <div
        className="relative w-full max-w-lg card shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="font-display text-xl font-bold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
