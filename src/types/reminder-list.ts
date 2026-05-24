import type { Reminder } from "./reminder";

export type ReminderListProps = {
  reminders: Reminder[];
  connected?: boolean;
  connecting?: boolean;
  /** True when filters/search hide all items but reminders exist */
  filtered?: boolean;
  listLoading?: boolean;
  hasLoadedOnce?: boolean;
  actionLoading?: boolean;
  onCancel: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDuplicate: (reminder: Reminder) => void;
};
