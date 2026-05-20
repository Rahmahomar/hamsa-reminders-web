import type { CreateReminderPayload } from "./reminder";

export type ReminderFormProps = {
  celebrate?: boolean;
  onCreate: (payload: CreateReminderPayload) => Promise<void>;
};
