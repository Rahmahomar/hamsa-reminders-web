import type { ReminderSort } from "../utils/filterReminders";
import type { ReminderApiSort } from "../types/reminder-api-sort";

export const SORT_TO_API: Record<ReminderSort, ReminderApiSort> = {
  "created-desc": "newest",
  "fireAt-asc": "soonest",
  "fireAt-desc": "latest",
};

export function mapSortToApi(sort: ReminderSort): ReminderApiSort {
  return SORT_TO_API[sort];
}
