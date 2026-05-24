import { useEffect, useState } from "react";
import type { ReminderListProps } from "../types/reminder-list";
import { formatCountdown, getReminderProgress } from "../utils/reminderTime";
import { EmptyReminders } from "./EmptyReminders";
import { ReminderListSkeleton } from "./ReminderListSkeleton";
import { ScheduleLocked } from "./ScheduleLocked";

export function ReminderList({
  reminders,
  connected = false,
  connecting = false,
  filtered = false,
  listLoading = false,
  hasLoadedOnce = false,
  actionLoading = false,
  onCancel,
  onEdit,
  onDuplicate,
}: ReminderListProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="panel panel--schedule reveal reveal-delay-3"
      aria-labelledby="schedule-heading"
    >
      <div className="panel__schedule-head">
        <p className="eyebrow">REMINDERS</p>
        <h2 id="schedule-heading">Your Schedule</h2>
      </div>

      <div className="reminder-list-scroll">
        {listLoading && !hasLoadedOnce ? (
          <div role="status" aria-live="polite" aria-busy="true">
            <p className="reminder-list__loading sr-only">Loading reminders…</p>
            <ReminderListSkeleton />
          </div>
        ) : null}

        {!connected && !connecting && !(listLoading && !hasLoadedOnce) ? (
          <ScheduleLocked />
        ) : null}

        <div className="reminder-list">
          {connected &&
          !(listLoading && !hasLoadedOnce) &&
          reminders.length === 0 ? (
            <EmptyReminders filtered={filtered} />
          ) : null}

          {connected &&
            reminders.map((reminder) => {
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

                  <div className="reminder-card__action-btns">
                    <button
                      type="button"
                      className="secondary"
                      disabled={actionLoading}
                      onClick={() => onDuplicate(reminder)}
                    >
                      Duplicate
                    </button>

                    {isPending && (
                      <>
                        <button
                          type="button"
                          className="secondary"
                          disabled={actionLoading}
                          onClick={() => onEdit(reminder)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="secondary danger"
                          disabled={actionLoading}
                          onClick={() => onCancel(reminder.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
        </div>
      </div>
    </section>
  );
}
