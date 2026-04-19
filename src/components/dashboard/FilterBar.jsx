// ──────────────────────────────────────────────────────────
// src/components/dashboard/FilterBar.jsx
// Sort + filter controls for the provider list
// ──────────────────────────────────────────────────────────
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useProviders } from '../../context/ProvidersContext';

const SORT_OPTIONS = [
  { value: 'distance',     label: 'Distance' },
  { value: 'price',        label: 'Price' },
  { value: 'availability', label: 'Stock' },
];

const FILTER_OPTIONS = [
  { value: 'all',    label: 'All Types' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'LPG',    label: 'LPG' },
];

export default function FilterBar() {
  const {
    sortBy, setSortBy,
    filterType, setFilterType,
    searchQuery, setSearchQuery,
    displayProviders,
  } = useProviders();

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search providers or areas…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Sort + Filter row */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Sort */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
          <ArrowUpDown size={14} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSortBy(o.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  sortBy === o.value
                    ? 'bg-fuel-500 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2">
          <SlidersHorizontal size={14} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <div className="flex gap-1">
            {FILTER_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setFilterType(o.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterType === o.value
                    ? 'bg-fuel-500 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <span className="ml-auto text-xs text-slate-500 font-medium">
          {displayProviders.length} provider{displayProviders.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
