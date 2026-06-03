import type { Locale } from "../constants/locale";
import type { TranslateFn } from "../utils/i18n";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
};
