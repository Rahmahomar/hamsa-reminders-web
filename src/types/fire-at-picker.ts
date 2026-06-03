export const WEEKDAY_KEYS = [
  "fireAt.weekdays.su",
  "fireAt.weekdays.mo",
  "fireAt.weekdays.tu",
  "fireAt.weekdays.we",
  "fireAt.weekdays.th",
  "fireAt.weekdays.fr",
  "fireAt.weekdays.sa",
] as const;

export type FireAtPickerProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minDate?: Date;
  defaultExpanded?: boolean;
};

export type Preset = {
  id: string;
  labelKey: string;
  resolve: () => Date;
};
