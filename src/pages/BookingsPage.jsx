// ──────────────────────────────────────────────────────────
// src/pages/BookingsPage.jsx
// View and manage all user bookings with status tabs
// ──────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookings } from '../context/BookingsContext';
import BookingCard from '../components/booking/BookingCard';
import { SkeletonCard, EmptyState } from '../components/ui';

const STATUS_TABS = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BookingsPage() {
  const { bookings, loading } = useBookings();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  // Count per tab for badge
  const counts = useMemo(() => {
    const c = {};
    for (const b of bookings) {
      c[b.status] = (c[b.status] ?? 0) + 1;
    }
    c.all = bookings.length;
    return c;
  }, [bookings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track and manage your fuel reservations
          </p>
        </div>
        <Link to="/dashboard" className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> New Booking
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === value
                ? 'bg-fuel-500/10 text-fuel-400 border border-fuel-500/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {label}
            {counts[value] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === value
                  ? 'bg-fuel-500 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
          description={
            activeTab === 'all'
              ? 'Head over to the dashboard to book your first fuel slot.'
              : `You have no ${activeTab} bookings at the moment.`
          }
          action={
            activeTab === 'all' && (
              <Link to="/dashboard" className="btn-primary text-sm">
                Browse Providers
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
