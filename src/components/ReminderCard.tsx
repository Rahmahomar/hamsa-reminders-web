import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Reminder } from "../types/reminder";
import { formatReminderSchedule } from "../utils/datetimeLocal";
import { computeReminderCardMenuPosition } from "../utils/reminderCardMenuPosition";
import { formatCountdown, getReminderProgress } from "../utils/reminderTime";

type ReminderCardProps = {
  reminder: Reminder;
  countdownNow?: number;
  actionLoading: boolean;
  onCancel: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDuplicate: (reminder: Reminder) => void;
};

export const ReminderCard = memo(function ReminderCard({
  reminder,
  countdownNow,
  actionLoading,
  onCancel,
  onEdit,
  onDuplicate,
}: ReminderCardProps) {
  const isPending = reminder.status === "PENDING";
  const fireAt = new Date(reminder.fireAt).getTime();
  const showCountdown =
    countdownNow !== undefined && isPending && fireAt > countdownNow;
  const remaining = showCountdown ? fireAt - countdownNow : 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const updateMenuPosition = useCallback(() => {
    const btn = menuBtnRef.current;
    const menu = menuRef.current;
    if (!btn || !menu) return;
    const next = computeReminderCardMenuPosition(btn, menu);
    setMenuPosition({ top: next.top, left: next.left });
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    updateMenuPosition();
    const raf = requestAnimationFrame(() => updateMenuPosition());
    const onReposition = () => updateMenuPosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [menuOpen, updateMenuPosition, isPending]);

  useEffect(() => {
    if (!menuOpen) return;

    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuBtnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const menuPanel =
    menuOpen &&
    createPortal(
      <div
        ref={menuRef}
        className="reminder-card__menu reminder-card__menu--floating"
        role="menu"
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
        }}
      >
        {isPending && (
          <>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit(reminder);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              className="reminder-card__menu-danger"
              onClick={() => {
                setMenuOpen(false);
                onCancel(reminder.id);
              }}
            >
              Cancel reminder
            </button>
          </>
        )}
        {!isPending && (
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              onDuplicate(reminder);
            }}
          >
            Duplicate
          </button>
        )}
      </div>,
      document.body
    );

  return (
    <article
      className={[
        "reminder-card",
        showCountdown ? "reminder-card--pending" : "",
        menuOpen ? "reminder-card--menu-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showCountdown && (
        <div
          className="reminder-card__progress"
          style={{ width: `${getReminderProgress(reminder, countdownNow!)}%` }}
          aria-hidden
        />
      )}

      <div className="reminder-card__icon" aria-hidden>
        <CalendarIcon />
      </div>

      <div className="reminder-card__content">
        <h3>
          <bdi>{reminder.title}</bdi>
        </h3>
        <p>
          <bdi>{reminder.body || "No description"}</bdi>
        </p>
        <p className="reminder-card__when">
          <SmallCalendarIcon />
          <bdi>{formatReminderSchedule(reminder.fireAt)}</bdi>
        </p>
        {showCountdown && (
          <span className="reminder-card__countdown">
            <span className="reminder-card__countdown-dot" aria-hidden />
            <bdi>{formatCountdown(remaining)}</bdi>
          </span>
        )}
      </div>

      <div className="reminder-card__aside">
        <span className={`reminder-card__status reminder-card__status--${reminder.status.toLowerCase()}`}>
          {reminder.status}
        </span>

        <div className="reminder-card__actions">
          <button
            type="button"
            className="reminder-card__duplicate"
            disabled={actionLoading}
            aria-label={`Duplicate ${reminder.title}`}
            onClick={() => onDuplicate(reminder)}
          >
            <DuplicateIcon />
            <span>Duplicate</span>
          </button>

          <div className="reminder-card__menu-wrap">
            <button
              ref={menuBtnRef}
              type="button"
              className="reminder-card__menu-btn"
              aria-label="More actions"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              disabled={actionLoading}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
      {menuPanel}
    </article>
  );
});

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SmallCalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M6 16H5a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
