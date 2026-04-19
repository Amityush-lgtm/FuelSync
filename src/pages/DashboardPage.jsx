// ──────────────────────────────────────────────────────────
// src/pages/DashboardPage.jsx
// Main provider listing + booking entry point
// ──────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { Fuel, RefreshCw } from 'lucide-react';
import { useProviders } from '../context/ProvidersContext';
import ProviderCard from '../components/dashboard/ProviderCard';
import FilterBar from '../components/dashboard/FilterBar';
import StatsBar from '../components/dashboard/StatsBar';
import BookingModal from '../components/booking/BookingModal';
import { SkeletonCard, EmptyState } from '../components/ui';

export default function DashboardPage() {
  const { displayProviders, loading } = useProviders();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBook = useCallback((provider) => {
    setSelectedProvider(provider);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    // Keep selectedProvider in memory until animation ends
    setTimeout(() => setSelectedProvider(null), 300);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Fuel Providers</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time availability · Book your slot before it runs out
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live updates
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Filter + sort */}
      <FilterBar />

      {/* Provider grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayProviders.length === 0 ? (
        <EmptyState
          icon={Fuel}
          title="No providers found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProviders.map((p) => (
            <ProviderCard key={p.id} provider={p} onBook={handleBook} />
          ))}
        </div>
      )}

      {/* Booking modal */}
      <BookingModal
        provider={selectedProvider}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
