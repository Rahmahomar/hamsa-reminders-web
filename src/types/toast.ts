export type ToastProps = {
  message: string;
  tone?: "success" | "info" | "danger";
  onClose?: () => void;
  durationMs?: number;
};
