export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function toLocalDatetimeInputValue(
  isoString: string | null | undefined
): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return buildLocalDatetimeValue(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}

export function buildLocalDatetimeValue(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number
): string {
  return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}`;
}

export function parseLocalDatetimeValue(localValue: string): Date | null {
  if (!localValue) return null;
  const d = new Date(localValue);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function localDatetimeInputValueToISO(localValue: string): string | undefined {
  const d = parseLocalDatetimeValue(localValue);
  return d ? d.toISOString() : undefined;
}

export function formatFireAtPreview(localValue: string): string {
  const d = parseLocalDatetimeValue(localValue);
  if (!d) return "Choose when to fire";

  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function roundToNextMinutes(date: Date, step: number): Date {
  const d = new Date(date);
  const ms = step * 60 * 1000;
  d.setTime(Math.ceil(d.getTime() / ms) * ms);
  d.setSeconds(0, 0);
  return d;
}

export function dateToLocalValue(date: Date): string {
  return buildLocalDatetimeValue(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}
