import { useTranslation } from "../context/LocaleContext";
import type { RemindersPageHeaderProps } from "../types/reminders-page-header";

export function RemindersPageHeader({ onNewReminder }: RemindersPageHeaderProps) {
  const t = useTranslation();

  return (
    <header className="reminders-header">
      <div className="reminders-header__text">
        <h1 className="reminders-header__title">{t("remindersHeader.title")}</h1>
        <p className="reminders-header__subtitle">{t("remindersHeader.subtitle")}</p>
      </div>
      <button
        type="button"
        className="reminders-header__new"
        onClick={onNewReminder}
        aria-label={t("remindersHeader.newReminder")}
      >
        <span className="reminders-header__new-icon" aria-hidden>
          +
        </span>
        <span className="reminders-header__new-label">
          {t("remindersHeader.newReminder")}
        </span>
      </button>
    </header>
  );
}
