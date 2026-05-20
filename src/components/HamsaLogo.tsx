import {
  HAMSA_WORDMARK_BADGE_PATH,
  HAMSA_WORDMARK_HAMSA_PATH,
  HAMSA_WORDMARK_VIEWBOX,
} from "../assets/hamsaWordmark";
import "../styles/brand.css";

type HamsaLogoProps = {
  className?: string;
};

const HAMSA_TEXT_SCALE = 0.92;
const HAMSA_TEXT_ORIGIN = { x: 377, y: 46.865 };

export function HamsaLogo({ className = "" }: HamsaLogoProps) {
  const hamsaTransform = `translate(${HAMSA_TEXT_ORIGIN.x} ${HAMSA_TEXT_ORIGIN.y}) scale(${HAMSA_TEXT_SCALE}) translate(${-HAMSA_TEXT_ORIGIN.x} ${-HAMSA_TEXT_ORIGIN.y})`;

  return (
    <svg
      className={`brand__img${className ? ` ${className}` : ""}`}
      viewBox={HAMSA_WORDMARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hamsa Reminder"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={hamsaTransform}>
        <path d={HAMSA_WORDMARK_HAMSA_PATH} fill="currentColor" />
      </g>
      <path d={HAMSA_WORDMARK_BADGE_PATH} fill="#97DE00" />
      <text
        x="451"
        y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
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
