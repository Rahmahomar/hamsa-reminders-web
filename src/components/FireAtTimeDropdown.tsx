import { useEffect, useId, useRef } from "react";

export type FireAtTimeOption = {
  value: number;
  label: string;
};

type FireAtTimeDropdownProps = {
  value: number;
  options: FireAtTimeOption[];
  onChange: (value: number) => void;
  ariaLabel: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FireAtTimeDropdown({
  value,
  options,
  onChange,
  ariaLabel,
  isOpen,
  onOpenChange,
}: FireAtTimeDropdownProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      onOpenChange(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, onOpenChange]);

  return (
    <div className="fire-at-picker__time-dropdown" ref={rootRef}>
      <button
        type="button"
        className={`fire-at-picker__time-trigger${isOpen ? " fire-at-picker__time-trigger--open" : ""}`}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => onOpenChange(!isOpen)}
      >
        <span className="fire-at-picker__time-trigger-value">
          {selected?.label ?? "—"}
        </span>
        <svg
          className="fire-at-picker__time-trigger-icon"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden
        >
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {isOpen ? (
        <ul
          id={listId}
          className="fire-at-picker__time-menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`fire-at-picker__time-option${isSelected ? " fire-at-picker__time-option--selected" : ""}`}
                  onClick={() => {
                    onChange(option.value);
                    onOpenChange(false);
                  }}
                >
                  {isSelected ? (
                    <span className="fire-at-picker__time-option-check" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                  <span>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
