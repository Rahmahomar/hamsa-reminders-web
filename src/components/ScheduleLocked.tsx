import { useTranslation } from "../context/LocaleContext";
import type { ScheduleLockedProps } from "../types/schedule-locked";

export function ScheduleLocked({ onCreateReminder }: ScheduleLockedProps) {
  const t = useTranslation();

  return (
    <div className="schedule-locked">
      <div className="schedule-locked__icon" aria-hidden>
        🔐
      </div>
      <p className="schedule-locked__title">{t("scheduleLocked.title")}</p>
      <p className="schedule-locked__text">{t("scheduleLocked.text")}</p>
      {onCreateReminder ? (
        <button
          type="button"
          className="schedule-locked__cta"
          onClick={onCreateReminder}
        >
          {t("scheduleLocked.cta")}
        </button>
      ) : null}
    </div>
  );
}
