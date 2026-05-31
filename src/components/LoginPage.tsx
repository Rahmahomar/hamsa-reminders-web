import type { FormEvent } from "react";

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
                Welcome back! Access your reminders workspace and continue scheduling.
              </p>
            </div>

            <form className="login-page__form" onSubmit={handleSubmit} noValidate>
              <div className="login-page__fields">
                <div className="login-page__field">
                  <label htmlFor="jwt-token" className="login-page__label">
                    Access token
                  </label>
                  <input
                    id="jwt-token"
                    type="text"
                    className="login-page__input"
                    placeholder="Enter your access token"
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
                  {connecting ? "Signing in…" : "Sign in"}
                </button>

                <p className="login-page__help">
                  Need a token?{" "}
                  <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                    Open Hamsa Console
                  </a>
                </p>

                <p className="login-page__legal">
                  By clicking continue, you agree to our{" "}
                  <a
                    href="https://tryhamsa.com/terms-and-services/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://tryhamsa.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
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
