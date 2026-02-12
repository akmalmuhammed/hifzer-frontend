"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import {
  useAuth as useClerkAuth,
  useClerk,
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/nextjs";
import {
  ApiError,
  clearAuthSession,
  getCurrentUser,
  hasAuthSession,
  login as loginApi,
  refreshSession,
  setBearerTokenProvider,
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

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(key && key.startsWith("pk_") && !key.includes("replace_me"));
}

function LegacyAuthProviderImpl({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
    if (user) {
      Sentry.setUser({ id: user.id, email: user.email });
      return;
    }
    Sentry.setUser(null);
  }, [user]);

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

function ClerkAuthProviderImpl({ children }: { children: React.ReactNode }) {
  const { isLoaded: clerkLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut, setActive } = useClerk();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const initializing = !clerkLoaded;

  const user = useMemo<AuthUser | null>(() => {
    if (!clerkUser) {
      return null;
    }
    return {
      id: clerkUser.id,
      email:
        clerkUser.primaryEmailAddress?.emailAddress ??
        `clerk_${clerkUser.id}@clerk.local`,
    };
  }, [clerkUser]);

  useEffect(() => {
    setBearerTokenProvider(async () => {
      if (!isSignedIn) {
        return null;
      }
      return getToken({ skipCache: true });
    });
    return () => {
      setBearerTokenProvider(null);
    };
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) {
      clearAuthSession();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (user) {
      Sentry.setUser({ id: user.id, email: user.email });
      return;
    }
    Sentry.setUser(null);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(isSignedIn && user),
      login: async ({ email, password }) => {
        if (!signInLoaded) {
          throw new ApiError({
            message: "Auth is initializing. Try again.",
            status: 503,
            code: "AUTH_INITIALIZING",
          });
        }
        const result = await signIn.create({
          identifier: email,
          password,
        });
        if (result.status !== "complete" || !result.createdSessionId) {
          throw new ApiError({
            message: "Sign-in requires additional verification in Clerk.",
            status: 401,
            code: "CLERK_SIGNIN_INCOMPLETE",
            details: { status: result.status },
          });
        }
        await setActive({ session: result.createdSessionId });
      },
      signup: async ({ email, password }) => {
        if (!signUpLoaded) {
          throw new ApiError({
            message: "Auth is initializing. Try again.",
            status: 503,
            code: "AUTH_INITIALIZING",
          });
        }
        const result = await signUp.create({
          emailAddress: email,
          password,
        });
        if (result.status !== "complete" || !result.createdSessionId) {
          throw new ApiError({
            message:
              "Signup requires additional verification in Clerk. Complete verification or disable it in Clerk settings.",
            status: 400,
            code: "CLERK_SIGNUP_INCOMPLETE",
            details: { status: result.status },
          });
        }
        await setActive({ session: result.createdSessionId });
      },
      logout: () => {
        void signOut();
        clearAuthSession();
      },
    }),
    [initializing, isSignedIn, setActive, signIn, signInLoaded, signOut, signUp, signUpLoaded, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured()) {
    return <ClerkAuthProviderImpl>{children}</ClerkAuthProviderImpl>;
  }
  return <LegacyAuthProviderImpl>{children}</LegacyAuthProviderImpl>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
