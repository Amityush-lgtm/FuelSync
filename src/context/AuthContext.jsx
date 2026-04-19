// ──────────────────────────────────────────────────────────
// src/context/AuthContext.jsx
// Global authentication state via React Context
// ──────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthChange, signUp, signIn, logOut } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const u = await signUp(name, email, password);
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const u = await signIn(email, password);
      setUser(u);
      return u;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await logOut();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = { user, loading, error, register, login, logout, clearError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
