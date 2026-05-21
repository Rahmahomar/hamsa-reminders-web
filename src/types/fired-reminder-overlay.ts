import type { Reminder } from "./reminder";

export type FiredReminderOverlayProps = {
  reminder: Reminder | null;
  onClose: () => void;
};
