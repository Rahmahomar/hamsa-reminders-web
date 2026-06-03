import { type FormEvent, useState } from "react";
import {
  COPYRIGHT_YEAR,
  FOOTER_NAV_LEGAL,
  FOOTER_NAV_PRIMARY,
} from "../constants/footer";
import { useTranslation } from "../context/LocaleContext";
import { HamsaLogo } from "./HamsaLogo";
import "../styles/footer.css";

export function Footer() {
  const t = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a
              href="https://tryhamsa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__logo-link"
              aria-label={t("footer.logoAria")}
            >
              <HamsaLogo className="site-footer__logo" />
            </a>
          </div>

          <nav className="site-footer__nav" aria-label={t("footer.navAria")}>
            <ul className="site-footer__links">
              {FOOTER_NAV_PRIMARY.map((item) => (
                <li key={item.labelKey}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="site-footer__links">
              {FOOTER_NAV_LEGAL.map((item) => (
                <li key={item.labelKey}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__newsletter">
            <p className="site-footer__newsletter-title">{t("footer.newsletterTitle")}</p>
            <form className="site-footer__subscribe" onSubmit={handleSubscribe}>
              <label className="visually-hidden" htmlFor="footer-email">
                {t("footer.emailLabel")}
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                placeholder={t("footer.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button type="submit">{t("footer.subscribe")}</button>
            </form>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            {t("footer.copyright", { year: COPYRIGHT_YEAR })}
          </p>
        </div>
      </div>
    </footer>
  );
}
