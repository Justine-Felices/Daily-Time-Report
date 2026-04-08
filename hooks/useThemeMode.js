"use client";

import { useCallback } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export const THEME_MODES = ["light", "dark", "system"];

export default function useThemeMode() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const cycleMode = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
      return;
    }

    if (theme === "dark") {
      setTheme("system");
      return;
    }

    setTheme("light");
  }, [theme, setTheme]);

  const setMode = useCallback((nextMode) => {
    if (!THEME_MODES.includes(nextMode)) return;
    setTheme(nextMode);
  }, [setTheme]);

  return {
    mode: theme,
    resolvedMode: resolvedTheme,
    setMode,
    setThemeMode: setMode,
    cycleMode,
    toggleTheme,
  };
}
