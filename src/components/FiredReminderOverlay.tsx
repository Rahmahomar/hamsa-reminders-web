import { useEffect } from "react";
import { useLocale, useTranslation } from "../context/LocaleContext";
import type { FiredReminderOverlayProps } from "../types/fired-reminder-overlay";

export function FiredReminderOverlay({
  reminder,
  onClose,
}: FiredReminderOverlayProps) {
  const { locale } = useLocale();
  const t = useTranslation();

  useEffect(() => {
    if (!reminder) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [reminder]);

  if (!reminder) return null;

  return (
    <div className="fired-overlay">
      <div className="confetti confetti-one" />
      <div className="confetti confetti-two" />
      <div className="confetti confetti-three" />

      <div className="fired-modal">
        <div className="fired-icon">🔔</div>

        <p className="eyebrow">{t("firedOverlay.eyebrow")}</p>

        <h2>{reminder.title}</h2>

        <p>{reminder.body || t("firedOverlay.bodyFallback")}</p>

        <small>{new Date(reminder.fireAt).toLocaleString(locale)}</small>

        <button onClick={onClose}>{t("firedOverlay.dismiss")}</button>
      </div>
    </div>
  );
}
