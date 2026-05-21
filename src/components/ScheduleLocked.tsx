export function ScheduleLocked() {
  return (
    <div className="schedule-locked">
      <div className="schedule-locked__icon" aria-hidden>
        🔐
      </div>
      <p className="schedule-locked__title">Connect to see your schedule</p>
      <p className="schedule-locked__text">
        Paste your JWT token and hit Connect. Your reminders and live updates will
        show up here.
      </p>
      <a className="schedule-locked__cta" href="#connect">
        Go to Connect
      </a>
    </div>
  );
}
