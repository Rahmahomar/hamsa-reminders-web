import type { ReminderFilterState } from "../utils/filterReminders";

export type ReminderFiltersProps = {
  filter: ReminderFilterState;
  counts: { all: number; pending: number; fired: number; cancelled: number };
  onChange: (next: ReminderFilterState) => void;
};
