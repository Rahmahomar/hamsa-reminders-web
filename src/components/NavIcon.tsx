type NavIconProps = {
  name: "calendar" | "box" | "console" | "logout";
  className?: string;
};

export function NavIcon({ name, className = "" }: NavIconProps) {
  return (
    <svg
      className={`navbar__icon${className ? ` ${className}` : ""}`}
      width="20"
      height="20"
      aria-hidden
    >
      <use href={`/nav-icons.svg#nav-${name}`} />
    </svg>
  );
}
