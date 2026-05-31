import { HamsaAuthLogo } from "./HamsaAuthLogo";

export function LoginNavbar() {
  return (
    <header className="login-page__header">
      <div className="login-page__header-inner">
        <a href="/" className="login-page__header-brand" aria-label="Hamsa Reminder home">
          <HamsaAuthLogo />
        </a>
      </div>
    </header>
  );
}
