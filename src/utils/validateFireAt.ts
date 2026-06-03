import { parseLocalDatetimeValue } from "./datetimeLocal";

export type FireAtErrorKey =
  | "fireAt.error.required"
  | "fireAt.error.invalid"
  | "fireAt.error.mustBeFuture";

export function validateFutureFireAt(localValue: string): FireAtErrorKey | null {
  if (!localValue.trim()) {
    return "fireAt.error.required";
  }

  const date = parseLocalDatetimeValue(localValue);
  if (!date) {
    return "fireAt.error.invalid";
  }

  if (date.getTime() <= Date.now()) {
    return "fireAt.error.mustBeFuture";
  }

  return null;
}
