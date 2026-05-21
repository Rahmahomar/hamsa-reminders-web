import type { FiredReminderOverlayProps } from "../types/fired-reminder-overlay";

export function FiredReminderOverlay({
  reminder,
  onClose,
}: FiredReminderOverlayProps) {
  if (!reminder) return null;

  return (
    <div className="fired-overlay">
      <div className="confetti confetti-one" />
      <div className="confetti confetti-two" />
      <div className="confetti confetti-three" />

      <div className="fired-modal">
        <div className="fired-icon">🔔</div>

        <p className="eyebrow">REMINDER FIRED</p>

        <h2>{reminder.title}</h2>

        <p>{reminder.body || "Your reminder time has arrived."}</p>

        <small>
          {new Date(reminder.fireAt).toLocaleString()}
        </small>

        <button onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}