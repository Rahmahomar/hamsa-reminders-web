import { useLocale } from "../context/LocaleContext";
import type { LanguageToggleProps } from "../types/language-toggle";
import "../styles/settings-toggle.css";
import "../styles/language-toggle.css";

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();
  const isAr = locale === "ar";

  const toggleLocale = () => {
    setLocale(isAr ? "en" : "ar");
  };

  return (
    <button
      type="button"
      className={`language-toggle${isAr ? " language-toggle--ar" : ""}${className ? ` ${className}` : ""}`}
      onClick={toggleLocale}
      aria-label={isAr ? t("language.switchToEn") : t("language.switchToAr")}
      title={isAr ? t("language.en") : t("language.ar")}
    >
      <span className="settings-toggle__row">
        <span className="language-toggle__icon" aria-hidden>
          <GlobeIcon />
        </span>
        <span className="language-toggle__track" aria-hidden>
          <span className="language-toggle__thumb" />
        </span>
        <span className="language-toggle__label">
          {isAr ? t("language.en") : t("language.ar")}
        </span>
      </span>
    </button>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
