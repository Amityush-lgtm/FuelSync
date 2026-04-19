// ──────────────────────────────────────────────────────────
// src/components/dashboard/ProviderCard.jsx
// Displays a single fuel/LPG provider with stock status
// ──────────────────────────────────────────────────────────
import { useMemo, memo } from 'react';
import { MapPin, Star, Phone, Clock, TrendingUp, Zap } from 'lucide-react';
import { STOCK_STATUS } from '../../services/mockData';

const FUEL_PILL_COLORS = {
  Petrol:  'bg-fuel-500/10   text-fuel-400   border-fuel-500/20',
  Diesel:  'bg-blue-500/10   text-blue-400   border-blue-500/20',
  LPG:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

function ProviderCard({ provider, onBook }) {
  // Derive primary stock status for the card header
  const primaryStock = useMemo(() => {
    const totalStock = Object.values(provider.stock || {}).reduce((a, b) => a + b, 0);
    return STOCK_STATUS(totalStock);
  }, [provider.stock]);

  const priceDisplay = useMemo(() => {
    if (provider.type === 'lpg') return `₹${provider.lpgPricePerCylinder}/cylinder`;
    const p = provider.pricePerLitre?.Petrol;
    return p ? `from ₹${p}/L` : '—';
  }, [provider]);

  // Determine if all stock is zero (out of stock)
  const totalStock = Object.values(provider.stock || {}).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock === 0;

  return (
    <div
      className={`card p-5 flex flex-col gap-4 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-black/20 animate-fade-in ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-slate-100 text-base leading-tight truncate">
              {provider.name}
            </h3>
            {provider.verified && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-fuel-400 bg-fuel-500/10 border border-fuel-500/20 px-1.5 py-0.5 rounded-full">
                <Zap size={9} /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs">
            <MapPin size={11} />
            <span className="truncate">{provider.address}</span>
          </div>
        </div>
        <span className={`badge shrink-0 ${primaryStock.cls}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {primaryStock.label}
        </span>
      </div>

      {/* Fuel types + stock */}
      <div className="flex flex-wrap gap-2">
        {provider.fuelTypes?.map((ft) => {
          const stock = provider.stock?.[ft] ?? 0;
          const status = STOCK_STATUS(stock);
          return (
            <div
              key={ft}
              className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1 text-xs font-medium ${FUEL_PILL_COLORS[ft]}`}
            >
              {ft}
              <span className={`text-[10px] opacity-70 ${status.cls.replace('badge-','')} `}>
                · {ft === 'LPG' ? `${stock} cyl` : `${stock}L`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            {provider.rating}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {provider.distance} km
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {provider.openHours}
          </span>
        </div>
        <span className="font-mono font-semibold text-slate-300 text-sm">
          {priceDisplay}
        </span>
      </div>

      {/* Price breakdown (optional hover reveal) */}
      {provider.pricePerLitre && Object.keys(provider.pricePerLitre).length > 0 && (
        <div className="flex items-center gap-4 bg-slate-800/40 rounded-xl px-3 py-2 text-xs">
          {Object.entries(provider.pricePerLitre).map(([type, price]) => (
            <div key={type} className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-slate-500" />
              <span className="text-slate-400">{type}:</span>
              <span className="font-mono font-semibold text-slate-200">₹{price}</span>
            </div>
          ))}
          {provider.lpgPricePerCylinder && (
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-slate-500" />
              <span className="text-slate-400">LPG:</span>
              <span className="font-mono font-semibold text-slate-200">₹{provider.lpgPricePerCylinder}</span>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => onBook(provider)}
        disabled={isOutOfStock}
        className="btn-primary w-full mt-auto text-sm"
      >
        {isOutOfStock ? 'Out of Stock' : 'Book Slot'}
      </button>
    </div>
  );
}

// Memoize to avoid re-renders when other cards' data changes
export default memo(ProviderCard);
