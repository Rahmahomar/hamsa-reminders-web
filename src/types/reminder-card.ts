import type { Reminder } from "./reminder";

export type ReminderCardProps = {
  reminder: Reminder;
  countdownNow?: number;
  actionLoading: boolean;
  onCancel: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDuplicate: (reminder: Reminder) => void;
};
