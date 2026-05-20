import { useEffect, useState } from "react";
import type { NextReminderPulseProps } from "../types/next-reminder-pulse";
import {
  formatCountdown,
  getNextPendingReminder,
  getReminderProgress,
} from "../utils/reminderTime";

export function NextReminderPulse({
  reminders,
  connected,
}: NextReminderPulseProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!connected) return null;

  const next = getNextPendingReminder(reminders);
  if (!next) return null;

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
