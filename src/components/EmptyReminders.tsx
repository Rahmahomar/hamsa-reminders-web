export function EmptyReminders() {
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
