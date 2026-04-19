// ──────────────────────────────────────────────────
// src/services/mockData.js
// Seed mock providers & slots used by firestoreService
// when seeding an empty Firestore database.
// ──────────────────────────────────────────────────

export const MOCK_PROVIDERS = [
  {
    id: 'prov-001',
    name: 'IndianOil – Whitefield',
    type: 'both',          // 'fuel' | 'lpg' | 'both'
    fuelTypes: ['Petrol', 'Diesel', 'LPG'],
    address: 'Whitefield Main Rd, Bengaluru',
    location: { lat: 12.9716, lng: 77.7480 },
    pricePerLitre: { Petrol: 103.5, Diesel: 89.6 },
    lpgPricePerCylinder: 920,
    stock: {
      Petrol: 2400,   // litres
      Diesel: 3100,
      LPG: 48,        // cylinders
    },
    rating: 4.3,
    distance: 1.2,    // km – will be recalculated client-side when geolocation is available
    openHours: '06:00 – 22:00',
    phone: '+91 80 2345 6789',
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prov-002',
    name: 'HP Petrol Bunk – Koramangala',
    type: 'fuel',
    fuelTypes: ['Petrol', 'Diesel'],
    address: '80 Feet Rd, Koramangala, Bengaluru',
    location: { lat: 12.9352, lng: 77.6245 },
    pricePerLitre: { Petrol: 101.8, Diesel: 88.2 },
    lpgPricePerCylinder: null,
    stock: { Petrol: 800, Diesel: 1600, LPG: 0 },
    rating: 4.6,
    distance: 3.4,
    openHours: '05:30 – 23:00',
    phone: '+91 80 4567 8901',
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prov-003',
    name: 'Bharat Gas Agency – JP Nagar',
    type: 'lpg',
    fuelTypes: ['LPG'],
    address: '15th Cross, JP Nagar Phase 2, Bengaluru',
    location: { lat: 12.9081, lng: 77.5940 },
    pricePerLitre: {},
    lpgPricePerCylinder: 905,
    stock: { Petrol: 0, Diesel: 0, LPG: 120 },
    rating: 4.1,
    distance: 5.8,
    openHours: '09:00 – 18:00',
    phone: '+91 80 6789 0123',
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prov-004',
    name: 'Speed Fuels – Electronic City',
    type: 'fuel',
    fuelTypes: ['Petrol', 'Diesel'],
    address: 'Electronic City Phase 1, Bengaluru',
    location: { lat: 12.8458, lng: 77.6685 },
    pricePerLitre: { Petrol: 102.4, Diesel: 89.0 },
    lpgPricePerCylinder: null,
    stock: { Petrol: 50, Diesel: 200, LPG: 0 },  // low stock
    rating: 3.8,
    distance: 8.1,
    openHours: '07:00 – 21:00',
    phone: '+91 80 9012 3456',
    verified: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prov-005',
    name: 'BPCL Madiwala',
    type: 'both',
    fuelTypes: ['Petrol', 'Diesel', 'LPG'],
    address: 'Madiwala Check Post, Bengaluru',
    location: { lat: 12.9196, lng: 77.6199 },
    pricePerLitre: { Petrol: 102.9, Diesel: 88.8 },
    lpgPricePerCylinder: 912,
    stock: { Petrol: 3200, Diesel: 4100, LPG: 80 },
    rating: 4.5,
    distance: 4.2,
    openHours: '24 Hours',
    phone: '+91 80 3456 7890',
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prov-006',
    name: 'Shell Station – MG Road',
    type: 'fuel',
    fuelTypes: ['Petrol', 'Diesel'],
    address: 'MG Road, Bengaluru',
    location: { lat: 12.9754, lng: 77.6072 },
    pricePerLitre: { Petrol: 105.2, Diesel: 91.3 },
    lpgPricePerCylinder: null,
    stock: { Petrol: 0, Diesel: 0, LPG: 0 },  // out of stock
    rating: 4.7,
    distance: 6.0,
    openHours: '06:00 – 22:00',
    phone: '+91 80 2222 3333',
    verified: true,
    createdAt: new Date().toISOString(),
  },
];

// Generate time slots for the next 3 days
export function generateSlotsForProvider(providerId) {
  const slots = [];
  const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];
  const today = new Date();

  for (let d = 0; d < 3; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    for (const time of times) {
      // Randomly mark some slots as unavailable
      const available = Math.random() > 0.3;
      slots.push({
        id: `${providerId}-${dateStr}-${time.replace(':', '')}`,
        providerId,
        date: dateStr,
        time,
        available,
        capacity: 5,
        booked: available ? Math.floor(Math.random() * 3) : 5,
      });
    }
  }
  return slots;
}

export const FUEL_TYPE_COLORS = {
  Petrol: 'text-fuel-400',
  Diesel: 'text-blue-400',
  LPG:    'text-emerald-400',
};

export const STOCK_STATUS = (stock) => {
  if (stock === 0)     return { label: 'Out of Stock', cls: 'badge-red' };
  if (stock < 200)     return { label: 'Low Stock',   cls: 'badge-yellow' };
  return                       { label: 'Available',   cls: 'badge-green' };
};
