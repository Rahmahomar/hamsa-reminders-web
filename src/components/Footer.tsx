import { type FormEvent, useState } from "react";
import { HamsaLogo } from "./HamsaLogo";
import "../styles/footer.css";

const FOOTER_NAV_PRIMARY = [
  { label: "About", href: "https://tryhamsa.com/about" },
  { label: "Products", href: "https://tryhamsa.com/" },
  { label: "Solutions", href: "https://tryhamsa.com/" },
  { label: "Contact Us", href: "https://tryhamsa.com/contact/" },
] as const;

const FOOTER_NAV_LEGAL = [
  { label: "Terms & Services", href: "https://tryhamsa.com/terms-of-service" },
  { label: "Privacy & Policy", href: "https://tryhamsa.com/privacy-policy" },
  { label: "FAQs", href: "https://tryhamsa.com/#faqs" },
] as const;

const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
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
              aria-label="Hamsa — visit tryhamsa.com"
            >
              <HamsaLogo className="site-footer__logo" />
            </a>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            <ul className="site-footer__links">
              {FOOTER_NAV_PRIMARY.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="site-footer__links">
              {FOOTER_NAV_LEGAL.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__newsletter">
            <p className="site-footer__newsletter-title">
              Get News &amp; New Products Updates
            </p>
            <form className="site-footer__subscribe" onSubmit={handleSubscribe}>
              <label className="visually-hidden" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            &copy; Copyright {COPYRIGHT_YEAR}
          </p>
        </div>
      </div>
    </footer>
  );
}
