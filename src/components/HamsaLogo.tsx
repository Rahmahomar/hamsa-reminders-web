import {
  HAMSA_WORDMARK_BADGE_PATH,
  HAMSA_WORDMARK_HAMSA_PATH,
  HAMSA_WORDMARK_VIEWBOX,
} from "../assets/hamsaWordmark";
import type { HamsaLogoProps } from "../types/hamsa-logo";
import "../styles/brand.css";

export function HamsaLogo({ className = "" }: HamsaLogoProps) {
  return (
    <svg
      className={`brand__img${className ? ` ${className}` : ""}`}
      viewBox={HAMSA_WORDMARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hamsa Reminder"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={HAMSA_WORDMARK_HAMSA_PATH} fill="currentColor" />
      <path d={HAMSA_WORDMARK_BADGE_PATH} fill="#97DE00" />
      <text
        x="451"
        y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#060606"
        fontFamily="var(--font-body)"
        fontSize="24"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="0.02em"
      >
        REMINDER
      </text>
    </svg>
  );
}
