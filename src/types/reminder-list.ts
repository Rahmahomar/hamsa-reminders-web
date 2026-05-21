import type { Reminder } from "./reminder";

export type ReminderListProps = {
  reminders: Reminder[];
  /** Total reminders before filter (for empty copy) */
  totalCount?: number;
  listLoading?: boolean;
  hasLoadedOnce?: boolean;
  actionLoading?: boolean;
  onCancel: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDuplicate: (reminder: Reminder) => void;
};
