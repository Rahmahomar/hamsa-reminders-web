export const STORAGE_LOCALE = "hamsa_reminders_locale";

export type Locale = "en" | "ar";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ar", label: "عربي" },
];
