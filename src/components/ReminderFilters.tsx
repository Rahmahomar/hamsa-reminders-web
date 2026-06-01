import { useState, useRef, useEffect } from "react";
import { SORT_OPTIONS, STATUS_OPTIONS } from "../constants/reminder-filters";
import type { ReminderFilterState, ReminderSort } from "../utils/filterReminders";
import type { ReminderFiltersProps } from "../types/reminder-filters";

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
  const [isOpen, setIsOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === filter.sort)?.label ?? "Newest first";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

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
            {opt.label} {countForStatus(opt.value, counts)}
          </button>
        ))}
      </div>

      <div className="reminder-filters__toolbar">
        <div className="reminder-filters__search-wrap">
          <svg
            className="reminder-filters__search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20l-3.5-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className="reminder-filters__search"
            placeholder="Search reminders..."
            value={filter.query}
            onChange={(e) => onChange({ ...filter, query: e.target.value })}
            aria-label="Search reminders"
          />
        </div>

        <div
          className="reminder-filters__sort"
          ref={sortDropdownRef}
        >
          <span className="reminder-filters__sort-label">Sort:</span>
          <button
            className={`reminder-filters__sort-button${isOpen ? " reminder-filters__sort-button--open" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={`Sort reminders, currently ${sortLabel}`}
            type="button"
          >
            {sortLabel}
            <svg
              className="reminder-filters__sort-icon"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              aria-hidden
            >
              <path
                d="M1 1l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="reminder-filters__sort-menu">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`reminder-filters__sort-option${
                    filter.sort === opt.value
                      ? " reminder-filters__sort-option--selected"
                      : ""
                  }`}
                  onClick={() => {
                    onChange({ ...filter, sort: opt.value as ReminderSort });
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
