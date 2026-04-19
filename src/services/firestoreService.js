// ──────────────────────────────────────────────────────────
// src/services/firestoreService.js
// All Firestore read/write operations for FuelSync.
// ──────────────────────────────────────────────────────────
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { MOCK_PROVIDERS, generateSlotsForProvider } from './mockData';

// ── Collection refs ───────────────────────────────────────
const col = (name) => collection(db, name);

// ── SEED (run once on first load if providers are empty) ──
export async function seedIfEmpty() {
  const snap = await getDocs(col('providers'));
  if (!snap.empty) return; // already seeded

  // Firestore writeBatch is limited to 500 operations per batch
  const batch = writeBatch(db);

  // Seed providers
  for (const p of MOCK_PROVIDERS) {
    // Convert Date objects to ISO strings for Firestore compatibility
    const providerData = { ...p };
    const ref = doc(db, 'providers', p.id);
    batch.set(ref, providerData);
  }

  // Seed slots for each provider
  for (const p of MOCK_PROVIDERS) {
    const slots = generateSlotsForProvider(p.id);
    for (const s of slots) {
      const ref = doc(db, 'slots', s.id);
      batch.set(ref, s);
    }
  }

  await batch.commit();
  console.log('[FuelSync] Firestore seeded with mock data.');
}

// ── PROVIDERS ─────────────────────────────────────────────

/**
 * Fetch all providers once.
 * Returns array sorted by distance by default.
 */
export async function getProviders() {
  const snap = await getDocs(col('providers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribe to real-time provider updates.
 * Returns unsubscribe function.
 */
export function subscribeToProviders(callback) {
  return onSnapshot(col('providers'), (snap) => {
    const providers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(providers);
  }, (error) => {
    console.error('[FuelSync] Providers subscription error:', error.message);
    callback([]);
  });
}

/**
 * Update a provider's stock (called after booking confirmed).
 */
export async function updateProviderStock(providerId, fuelType, delta) {
  const ref = doc(db, 'providers', providerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const newStock = {
    ...data.stock,
    [fuelType]: Math.max(0, (data.stock[fuelType] || 0) + delta),
  };
  await updateDoc(ref, { stock: newStock });
}

// ── SLOTS ─────────────────────────────────────────────────

/**
 * Get available slots for a given provider & date.
 */
export async function getAvailableSlots(providerId, date) {
  const q = query(
    col('slots'),
    where('providerId', '==', providerId),
    where('date', '==', date),
    where('available', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribe to slots for real-time availability display.
 */
export function subscribeToSlots(providerId, date, callback) {
  const q = query(
    col('slots'),
    where('providerId', '==', providerId),
    where('date', '==', date)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (error) => {
    console.error('[FuelSync] Slots subscription error:', error.message);
    callback([]);
  });
}

/**
 * Mark a slot as unavailable when booked.
 */
async function markSlotBooked(slotId) {
  const ref = doc(db, 'slots', slotId);
  await updateDoc(ref, { available: false, booked: 5 });
}

// ── BOOKINGS ──────────────────────────────────────────────

/**
 * Create a new booking.
 * @param {object} payload - { userId, providerId, providerName, slotId, date, time, fuelType, quantity, type, notes }
 */
export async function createBooking(payload) {
  const booking = {
    ...payload,
    status: 'pending',     // pending | confirmed | completed | cancelled
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(col('bookings'), booking);

  // Mark slot unavailable
  await markSlotBooked(payload.slotId);

  // Deduct stock – negative delta to reduce
  await updateProviderStock(payload.providerId, payload.fuelType, -payload.quantity);

  return { id: ref.id, ...booking };
}

/**
 * Subscribe to all bookings for a user (real-time).
 */
export function subscribeToUserBookings(userId, callback) {
  const q = query(
    col('bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (error) => {
    console.error('[FuelSync] Bookings subscription error:', error.message);
    // If index is missing, still return empty so UI doesn't hang
    callback([]);
  });
}

/**
 * Cancel a booking and restore the slot & stock.
 */
export async function cancelBooking(bookingId) {
  const ref = doc(db, 'bookings', bookingId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Booking not found');

  const data = snap.data();
  if (data.status === 'cancelled') throw new Error('Already cancelled');
  if (data.status === 'completed') throw new Error('Cannot cancel a completed booking');

  // Update booking status
  await updateDoc(ref, { status: 'cancelled', updatedAt: serverTimestamp() });

  // Restore slot availability
  const slotRef = doc(db, 'slots', data.slotId);
  await updateDoc(slotRef, { available: true, booked: 0 });

  // Restore stock
  await updateProviderStock(data.providerId, data.fuelType, data.quantity);
}

// ── USER PROFILE ──────────────────────────────────────────

export async function upsertUser(user) {
  const ref = doc(db, 'users', user.uid);
  await setDoc(
    ref,
    {
      uid:       user.uid,
      name:      user.displayName || '',
      email:     user.email,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
