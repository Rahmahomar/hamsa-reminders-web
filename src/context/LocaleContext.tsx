import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Locale } from "../constants/locale";
import type { LocaleContextValue } from "../types/locale-context";
import { createTranslator, type TranslateFn } from "../utils/i18n";
import { applyLocale, loadLocale, saveLocale } from "../utils/locale";

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const loaded = loadLocale();
    applyLocale(loaded);
    return loaded;
  });

  const setLocale = useCallback((next: Locale) => {
    applyLocale(next);
    saveLocale(next);
    setLocaleState(next);
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useTranslation(): TranslateFn {
  return useLocale().t;
}
