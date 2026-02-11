"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "hifz-dark-mode";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  setIsDark: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "true") {
    return true;
  }
  if (saved === "false") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, String(isDark));
  }, [isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((current) => !current),
      setIsDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
