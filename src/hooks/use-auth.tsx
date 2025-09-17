"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Mock User type to avoid Firebase dependency for this simple auth
interface MockUser {
  uid: string;
  email: string;
}

interface AuthContextType {
  currentUser: MockUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials
const ADMIN_EMAIL = 'nesttrend30@gmail.com';
const ADMIN_PASSWORD = 'nesttrend@2025';
const LOGGED_IN_STATE_KEY = 'ttrend-nest-admin-logged-in';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem(LOGGED_IN_STATE_KEY);
      if (isLoggedIn === 'true') {
        setCurrentUser({ uid: 'admin', email: ADMIN_EMAIL });
      }
    } catch (e) {
      console.error("Could not access localStorage", e)
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user: MockUser = { uid: 'admin', email: ADMIN_EMAIL };
      setCurrentUser(user);
      try {
        localStorage.setItem(LOGGED_IN_STATE_KEY, 'true');
      } catch (e) {
        console.error("Could not access localStorage", e)
      }
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  }, []);

  const logout = useCallback(async () => {
    setCurrentUser(null);
     try {
        localStorage.removeItem(LOGGED_IN_STATE_KEY);
      } catch (e) {
        console.error("Could not access localStorage", e)
      }
    router.push('/login');
  }, [router]);

  const value = { currentUser, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
