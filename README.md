# ⛽ FuelSync — Smart Fuel & LPG Booking Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-fuelsync--2b8ce.web.app-fuel?style=for-the-badge&logo=firebase)](https://fuelsync-2b8ce.web.app)

> A production-grade React web application that helps users discover, compare, and book fuel or LPG slots during crisis situations — with real-time Firestore updates.

---

## 🧠 Problem Statement

**Who is the user?** Daily commuters and households who rely on fuel and LPG gas cylinders.
**What problem are we solving?** During a fuel crisis, natural disaster, or supply chain shortage, panic buying empties petrol pumps and gas agencies unpredictably. Users waste hours travelling between stations to find fuel or LPG availability.
**Why does it matter?** FuelSync provides real-time visibility into local provider stocks. It allows users to book a guaranteed time slot, minimizing chaos at the pumps, preventing stock hoarding, and ensuring essential supply chain transparency.

---

## 📸 Feature Overview

| Feature | Details |
|---|---|
| 🔐 Auth | Firebase email/password · signup · login · logout · protected routes |
| 📍 Provider Discovery | List providers sorted by distance, price, or availability |
| 🔍 Filter | By fuel type (Petrol / Diesel / LPG) and free-text search |
| 📊 Real-time | Firestore `onSnapshot` for live provider stock & slot updates |
| 📅 Booking | 3-step modal: date & slot → details (type/qty) → confirm |
| 📋 Booking Management | View all bookings with status tabs · cancel pending/confirmed |
| 🗄️ Database | Firestore collections: users, providers, slots, bookings |
| 🎨 UI | Dark theme · Syne + DM Sans fonts · Tailwind · responsive |

---

## 🏗️ Folder Structure

```
fuelsync/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx     # Redirect unauthenticated users
│   │   ├── booking/
│   │   │   ├── BookingModal.jsx       # 3-step booking flow
│   │   │   └── BookingCard.jsx        # Single booking display + cancel
│   │   ├── dashboard/
│   │   │   ├── ProviderCard.jsx       # Provider tile with stock status
│   │   │   ├── FilterBar.jsx          # Search + sort + type filter
│   │   │   └── StatsBar.jsx           # Summary statistics strip
│   │   ├── ui/
│   │   │   └── index.jsx              # Spinner, Modal, ErrorBanner, etc.
│   │   └── Navbar.jsx                 # Sticky top nav
│   ├── context/
│   │   ├── AuthContext.jsx            # Firebase auth state
│   │   ├── ProvidersContext.jsx       # Real-time providers + filtering
│   │   └── BookingsContext.jsx        # Real-time user bookings + actions
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── BookingsPage.jsx
│   │   └── AppLayout.jsx              # Navbar shell
│   ├── services/
│   │   ├── firebase.js                # Firebase app init
│   │   ├── authService.js             # Auth helpers
│   │   ├── firestoreService.js        # All Firestore CRUD + subscriptions
│   │   └── mockData.js                # Seed data + slot generator
│   ├── App.jsx                        # Route configuration
│   ├── main.jsx                       # React entry point
│   └── index.css                      # Tailwind + global styles
├── firestore.rules                    # Paste into Firebase Console
├── .env.example                       # Environment variable template
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A Firebase project ([create one free](https://console.firebase.google.com))

---

### Step 1 — Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create project** (or use existing)
2. **Enable Authentication:**
   - Console → Authentication → Get Started
   - Sign-in Providers → Email/Password → **Enable**

3. **Enable Firestore:**
   - Console → Firestore Database → Create database
   - Choose **Start in test mode** (you'll add rules shortly)
   - Pick a region close to you (e.g., `asia-south1` for India)

4. **Get your config:**
   - Console → Project Settings (⚙️) → Your apps → Add app → Web
   - Copy the `firebaseConfig` object values

5. **Set Firestore security rules:**
   - Console → Firestore → Rules tab
   - Replace all content with the contents of `firestore.rules`
   - Click **Publish**

---

### Step 2 — Project Setup

```bash
# Clone or unzip the project
cd fuelsync

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` and fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

### Step 3 — Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

On first load, FuelSync automatically seeds Firestore with 6 mock providers and time slots for the next 3 days. This only runs once (guarded by a check for existing data).

---

### Step 4 — Build for Production

```bash
npm run build
npm run preview   # test the production build locally
```

Deploy the `dist/` folder to Vercel, Netlify, or Firebase Hosting.

---

## 🗄️ Firestore Data Model

### `providers/{id}`
```json
{
  "name": "IndianOil – Whitefield",
  "type": "both",
  "fuelTypes": ["Petrol", "Diesel", "LPG"],
  "address": "Whitefield Main Rd, Bengaluru",
  "location": { "lat": 12.9716, "lng": 77.748 },
  "pricePerLitre": { "Petrol": 103.5, "Diesel": 89.6 },
  "lpgPricePerCylinder": 920,
  "stock": { "Petrol": 2400, "Diesel": 3100, "LPG": 48 },
  "rating": 4.3,
  "distance": 1.2,
  "openHours": "06:00 – 22:00",
  "verified": true
}
```

### `slots/{id}`
```json
{
  "providerId": "prov-001",
  "date": "2026-04-20",
  "time": "09:30",
  "available": true,
  "capacity": 5,
  "booked": 1
}
```

### `bookings/{id}`
```json
{
  "userId": "user_uid",
  "providerId": "prov-001",
  "providerName": "IndianOil – Whitefield",
  "slotId": "prov-001-2026-04-20-0930",
  "date": "2026-04-20",
  "time": "09:30",
  "fuelType": "Petrol",
  "quantity": 10,
  "type": "fuel",
  "notes": "",
  "status": "pending",
  "createdAt": "<Timestamp>",
  "updatedAt": "<Timestamp>"
}
```

### `users/{uid}`
```json
{
  "uid": "firebase_uid",
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "updatedAt": "<Timestamp>"
}
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | React Context API + hooks |
| Backend | Firebase Firestore (real-time) |
| Auth | Firebase Authentication |
| Icons | Lucide React |
| Fonts | Syne (display) + DM Sans (body) |

---

## 🔧 Key Implementation Notes

- **Real-time updates**: `onSnapshot` listeners in `ProvidersContext` and `BookingsContext` keep UI in sync without polling.
- **Atomic booking**: `createBooking` in `firestoreService.js` writes the booking, marks the slot unavailable, and decrements stock — all in sequence.
- **Memoisation**: `displayProviders` in `ProvidersContext` is wrapped in `useMemo`; `ProviderCard` and `BookingCard` use `memo()` to skip unnecessary re-renders.
- **Seeding**: `seedIfEmpty()` is called once on mount — it checks if providers exist before writing, so it's safe to run on every app boot.
- **Error boundaries**: Auth and booking errors surface via context state and are displayed via `ErrorBanner` components.

---

## 🔮 Future Enhancements

- [ ] Google Maps integration for live distance calculation
- [ ] Razorpay / UPI payment integration
- [ ] Push notifications via Firebase Cloud Messaging
- [ ] Admin panel for providers to update stock
- [ ] AI demand prediction (price-rise alerts)
- [ ] Community reporting (queue length, availability crowd-source)
