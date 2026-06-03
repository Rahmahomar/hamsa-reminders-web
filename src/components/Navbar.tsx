import { useTranslation } from "../context/LocaleContext";
import { CONSOLE_URL } from "../environment";
import type { NavbarProps } from "../types/navbar";
import { HamsaLogo } from "./HamsaLogo";
import { LanguageToggle } from "./LanguageToggle";
import { NavIcon } from "./NavIcon";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ onLogout }: NavbarProps) {
  const t = useTranslation();

  return (
    <header className="navbar navbar--app">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" aria-label={t("navbar.home")}>
          <HamsaLogo />
        </a>

        <div className="navbar__end">
          <nav className="navbar__links" aria-label={t("navbar.sections")}>
            <a
              href="#dashboard"
              className="navbar__link navbar__link--active"
              aria-current="page"
              aria-label={t("navbar.reminders")}
            >
              <NavIcon name="calendar" />
              <span>{t("navbar.reminders")}</span>
            </a>
            <a
              href="https://tryhamsa.com/"
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("navbar.products")}
            >
              <NavIcon name="box" />
              <span>{t("navbar.products")}</span>
            </a>
            <a
              href={CONSOLE_URL}
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("navbar.console")}
            >
              <NavIcon name="console" />
              <span>{t("navbar.console")}</span>
            </a>
          </nav>

          <div className="navbar__actions">
            <LanguageToggle className="language-toggle--compact" />
            <ThemeToggle className="theme-toggle--compact" />
            {onLogout ? (
              <button
                type="button"
                className="navbar__logout"
                onClick={onLogout}
                aria-label={t("navbar.logout")}
              >
                <NavIcon name="logout" />
                <span>{t("navbar.logout")}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
