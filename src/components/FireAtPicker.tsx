import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslation } from "../context/LocaleContext";
import {
  FireAtTimeDropdown,
  type FireAtTimeOption,
} from "./FireAtTimeDropdown";
import {
  buildLocalDatetimeValue,
  dateToLocalValue,
  formatFireAtPreview,
  parseLocalDatetimeValue,
  roundToNextMinutes,
} from "../utils/datetimeLocal";
import { getCalendarDays, isSameDay } from "../utils/fireAtCalendar";
import "../styles/fire-at-picker.css";
import { WEEKDAY_KEYS } from "../types/fire-at-picker";
import type { FireAtPickerProps, Preset } from "../types/fire-at-picker";

export function FireAtPicker({
  value,
  onChange,
  error,
  minDate = new Date(),
  defaultExpanded = false,
}: FireAtPickerProps) {
  const { locale } = useLocale();
  const t = useTranslation();
  const selected = parseLocalDatetimeValue(value);
  const today = useMemo(() => new Date(), []);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [openTimeDropdown, setOpenTimeDropdown] = useState<"hour" | "minute" | null>(
    null
  );

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
      {
        id: "in15Min",
        labelKey: "fireAt.presets.in15Min",
        resolve: () => roundToNextMinutes(now, 15),
      },
      {
        id: "in1Hour",
        labelKey: "fireAt.presets.in1Hour",
        resolve: () => {
          const d = new Date(now);
          d.setHours(d.getHours() + 1);
          return roundToNextMinutes(d, 5);
        },
      },
      {
        id: "in3Hours",
        labelKey: "fireAt.presets.in3Hours",
        resolve: () => {
          const d = new Date(now);
          d.setHours(d.getHours() + 3);
          return roundToNextMinutes(d, 5);
        },
      },
      {
        id: "tomorrow9Am",
        labelKey: "fireAt.presets.tomorrow9Am",
        resolve: () => tomorrow9,
      },
      {
        id: "nextMonday",
        labelKey: "fireAt.presets.nextMonday",
        resolve: () => nextMonday,
      },
    ];
  }, []);

  const calendarDays = getCalendarDays(viewMonth.year, viewMonth.month);
  const monthLabel = new Date(viewMonth.year, viewMonth.month, 1).toLocaleString(
    locale,
    { month: "long", year: "numeric" }
  );

  const isDayDisabled = (day: number) => {
    const candidate = new Date(viewMonth.year, viewMonth.month, day);
    candidate.setHours(23, 59, 59, 999);
    const floor = new Date(minDate);
    floor.setHours(0, 0, 0, 0);
    return candidate < floor;
  };

  const hourOptions: FireAtTimeOption[] = useMemo(
    () =>
      Array.from({ length: 24 }, (_, h) => ({
        value: h,
        label: new Date(2000, 0, 1, h).toLocaleTimeString(locale, {
          hour: "numeric",
          hour12: true,
        }),
      })),
    [locale]
  );

  const minuteSelectOptions: FireAtTimeOption[] = useMemo(
    () =>
      minuteOptions.map((m) => ({
        value: m,
        label: String(m).padStart(2, "0"),
      })),
    [minuteOptions]
  );

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
          <span className="fire-at-picker__preview-label">{t("fireAt.label")}</span>
          <strong className="fire-at-picker__preview-value">
            {formatFireAtPreview(value, t("fireAt.previewChoose"), locale)}
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
      <div
        className="fire-at-picker__presets"
        role="group"
        aria-label={t("fireAt.quickTimes")}
      >
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="fire-at-picker__preset"
            onClick={() => applyPreset(preset.resolve)}
          >
            {t(preset.labelKey)}
          </button>
        ))}
      </div>

      <div className="fire-at-picker__calendar">
        <div className="fire-at-picker__month-bar">
          <button
            type="button"
            className="fire-at-picker__nav"
            aria-label={t("fireAt.previousMonth")}
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
            aria-label={t("fireAt.nextMonth")}
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
          {WEEKDAY_KEYS.map((key) => (
            <span key={key}>{t(key)}</span>
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
        <span className="fire-at-picker__time-label">{t("fireAt.time")}</span>
        <div className="fire-at-picker__time-inputs">
          <FireAtTimeDropdown
            value={parts.hours}
            options={hourOptions}
            onChange={(hours) => updateParts({ hours })}
            ariaLabel={t("fireAt.hour")}
            isOpen={openTimeDropdown === "hour"}
            onOpenChange={(open) => setOpenTimeDropdown(open ? "hour" : null)}
          />
          <span className="fire-at-picker__time-sep">:</span>
          <FireAtTimeDropdown
            value={parts.minutes}
            options={minuteSelectOptions}
            onChange={(minutes) => updateParts({ minutes })}
            ariaLabel={t("fireAt.minute")}
            isOpen={openTimeDropdown === "minute"}
            onOpenChange={(open) => setOpenTimeDropdown(open ? "minute" : null)}
          />
        </div>
      </div>
        </div>
      </div>

      {error && <p className="fire-at-picker__error">{error}</p>}
    </div>
  );
}
