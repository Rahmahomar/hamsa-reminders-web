import { dateToLocalValue, roundToNextMinutes } from "./datetimeLocal";

export type FireAtPreset = {
  id: string;
  label: string;
  getValue: () => string;
};

function addHours(base: Date, hours: number): Date {
  const d = new Date(base);
  d.setHours(d.getHours() + hours);
  return d;
}

function tomorrowAt(hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function nextWeekSameTime(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return roundToNextMinutes(d, 5);
}

export const FIRE_AT_PRESETS: FireAtPreset[] = [
  {
    id: "1h",
    label: "In 1 hour",
    getValue: () => dateToLocalValue(roundToNextMinutes(addHours(new Date(), 1), 5)),
  },
  {
    id: "tomorrow-9",
    label: "Tomorrow 9:00",
    getValue: () => dateToLocalValue(tomorrowAt(9, 0)),
  },
  {
    id: "1w",
    label: "In 1 week",
    getValue: () => dateToLocalValue(nextWeekSameTime()),
  },
];

export function getTimezoneLabel(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Local time";
  }
}
