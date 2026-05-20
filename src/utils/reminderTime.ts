import type { Reminder } from "../types/reminder";

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

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Any moment now…";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function getReminderProgress(reminder: Reminder, now = Date.now()): number {
  const start = new Date(reminder.createdAt).getTime();
  const end = new Date(reminder.fireAt).getTime();
  if (end <= start) return 100;

  const elapsed = now - start;
  const total = end - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
