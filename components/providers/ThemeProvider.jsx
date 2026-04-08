"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const THEME_STORAGE_KEY = "dtr-theme-mode";
export const THEME_COOKIE_KEY = "dtr-theme-mode";
export const THEME_MODES = ["light", "dark", "system"];

const ThemeContext = createContext(null);

function resolveTheme(mode) {
  if (mode === "light" || mode === "dark") return mode;

  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(mode) {
  if (typeof document === "undefined") return "light";

  const resolved = resolveTheme(mode);
  const html = document.documentElement;

  html.classList.toggle("dark", resolved === "dark");
  html.style.colorScheme = resolved;

  return resolved;
}

function getStoredTheme() {
  if (typeof window === "undefined") return "system";

  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_MODES.includes(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

export function ThemeProvider({ children, initialTheme = "system" }) {
  const safeInitialTheme = THEME_MODES.includes(initialTheme)
    ? initialTheme
    : "system";

  const [theme, setThemeState] = useState(safeInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState(
    safeInitialTheme === "dark" ? "dark" : "light",
  );

  const setTheme = useCallback((nextTheme) => {
    if (!THEME_MODES.includes(nextTheme)) return;
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const resolvedCurrent = resolveTheme(current);
      return resolvedCurrent === "dark" ? "light" : "dark";
    });
  }, []);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
  }, []);

  useEffect(() => {
    const resolved = applyThemeClass(theme);
    setResolvedTheme(resolved);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Ignore storage failures in restricted contexts.
      }
    }

    if (typeof document !== "undefined") {
      document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = () => {
      if (theme !== "system") return;
      const resolved = applyThemeClass("system");
      setResolvedTheme(resolved);
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
