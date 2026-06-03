import type { FormEvent } from "react";

import { useTranslation } from "../context/LocaleContext";
import { CONSOLE_URL } from "../environment";
import type { LoginPageProps } from "../types/login-page";
import { HamsaAuthLogo } from "./HamsaAuthLogo";
import { LoginNavbar } from "./LoginNavbar";
import { LoginShowcase } from "./LoginShowcase";
import "../styles/login.css";

export function LoginPage({
  token,
  connecting = false,
  onTokenChange,
  onConnect,
}: LoginPageProps) {
  const t = useTranslation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!connecting && token.trim()) {
      onConnect();
    }
  };

  return (
    <div className="login-page">
      <LoginNavbar />

      <div className="login-page__shell">
        <section className="login-page__form-column" aria-labelledby="login-form-title">
          <div className="login-page__form-inner">
            <div className="login-page__brand-block">
              <HamsaAuthLogo className="login-page__brand-mark" />
              <p id="login-form-title" className="login-page__description">
                {t("login.description")}
              </p>
            </div>

            <form className="login-page__form" onSubmit={handleSubmit} noValidate>
              <div className="login-page__fields">
                <div className="login-page__field">
                  <label htmlFor="jwt-token" className="login-page__label">
                    {t("login.accessToken")}
                  </label>
                  <input
                    id="jwt-token"
                    type="text"
                    className="login-page__input"
                    placeholder={t("login.accessTokenPlaceholder")}
                    value={token}
                    onChange={(event) => onTokenChange(event.target.value)}
                    disabled={connecting}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="login-page__actions">
                <button
                  type="submit"
                  className="login-page__submit"
                  disabled={connecting || !token.trim()}
                >
                  {connecting ? t("login.signingIn") : t("login.signIn")}
                </button>

                <p className="login-page__help">
                  {t("login.needToken")}{" "}
                  <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                    {t("login.openConsole")}
                  </a>
                </p>

                <p className="login-page__legal">
                  {t("login.legalPrefix")}{" "}
                  <a
                    href="https://tryhamsa.com/terms-and-services/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("login.termsOfService")}
                  </a>{" "}
                  {t("login.legalAnd")}{" "}
                  <a
                    href="https://tryhamsa.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("login.privacyPolicy")}
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </section>

        <LoginShowcase />
      </div>
    </div>
  );
}
