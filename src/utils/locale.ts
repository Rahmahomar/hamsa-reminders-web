import { DEFAULT_LOCALE, STORAGE_LOCALE, type Locale } from "../constants/locale";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}

export function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_LOCALE);
    if (stored && isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_LOCALE, locale);
  } catch {
    /* ignore */
  }
}

export function applyLocale(locale: Locale): void {
  const root = document.documentElement;
  root.setAttribute("lang", locale);
  root.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
  root.dataset.locale = locale;
}
