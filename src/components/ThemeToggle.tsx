import { useTranslation } from "../context/LocaleContext";
import { useTheme } from "../context/ThemeContext";
import type { ThemeToggleProps } from "../types/theme-toggle";
import "../styles/settings-toggle.css";
import "../styles/theme-toggle.css";

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const t = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle${className ? ` ${className}` : ""}`}
      onClick={toggleTheme}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      title={isDark ? t("theme.light") : t("theme.dark")}
    >
      <span className="settings-toggle__row">
        <span className="theme-toggle__icon" aria-hidden>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>
        <span className="theme-toggle__track" aria-hidden>
          <span className="theme-toggle__thumb" />
        </span>
        <span className="theme-toggle__label">
          {isDark ? t("theme.light") : t("theme.dark")}
        </span>
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4 7 7 0 1 0 20 14.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
