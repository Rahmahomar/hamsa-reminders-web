import { useRef } from "react";
import { useLocale, useTranslation } from "../context/LocaleContext";
import { useDialog } from "../hooks/useDialog";
import type { FiredReminderOverlayProps } from "../types/fired-reminder-overlay";

export function FiredReminderOverlay({
  reminder,
  onClose,
}: FiredReminderOverlayProps) {
  const { locale } = useLocale();
  const t = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = "fired-reminder-title";

  useDialog(dialogRef, {
    enabled: reminder !== null,
    onClose,
  });

  if (!reminder) return null;

  return (
    <div className="fired-overlay" role="presentation">
      <div className="confetti confetti-one" aria-hidden />
      <div className="confetti confetti-two" aria-hidden />
      <div className="confetti confetti-three" aria-hidden />

      <div
        ref={dialogRef}
        className="fired-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="fired-icon" aria-hidden>
          🔔
        </div>

        <p className="eyebrow">{t("firedOverlay.eyebrow")}</p>

        <h2 id={titleId}>{reminder.title}</h2>

        <p>{reminder.body || t("firedOverlay.bodyFallback")}</p>

        <small>{new Date(reminder.fireAt).toLocaleString(locale)}</small>

        <button type="button" onClick={onClose}>
          {t("firedOverlay.dismiss")}
        </button>
      </div>
    </div>
  );
}
