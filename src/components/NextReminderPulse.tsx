import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslation } from "../context/LocaleContext";
import type { NextReminderPulseProps } from "../types/next-reminder-pulse";
import { useNow } from "../hooks/useNow";
import { formatReminderSchedule } from "../utils/datetimeLocal";
import {
  formatCountdown,
  getNextPendingReminder,
  getReminderProgress,
} from "../utils/reminderTime";
import "../styles/next-reminder-pulse.css";

const COLLAPSED_STORAGE_KEY = "next-pulse-collapsed";

function readCollapsedState(): boolean {
  try {
    return sessionStorage.getItem(COLLAPSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsedState(collapsed: boolean): void {
  try {
    sessionStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function NextReminderPulse({
  reminders,
  connected,
}: NextReminderPulseProps) {
  const { locale } = useLocale();
  const t = useTranslation();
  const [collapsed, setCollapsed] = useState(readCollapsedState);

  const next = useMemo(
    () => (connected ? getNextPendingReminder(reminders) : null),
    [connected, reminders]
  );

  const needsClock = connected && next !== null;
  const now = useNow(needsClock);

  useEffect(() => {
    writeCollapsedState(collapsed);
  }, [collapsed]);

  if (!connected || !next) return null;

  const remaining = new Date(next.fireAt).getTime() - now;
  const progress = getReminderProgress(next, now);
  const countdown = formatCountdown(remaining, t);
  const schedule = formatReminderSchedule(next.fireAt, locale);

  const expand = () => setCollapsed(false);
  const toggleCollapsed = () => setCollapsed((value) => !value);

  const handleShellClick = () => {
    if (collapsed) expand();
  };

  const handleShellKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (collapsed && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      expand();
    }
  };

  return createPortal(
    <div
      className={`next-pulse${collapsed ? " next-pulse--collapsed" : ""}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      role="status"
      aria-live="polite"
      aria-label={t("nextPulse.aria", {
        title: next.title,
        time: countdown,
      })}
      onClick={handleShellClick}
      onKeyDown={handleShellKeyDown}
      tabIndex={collapsed ? 0 : undefined}
    >
      <div className="next-pulse__row">
        <div className="next-pulse__icon" aria-hidden>
          🔔
        </div>

        {collapsed ? (
          <p className="next-pulse__compact">
            <span className="next-pulse__compact-label">
              {t("nextPulse.remaining")}
            </span>
            <strong className="next-pulse__compact-time">{countdown}</strong>
          </p>
        ) : (
          <div className="next-pulse__main">
            <p className="next-pulse__label">{t("nextPulse.label")}</p>
            <p className="next-pulse__title">{next.title}</p>
            {next.body ? <p className="next-pulse__body">{next.body}</p> : null}

            <div className="next-pulse__meta">
              {schedule ? (
                <time className="next-pulse__schedule" dateTime={next.fireAt}>
                  {schedule}
                </time>
              ) : null}
              <span className="next-pulse__countdown">
                {t("nextPulse.remaining")} {countdown}
              </span>
            </div>

            <div className="next-pulse__progress" aria-hidden>
              <div
                className="next-pulse__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          className="next-pulse__toggle"
          aria-expanded={!collapsed}
          aria-label={collapsed ? t("nextPulse.expand") : t("nextPulse.dock")}
          onClick={(event) => {
            event.stopPropagation();
            toggleCollapsed();
          }}
        >
          <svg
            className="next-pulse__toggle-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M14 7l-6 5 6 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
