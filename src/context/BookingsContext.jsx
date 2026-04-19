// ──────────────────────────────────────────────────────────
// src/context/BookingsContext.jsx
// Real-time user bookings + actions
// ──────────────────────────────────────────────────────────
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  subscribeToUserBookings,
  createBooking,
  cancelBooking,
} from '../services/firestoreService';
import { useAuth } from './AuthContext';

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error,    setError]    = useState(null);

  // Subscribe to real-time user bookings
  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToUserBookings(user.uid, (data) => {
      setBookings(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const book = useCallback(async (payload) => {
    if (!user) throw new Error('Must be logged in to book');
    setActionLoading(true);
    setError(null);
    try {
      const booking = await createBooking({ ...payload, userId: user.uid });
      return booking;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, [user]);

  const cancel = useCallback(async (bookingId) => {
    setActionLoading(true);
    setError(null);
    try {
      await cancelBooking(bookingId);
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <BookingsContext.Provider
      value={{ bookings, loading, actionLoading, error, book, cancel, clearError }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error('useBookings must be used within <BookingsProvider>');
  return ctx;
}
