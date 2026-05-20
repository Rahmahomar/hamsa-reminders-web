import { HamsaLogo } from "./HamsaLogo";

export function Navbar() {
  return (
    <nav className="navbar">
      <HamsaLogo />

      <div className="nav-links">
        <span>Projects</span>
        <span>Reminders</span>
        <span>Console</span>
      </div>
    </nav>
  );
}