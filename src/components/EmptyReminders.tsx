import { useTranslation } from "../context/LocaleContext";
import type { EmptyRemindersProps } from "../types/empty-reminders";

export function EmptyReminders({
  filtered = false,
  onCreateReminder,
  onClearFilters,
}: EmptyRemindersProps) {
  const t = useTranslation();

  if (filtered) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden>
          🔔
        </div>
        <p className="empty-state__title">{t("emptyReminders.filteredTitle")}</p>
        <p className="empty-state__text">{t("emptyReminders.filteredText")}</p>
        {onClearFilters ? (
          <div className="empty-state__actions">
            <button
              type="button"
              className="empty-state__cta secondary"
              onClick={onClearFilters}
            >
              {t("emptyReminders.clearFiltersCta")}
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden>
        🔔
      </div>
      <p className="empty-state__title">{t("emptyReminders.defaultTitle")}</p>
      <p className="empty-state__text">{t("emptyReminders.defaultText")}</p>
      {onCreateReminder ? (
        <div className="empty-state__actions">
          <button
            type="button"
            className="empty-state__cta primary"
            onClick={onCreateReminder}
          >
            {t("emptyReminders.createCta")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
