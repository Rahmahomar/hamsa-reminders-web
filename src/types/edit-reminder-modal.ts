import type { Reminder } from "./reminder";

export type EditReminderModalPayload = {
  title?: string;
  body?: string;
  fireAt?: string;
};

export type EditReminderModalProps = {
  reminder: Reminder;
  onClose: () => void;
  onSave: (payload: EditReminderModalPayload) => void;
};
