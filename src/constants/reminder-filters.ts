import type { ReminderFilterState, ReminderSort } from "../utils/filterReminders";

export const STATUS_OPTIONS: {
  value: ReminderFilterState["status"];
  labelKey: string;
}[] = [
  { value: "ALL", labelKey: "reminderFilters.status.all" },
  { value: "PENDING", labelKey: "reminderFilters.status.pending" },
  { value: "FIRED", labelKey: "reminderFilters.status.fired" },
  { value: "CANCELLED", labelKey: "reminderFilters.status.cancelled" },
];

export const SORT_OPTIONS: { value: ReminderSort; labelKey: string }[] = [
  { value: "created-desc", labelKey: "reminderFilters.sort.newestFirst" },
  { value: "fireAt-asc", labelKey: "reminderFilters.sort.soonestToFire" },
  { value: "fireAt-desc", labelKey: "reminderFilters.sort.latestToFire" },
];
