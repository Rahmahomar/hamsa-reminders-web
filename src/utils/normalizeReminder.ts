import type { Reminder } from "../types/reminder";

type ReminderLike = Reminder & {
  user_id?: string;
  project_id?: string;
  fire_at?: string;
  created_at?: string;
  updated_at?: string;
};

export function normalizeReminder(raw: ReminderLike): Reminder {
  const createdAt =
    raw.createdAt ?? raw.created_at ?? raw.updatedAt ?? raw.updated_at ?? "";
  const updatedAt =
    raw.updatedAt ?? raw.updated_at ?? raw.createdAt ?? raw.created_at ?? "";

  return {
    id: raw.id,
    userId: raw.userId ?? raw.user_id ?? "",
    projectId: raw.projectId ?? raw.project_id ?? "",
    title: raw.title,
    body: raw.body,
    fireAt: raw.fireAt ?? raw.fire_at ?? "",
    status: raw.status,
    createdAt,
    updatedAt,
  };
}

export function normalizeReminders(raw: ReminderLike[]): Reminder[] {
  return raw.map(normalizeReminder);
}
