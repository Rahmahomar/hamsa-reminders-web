import { DEFAULT_THEME, STORAGE_THEME, type Theme } from "../constants/theme";

export function isTheme(value: string): value is Theme {
  return value === "light" || value === "dark";
}

export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_THEME);
    if (stored && isTheme(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_THEME, theme);
  } catch {
    /* ignore */
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#0d1117" : "#97de00");
  }
}
