import type { Locale } from "../constants/locale";
import { getMessages, type Messages } from "../locales";

export type TranslationParams = Record<string, string | number>;

function resolvePath(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{{${name}}}` : String(value);
  });
}

export function createTranslator(locale: Locale) {
  const messages = getMessages(locale);
  const fallback = locale === "en" ? null : getMessages("en");

  return function t(key: string, params?: TranslationParams): string {
    let value = resolvePath(messages, key);
    if (value === undefined && fallback) {
      value = resolvePath(fallback, key);
    }
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation: ${locale}.${key}`);
      }
      return key;
    }
    return interpolate(value, params);
  };
}

export type TranslateFn = ReturnType<typeof createTranslator>;
