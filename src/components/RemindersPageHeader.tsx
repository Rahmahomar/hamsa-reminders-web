type RemindersPageHeaderProps = {
  onNewReminder: () => void;
};

export function RemindersPageHeader({ onNewReminder }: RemindersPageHeaderProps) {
  return (
    <header className="reminders-header">
      <div className="reminders-header__text">
        <h1 className="reminders-header__title">Reminders</h1>
        <p className="reminders-header__subtitle">
          Manage your reminders and stay on track.
        </p>
      </div>
      <button type="button" className="reminders-header__new" onClick={onNewReminder}>
        <span className="reminders-header__new-icon" aria-hidden>
          +
        </span>
        New Reminder
      </button>
    </header>
  );
}
