import { useTranslation } from "../context/LocaleContext";
import type { EmptyRemindersProps } from "../types/empty-reminders";

export function EmptyReminders({ filtered = false }: EmptyRemindersProps) {
  const t = useTranslation();

  if (filtered) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden>
          🔔
        </div>
        <p className="empty-state__title">{t("emptyReminders.filteredTitle")}</p>
        <p className="empty-state__text">{t("emptyReminders.filteredText")}</p>
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
    </div>
  );
}
