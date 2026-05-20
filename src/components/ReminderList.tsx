import { useEffect, useState } from "react";
import type { ReminderListProps } from "../types/reminder-list";
import { formatCountdown, getReminderProgress } from "../utils/reminderTime";
import { EmptyReminders } from "./EmptyReminders";

export function ReminderList({
  reminders,
  onCancel,
  onEdit,
}: ReminderListProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="panel panel--schedule reveal reveal-delay-3">
      <div className="panel__schedule-head">
        <p className="eyebrow">REMINDERS</p>
        <h2>Your Schedule</h2>
      </div>

      <div className="reminder-list-scroll">
        <div className="reminder-list">
        {reminders.length === 0 && <EmptyReminders />}

        {reminders.map((reminder) => {
          const isPending = reminder.status === "PENDING";
          const fireAt = new Date(reminder.fireAt).getTime();
          const remaining = fireAt - now;
          const showCountdown = isPending && remaining > 0;

          return (
            <div
              className={`reminder-card${showCountdown ? " reminder-card--pending" : ""}`}
              key={reminder.id}
            >
              {showCountdown && (
                <div
                  className="reminder-card__progress"
                  style={{ width: `${getReminderProgress(reminder, now)}%` }}
                  aria-hidden
                />
              )}

              <div>
                <h3>{reminder.title}</h3>
                <p>{reminder.body || "No description"}</p>
                <small>{new Date(reminder.fireAt).toLocaleString()}</small>
                {showCountdown && (
                  <span className="reminder-card__countdown">
                    <span className="reminder-card__countdown-dot" aria-hidden />
                    {formatCountdown(remaining)}
                  </span>
                )}
              </div>

              <div className="reminder-card__actions">
                <span className={`badge badge--${reminder.status.toLowerCase()}`}>
                  {reminder.status}
                </span>

                {isPending && (
                  <div className="reminder-card__action-btns">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => onEdit(reminder)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="secondary danger"
                      onClick={() => onCancel(reminder.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
