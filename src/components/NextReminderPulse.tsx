import { useMemo } from "react";
import type { NextReminderPulseProps } from "../types/next-reminder-pulse";
import { useNow } from "../hooks/useNow";
import {
  formatCountdown,
  getNextPendingReminder,
  getReminderProgress,
} from "../utils/reminderTime";

export function NextReminderPulse({
  reminders,
  connected,
}: NextReminderPulseProps) {
  const next = useMemo(
    () => (connected ? getNextPendingReminder(reminders) : null),
    [connected, reminders]
  );

  const needsClock = connected && next !== null;
  const now = useNow(needsClock);

  if (!connected || !next) return null;

  const remaining = new Date(next.fireAt).getTime() - now;
  const progress = getReminderProgress(next, now);

  return (
    <div className="next-pulse" role="status" aria-live="polite">
      <span className="next-pulse__dot" aria-hidden />
      <div className="next-pulse__body">
        <span className="next-pulse__label">Next up</span>
        <strong className="next-pulse__title">{next.title}</strong>
      </div>
      <span className="next-pulse__time">{formatCountdown(remaining)}</span>
      <div className="next-pulse__track" aria-hidden>
        <div
          className="next-pulse__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
