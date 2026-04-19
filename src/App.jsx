// ──────────────────────────────────────────────────────────
// src/App.jsx
// Root router configuration
// ──────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }      from './context/AuthContext';
import { ProvidersProvider } from './context/ProvidersContext';
import { BookingsProvider }  from './context/BookingsContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout      from './pages/AppLayout';
import LoginPage      from './pages/LoginPage';
import SignupPage     from './pages/SignupPage';
import DashboardPage  from './pages/DashboardPage';
import BookingsPage   from './pages/BookingsPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider wraps everything so auth state is globally accessible */}
      <AuthProvider>
        {/* ProvidersProvider & BookingsProvider only activate after auth is ready */}
        <ProvidersProvider>
          <BookingsProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/bookings"  element={<BookingsPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BookingsProvider>
        </ProvidersProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
