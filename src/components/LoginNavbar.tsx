import { HamsaAuthLogo } from "./HamsaAuthLogo";
import { ThemeToggle } from "./ThemeToggle";

export function LoginNavbar() {
  return (
    <header className="login-page__header">
      <div className="login-page__header-inner">
        <a href="/" className="login-page__header-brand" aria-label="Hamsa Reminder home">
          <HamsaAuthLogo />
        </a>
        <ThemeToggle className="theme-toggle--compact login-page__header-theme" />
      </div>
    </header>
  );
}
