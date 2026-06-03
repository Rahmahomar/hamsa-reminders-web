import { useTranslation } from "../context/LocaleContext";

export function ScheduleLocked() {
  const t = useTranslation();

  return (
    <div className="schedule-locked">
      <div className="schedule-locked__icon" aria-hidden>
        🔐
      </div>
      <p className="schedule-locked__title">{t("scheduleLocked.title")}</p>
      <p className="schedule-locked__text">{t("scheduleLocked.text")}</p>
      <a className="schedule-locked__cta" href="#connect">
        {t("scheduleLocked.cta")}
      </a>
    </div>
  );
}
