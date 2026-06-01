import { CONSOLE_URL } from "../environment";
import type { NavbarProps } from "../types/navbar";
import { HamsaLogo } from "./HamsaLogo";
import { NavIcon } from "./NavIcon";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <header className="navbar navbar--app">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" aria-label="Hamsa Reminder home">
          <HamsaLogo />
        </a>

        <div className="navbar__end">
          <nav className="navbar__links" aria-label="Site sections">
            <a
              href="#dashboard"
              className="navbar__link navbar__link--active"
              aria-current="page"
              aria-label="Reminders"
            >
              <NavIcon name="calendar" />
              <span>Reminders</span>
            </a>
            <a
              href="https://tryhamsa.com/"
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Products"
            >
              <NavIcon name="box" />
              <span>Products</span>
            </a>
            <a
              href={CONSOLE_URL}
              className="navbar__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Console"
            >
              <NavIcon name="console" />
              <span>Console</span>
            </a>
          </nav>

          <ThemeToggle className="theme-toggle--compact" />

          {onLogout ? (
            <button
              type="button"
              className="navbar__logout"
              onClick={onLogout}
              aria-label="Log out"
            >
              <NavIcon name="logout" />
              <span>Log out</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
