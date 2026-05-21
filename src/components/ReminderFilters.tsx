import type { ReminderFilterState, ReminderSort } from "../utils/filterReminders";

type ReminderFiltersProps = {
  filter: ReminderFilterState;
  counts: { all: number; pending: number; fired: number; cancelled: number };
  onChange: (next: ReminderFilterState) => void;
};

const STATUS_OPTIONS: { value: ReminderFilterState["status"]; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "FIRED", label: "Fired" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS: { value: ReminderSort; label: string }[] = [
  { value: "created-desc", label: "Newest first" },
  { value: "fireAt-asc", label: "Soonest to fire" },
  { value: "fireAt-desc", label: "Latest to fire" },
];

function countForStatus(
  status: ReminderFilterState["status"],
  counts: ReminderFiltersProps["counts"]
): number {
  switch (status) {
    case "PENDING":
      return counts.pending;
    case "FIRED":
      return counts.fired;
    case "CANCELLED":
      return counts.cancelled;
    default:
      return counts.all;
  }
}

export function ReminderFilters({ filter, counts, onChange }: ReminderFiltersProps) {
  return (
    <div className="reminder-filters">
      <div className="reminder-filters__tabs" role="tablist" aria-label="Filter by status">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={filter.status === opt.value}
            className={`reminder-filters__tab${filter.status === opt.value ? " reminder-filters__tab--active" : ""}`}
            onClick={() => onChange({ ...filter, status: opt.value })}
          >
            {opt.label}
            <span className="reminder-filters__count">{countForStatus(opt.value, counts)}</span>
          </button>
        ))}
      </div>

      <div className="reminder-filters__row">
        <input
          type="search"
          className="reminder-filters__search"
          placeholder="Search reminders…"
          value={filter.query}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
          aria-label="Search reminders"
        />
        <div
          className="reminder-filters__sort-group"
          role="group"
          aria-label="Sort reminders"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`reminder-filters__sort-btn${filter.sort === opt.value ? " reminder-filters__sort-btn--active" : ""}`}
              aria-pressed={filter.sort === opt.value}
              onClick={() => onChange({ ...filter, sort: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
