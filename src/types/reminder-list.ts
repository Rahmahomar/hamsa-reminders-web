import type { Reminder } from "./reminder";

export type ReminderListProps = {
  reminders: Reminder[];
  onCancel: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
};
