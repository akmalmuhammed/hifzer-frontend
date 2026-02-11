"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  getCurrentUser,
  hasAuthSession,
  login as loginApi,
  refreshSession,
  signup as signupApi,
  type AuthUser,
} from "@/lib/api";

type AuthContextValue = {
  user: AuthUser | null;
  initializing: boolean;
  isAuthenticated: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  signup: (params: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!hasAuthSession()) {
        if (mounted) {
          setUser(null);
          setInitializing(false);
        }
        return;
      }

      try {
        const refreshed = await refreshSession();
        if (mounted) {
          setUser(refreshed.user);
        }
      } catch {
        clearAuthSession();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setInitializing(false);
        }
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login: async ({ email, password }) => {
        const payload = await loginApi({ email, password });
        setUser(payload.user);
      },
      signup: async ({ email, password }) => {
        const payload = await signupApi({ email, password });
        setUser(payload.user);
      },
      logout: () => {
        clearAuthSession();
        setUser(null);
      },
    }),
    [initializing, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
