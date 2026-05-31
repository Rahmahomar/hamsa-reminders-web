import { CONSOLE_URL } from "../environment";
import type { NavbarProps } from "../types/navbar";
import { HamsaLogo } from "./HamsaLogo";

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <a href="/" className="navbar__brand" aria-label="Hamsa Reminder home">
        <HamsaLogo />
      </a>

      <div className="nav-links">
        <a href="#dashboard" aria-current="page">
          Reminders
        </a>
        <a href="https://tryhamsa.com/" target="_blank" rel="noopener noreferrer">
          Products
        </a>
        <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
          Console
        </a>
        {onLogout ? (
          <button type="button" className="navbar__logout" onClick={onLogout}>
            Log out
          </button>
        ) : null}
      </div>
    </nav>
  );
}
