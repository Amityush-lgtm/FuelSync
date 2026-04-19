// ──────────────────────────────────────────────────────────
// src/pages/AppLayout.jsx
// Shell layout: Navbar + page outlet
// ──────────────────────────────────────────────────────────
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
