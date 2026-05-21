import type { Reminder, ReminderStatus } from "../types/reminder";

export type ReminderSort = "fireAt-asc" | "fireAt-desc" | "created-desc";

export type ReminderFilterState = {
  status: ReminderStatus | "ALL";
  query: string;
  sort: ReminderSort;
};

export const DEFAULT_REMINDER_FILTER: ReminderFilterState = {
  status: "ALL",
  query: "",
  sort: "created-desc",
};

function parseTime(value: string | undefined): number {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/** Newest activity first (updatedAt, then createdAt) */
export function getReminderRecencyMs(reminder: Reminder): number {
  return Math.max(
    parseTime(reminder.updatedAt),
    parseTime(reminder.createdAt)
  );
}

function pinReminderToTop(list: Reminder[], pinId: string | null | undefined): Reminder[] {
  if (!pinId) return list;
  const index = list.findIndex((r) => r.id === pinId);
  if (index <= 0) return list;
  const pinned = list[index];
  return [pinned, ...list.slice(0, index), ...list.slice(index + 1)];
}

export function filterAndSortReminders(
  reminders: Reminder[],
  filter: ReminderFilterState,
  pinId?: string | null
): Reminder[] {
  const q = filter.query.trim().toLowerCase();

  let list = reminders.filter((r) => {
    if (filter.status !== "ALL" && r.status !== filter.status) return false;
    if (!q) return true;
    const haystack = `${r.title} ${r.body ?? ""} ${r.projectId}`.toLowerCase();
    return haystack.includes(q);
  });

  list = [...list].sort((a, b) => {
    switch (filter.sort) {
      case "fireAt-desc":
        return parseTime(b.fireAt) - parseTime(a.fireAt);
      case "created-desc":
        return getReminderRecencyMs(b) - getReminderRecencyMs(a);
      case "fireAt-asc":
      default:
        return parseTime(a.fireAt) - parseTime(b.fireAt);
    }
  });

  return pinReminderToTop(list, pinId);
}
