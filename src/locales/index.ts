import type { Locale } from "../constants/locale";
import { ar } from "./ar";
import { en, type Messages } from "./en";

const catalogs: Record<Locale, Messages> = { en, ar };

export type { Messages };
export { en, ar };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
