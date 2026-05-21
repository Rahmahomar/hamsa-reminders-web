import type { EmptyRemindersProps } from "../types/empty-reminders";

export function EmptyReminders({ filtered = false }: EmptyRemindersProps) {
  if (filtered) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden>
          🔔
        </div>
        <p className="empty-state__title">No reminders here</p>
        <p className="empty-state__text">
          Try another filter or clear your search to see more items.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden>
        🔔
      </div>
      <p className="empty-state__title">No reminders yet</p>
      <p className="empty-state__text">
        Create your first one — your future self will thank you.
      </p>
    </div>
  );
}
