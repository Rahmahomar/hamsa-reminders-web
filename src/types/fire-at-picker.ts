export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type FireAtPickerProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  minDate?: Date;
  defaultExpanded?: boolean;
};

export type Preset = {
  label: string;
  resolve: () => Date;
};
