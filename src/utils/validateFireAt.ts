import { parseLocalDatetimeValue } from "./datetimeLocal";

export function validateFutureFireAt(localValue: string): string | null {
  if (!localValue.trim()) {
    return "Fire At is required";
  }

  const date = parseLocalDatetimeValue(localValue);
  if (!date) {
    return "Fire At is invalid";
  }

  if (date.getTime() <= Date.now()) {
    return "Fire At must be in the future";
  }

  return null;
}
