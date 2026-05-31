"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    "--background": "#0b0f1a",
    "--foreground": "#e2e8f0",
    "--card": "#111827",
    "--card-border": "#1e293b",
    "--primary": "#6366f1",
    "--primary-hover": "#818cf8",
    "--accent": "#22d3ee",
    "--success": "#34d399",
    "--error": "#f87171",
    "--muted": "#94a3b8",
    "--input-bg": "#0f172a",
    "--logo-text": "#ffffff",
  },
  light: {
    "--background": "#f8fafc",
    "--foreground": "#1e293b",
    "--card": "#ffffff",
    "--card-border": "#e2e8f0",
    "--primary": "#6366f1",
    "--primary-hover": "#4f46e5",
    "--accent": "#0891b2",
    "--success": "#059669",
    "--error": "#dc2626",
    "--muted": "#64748b",
    "--input-bg": "#f1f5f9",
    "--logo-text": "#ffffff",
  },
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** 将主题变量批量写入 :root */
function applyThemeVars(vars: Record<string, string>): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

/** 根据存储或系统偏好推断初始主题 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/** 主题上下文 Provider */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyThemeVars(THEMES[theme]);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** 获取当前主题和切换函数 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme 必须在 ThemeProvider 内使用");
  }
  return ctx;
}
