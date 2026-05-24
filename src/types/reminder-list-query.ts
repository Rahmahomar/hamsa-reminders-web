import type { ReminderStatus } from "./reminder";
import type { ReminderApiSort } from "./reminder-api-sort";

export type ReminderListQuery = {
  status?: ReminderStatus;
  search?: string;
  sort?: ReminderApiSort;
};
