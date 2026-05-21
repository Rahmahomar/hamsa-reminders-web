import type { ReminderFilterState, ReminderSort } from "../utils/filterReminders";

export const STATUS_OPTIONS: { value: ReminderFilterState["status"]; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "FIRED", label: "Fired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const SORT_OPTIONS: { value: ReminderSort; label: string }[] = [
  { value: "created-desc", label: "Newest first" },
  { value: "fireAt-asc", label: "Soonest to fire" },
  { value: "fireAt-desc", label: "Latest to fire" },
];
