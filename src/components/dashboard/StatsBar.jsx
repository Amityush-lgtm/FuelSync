// ──────────────────────────────────────────────────────────
// src/components/dashboard/StatsBar.jsx
// Summary stats strip at top of dashboard
// ──────────────────────────────────────────────────────────
import { useMemo } from 'react';
import { Fuel, Activity, TrendingDown, MapPin } from 'lucide-react';
import { useProviders } from '../../context/ProvidersContext';
import { useBookings } from '../../context/BookingsContext';

export default function StatsBar() {
  const { providers } = useProviders();
  const { bookings }  = useBookings();

  const stats = useMemo(() => {
    const available = providers.filter((p) =>
      Object.values(p.stock || {}).some((s) => s > 0)
    ).length;

    const avgPetrol = providers
      .filter((p) => p.pricePerLitre?.Petrol)
      .reduce((sum, p, _, arr) => sum + p.pricePerLitre.Petrol / arr.length, 0);

    const activeBookings = bookings.filter(
      (b) => b.status === 'pending' || b.status === 'confirmed'
    ).length;

    return { available, total: providers.length, avgPetrol, activeBookings };
  }, [providers, bookings]);

  const TILES = [
    {
      Icon: Activity,
      label: 'Available Providers',
      value: `${stats.available} / ${stats.total}`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      Icon: TrendingDown,
      label: 'Avg Petrol Price',
      value: stats.avgPetrol ? `₹${stats.avgPetrol.toFixed(1)}/L` : '—',
      color: 'text-fuel-400',
      bg: 'bg-fuel-500/10 border-fuel-500/20',
    },
    {
      Icon: Fuel,
      label: 'Active Bookings',
      value: stats.activeBookings,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      Icon: MapPin,
      label: 'Nearest Provider',
      value: providers.length
        ? `${Math.min(...providers.map((p) => p.distance ?? 99)).toFixed(1)} km`
        : '—',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {TILES.map(({ Icon, label, value, color, bg }) => (
        <div key={label} className={`card border p-4 flex items-center gap-3 ${bg}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className="text-xs text-slate-500 leading-none">{label}</p>
            <p className={`font-display font-bold text-lg leading-tight mt-0.5 ${color}`}>
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
