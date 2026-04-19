// ──────────────────────────────────────────────────────────
// src/context/ProvidersContext.jsx
// Real-time Firestore provider list + sorting/filtering
// ──────────────────────────────────────────────────────────
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { subscribeToProviders, seedIfEmpty } from '../services/firestoreService';
import { useAuth } from './AuthContext';

const ProvidersContext = createContext(null);

export function ProvidersProvider({ children }) {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [sortBy,    setSortBy]    = useState('distance');  // 'distance' | 'price' | 'availability'
  const [filterType, setFilterType] = useState('all');     // 'all' | 'Petrol' | 'Diesel' | 'LPG'
  const [searchQuery, setSearchQuery] = useState('');

  // Seed & subscribe on mount — only when user is authenticated
  useEffect(() => {
    if (!user) {
      setProviders([]);
      setLoading(false);
      return;
    }

    let unsub;
    (async () => {
      try {
        await seedIfEmpty();
      } catch (e) {
        console.warn('[FuelSync] Seeding failed (may already exist or permissions issue):', e.message);
      }
      unsub = subscribeToProviders((data) => {
        setProviders(data);
        setLoading(false);
      });
    })();
    return () => unsub?.();
  }, [user]);

  // Derived: filtered + sorted list (memoised for performance)
  const displayProviders = useMemo(() => {
    let list = [...providers];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    // Fuel type filter
    if (filterType !== 'all') {
      list = list.filter((p) => p.fuelTypes?.includes(filterType));
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'price') {
        const pa = a.pricePerLitre?.Petrol ?? a.lpgPricePerCylinder ?? Infinity;
        const pb = b.pricePerLitre?.Petrol ?? b.lpgPricePerCylinder ?? Infinity;
        return pa - pb;
      }
      if (sortBy === 'availability') {
        const stockA = Object.values(a.stock || {}).reduce((s, v) => s + v, 0);
        const stockB = Object.values(b.stock || {}).reduce((s, v) => s + v, 0);
        return stockB - stockA; // highest stock first
      }
      // default: distance
      return (a.distance ?? 999) - (b.distance ?? 999);
    });

    return list;
  }, [providers, sortBy, filterType, searchQuery]);

  const value = {
    providers,
    displayProviders,
    loading,
    sortBy,    setSortBy,
    filterType, setFilterType,
    searchQuery, setSearchQuery,
  };

  return (
    <ProvidersContext.Provider value={value}>
      {children}
    </ProvidersContext.Provider>
  );
}

export function useProviders() {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used within <ProvidersProvider>');
  return ctx;
}
