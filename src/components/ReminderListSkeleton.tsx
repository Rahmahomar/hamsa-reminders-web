export function ReminderListSkeleton() {
  return (
    <div className="reminder-skeleton" aria-hidden>
      <div className="reminder-skeleton__card" />
      <div className="reminder-skeleton__card" />
      <div className="reminder-skeleton__card" />
    </div>
  );
}
