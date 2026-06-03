import type { Reminder } from "../types/reminder";
import type { TranslateFn } from "./i18n";

export function getNextPendingReminder(reminders: Reminder[]): Reminder | null {
  const now = Date.now();
  const pending = reminders
    .filter((r) => r.status === "PENDING")
    .filter((r) => new Date(r.fireAt).getTime() > now)
    .sort(
      (a, b) => new Date(a.fireAt).getTime() - new Date(b.fireAt).getTime()
    );

  return pending[0] ?? null;
}

export function formatCountdown(ms: number, t: TranslateFn): string {
  if (ms <= 0) return t("countdown.anyMoment");

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return t("countdown.dhms", { days, hours, minutes });
  }
  if (hours > 0) {
    return t("countdown.hms", { hours, minutes, seconds });
  }
  if (minutes > 0) {
    return t("countdown.ms", { minutes, seconds });
  }
  return t("countdown.s", { seconds });
}

export function getReminderProgress(reminder: Reminder, now = Date.now()): number {
  const start = new Date(reminder.createdAt).getTime();
  const end = new Date(reminder.fireAt).getTime();
  if (end <= start) return 100;

  const elapsed = now - start;
  const total = end - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
