import { memo } from "react";
import type { Reminder } from "../types/reminder";
import { formatCountdown, getReminderProgress } from "../utils/reminderTime";

type ReminderCardProps = {
  reminder: Reminder;
  /** Set only for pending cards with an active countdown — avoids re-rendering others every second. */
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

  return (
    <div
      className={`reminder-card${showCountdown ? " reminder-card--pending" : ""}`}
    >
      {showCountdown && (
        <div
          className="reminder-card__progress"
          style={{ width: `${getReminderProgress(reminder, countdownNow!)}%` }}
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
});
