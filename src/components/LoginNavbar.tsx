import { useTranslation } from "../context/LocaleContext";
import { HamsaAuthLogo } from "./HamsaAuthLogo";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

export function LoginNavbar() {
  const t = useTranslation();

  return (
    <header className="login-page__header">
      <div className="login-page__header-inner">
        <a href="/" className="login-page__header-brand" aria-label={t("navbar.home")}>
          <HamsaAuthLogo />
        </a>
        <div className="login-page__header-actions">
          <LanguageToggle className="language-toggle--compact" />
          <ThemeToggle className="theme-toggle--compact login-page__header-theme" />
        </div>
      </div>
    </header>
  );
}
