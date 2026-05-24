import type { Reminder } from "../types/reminder";

export type ReminderStatusCounts = {
  all: number;
  pending: number;
  fired: number;
  cancelled: number;
};

export function computeReminderCounts(
  reminders: Reminder[]
): ReminderStatusCounts {
  let pending = 0;
  let fired = 0;
  let cancelled = 0;

  for (const reminder of reminders) {
    switch (reminder.status) {
      case "PENDING":
        pending += 1;
        break;
      case "FIRED":
        fired += 1;
        break;
      case "CANCELLED":
        cancelled += 1;
        break;
    }
  }

  return {
    all: reminders.length,
    pending,
    fired,
    cancelled,
  };
}
