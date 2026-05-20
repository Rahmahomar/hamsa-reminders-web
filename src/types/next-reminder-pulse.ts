import type { Reminder } from "./reminder";

export type NextReminderPulseProps = {
  reminders: Reminder[];
  connected: boolean;
};
