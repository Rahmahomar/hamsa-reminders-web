import { useEffect, useMemo, useState } from "react";
import {
  buildLocalDatetimeValue,
  dateToLocalValue,
  formatFireAtPreview,
  parseLocalDatetimeValue,
  roundToNextMinutes,
} from "../utils/datetimeLocal";
import { getCalendarDays, isSameDay } from "../utils/fireAtCalendar";
import "../styles/fire-at-picker.css";
import { WEEKDAYS } from "../types/fire-at-picker";
import type { FireAtPickerProps, Preset } from "../types/fire-at-picker";

export function FireAtPicker({
  value,
  onChange,
  error,
  minDate = new Date(),
  defaultExpanded = false,
}: FireAtPickerProps) {
  const selected = parseLocalDatetimeValue(value);
  const today = useMemo(() => new Date(), []);
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (error) setExpanded(true);
  }, [error]);

  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? minDate;
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  useEffect(() => {
    if (!selected) return;
    setViewMonth({ year: selected.getFullYear(), month: selected.getMonth() });
  }, [value, selected]);

  const parts = useMemo(() => {
    const d = selected ?? roundToNextMinutes(minDate, 15);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hours: d.getHours(),
      minutes: d.getMinutes(),
    };
  }, [selected, minDate]);

  const minuteOptions = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => i * 5);
    if (!base.includes(parts.minutes)) {
      return [...base, parts.minutes].sort((a, b) => a - b);
    }
    return base;
  }, [parts.minutes]);

  const updateParts = (patch: Partial<typeof parts>) => {
    const next = { ...parts, ...patch };
    onChange(
      buildLocalDatetimeValue(
        next.year,
        next.month,
        next.day,
        next.hours,
        next.minutes
      )
    );
  };

  const presets: Preset[] = useMemo(() => {
    const now = new Date();
    const tomorrow9 = new Date(now);
    tomorrow9.setDate(tomorrow9.getDate() + 1);
    tomorrow9.setHours(9, 0, 0, 0);

    const nextMonday = new Date(now);
    const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
    nextMonday.setHours(9, 0, 0, 0);

    return [
      { label: "In 15 min", resolve: () => roundToNextMinutes(now, 15) },
      {
        label: "In 1 hour",
        resolve: () => {
          const d = new Date(now);
          d.setHours(d.getHours() + 1);
          return roundToNextMinutes(d, 5);
        },
      },
      {
        label: "In 3 hours",
        resolve: () => {
          const d = new Date(now);
          d.setHours(d.getHours() + 3);
          return roundToNextMinutes(d, 5);
        },
      },
      { label: "Tomorrow 9 AM", resolve: () => tomorrow9 },
      { label: "Next Monday", resolve: () => nextMonday },
    ];
  }, []);

  const calendarDays = getCalendarDays(viewMonth.year, viewMonth.month);
  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleString(
    undefined,
    { month: "long", year: "numeric" }
  );

  const isDayDisabled = (day: number) => {
    const candidate = new Date(viewMonth.year, viewMonth.month, day);
    candidate.setHours(23, 59, 59, 999);
    const floor = new Date(minDate);
    floor.setHours(0, 0, 0, 0);
    return candidate < floor;
  };

  const hourOptions = Array.from({ length: 24 }, (_, h) => h);

  const applyPreset = (resolve: () => Date) => {
    onChange(dateToLocalValue(resolve()));
    setExpanded(true);
  };

  return (
    <div
      className={[
        "fire-at-picker",
        expanded ? "fire-at-picker--open" : "fire-at-picker--collapsed",
        error ? "fire-at-picker--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="fire-at-picker__trigger"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls="fire-at-picker-panel"
      >
        <span className="fire-at-picker__icon" aria-hidden>
          ⏱
        </span>
        <div className="fire-at-picker__preview">
          <span className="fire-at-picker__preview-label">Fire at</span>
          <strong className="fire-at-picker__preview-value">
            {formatFireAtPreview(value)}
          </strong>
        </div>
        <span className="fire-at-picker__chevron" aria-hidden />
      </button>

      <div
        id="fire-at-picker-panel"
        className="fire-at-picker__body"
        hidden={!expanded}
      >
        <div className="fire-at-picker__body-inner">
      <div className="fire-at-picker__presets" role="group" aria-label="Quick times">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="fire-at-picker__preset"
            onClick={() => applyPreset(preset.resolve)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="fire-at-picker__calendar">
        <div className="fire-at-picker__month-bar">
          <button
            type="button"
            className="fire-at-picker__nav"
            aria-label="Previous month"
            onClick={() =>
              setViewMonth((m) => {
                const d = new Date(m.year, m.month - 1, 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
          >
            ‹
          </button>
          <span className="fire-at-picker__month">{monthLabel}</span>
          <button
            type="button"
            className="fire-at-picker__nav"
            aria-label="Next month"
            onClick={() =>
              setViewMonth((m) => {
                const d = new Date(m.year, m.month + 1, 1);
                return { year: d.getFullYear(), month: d.getMonth() };
              })
            }
          >
            ›
          </button>
        </div>

        <div className="fire-at-picker__weekdays">
          {WEEKDAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="fire-at-picker__days">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <span
                  key={`empty-${index}`}
                  className="fire-at-picker__day fire-at-picker__day--empty"
                />
              );
            }

            const dayDate = new Date(viewMonth.year, viewMonth.month, day);
            const isSelected = selected ? isSameDay(dayDate, selected) : false;
            const isToday = isSameDay(dayDate, today);
            const disabled = isDayDisabled(day);

            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                className={[
                  "fire-at-picker__day",
                  isSelected ? "fire-at-picker__day--selected" : "",
                  isToday ? "fire-at-picker__day--today" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => updateParts({ day })}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fire-at-picker__time">
        <span className="fire-at-picker__time-label">Time</span>
        <div className="fire-at-picker__time-inputs">
          <select
            className="fire-at-picker__select"
            value={parts.hours}
            onChange={(e) => updateParts({ hours: Number(e.target.value) })}
            aria-label="Hour"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {new Date(2000, 0, 1, h).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  hour12: true,
                })}
              </option>
            ))}
          </select>
          <span className="fire-at-picker__time-sep">:</span>
          <select
            className="fire-at-picker__select"
            value={parts.minutes}
            onChange={(e) => updateParts({ minutes: Number(e.target.value) })}
            aria-label="Minute"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>
        </div>
      </div>

      {error && <p className="fire-at-picker__error">{error}</p>}
    </div>
  );
}
