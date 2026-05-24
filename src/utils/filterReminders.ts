import type { ReminderStatus } from "../types/reminder";

export type ReminderSort = "fireAt-asc" | "fireAt-desc" | "created-desc";

export type ReminderFilterState = {
  status: ReminderStatus | "ALL";
  query: string;
  sort: ReminderSort;
};

export const DEFAULT_REMINDER_FILTER: ReminderFilterState = {
  status: "ALL",
  query: "",
  sort: "created-desc",
};
