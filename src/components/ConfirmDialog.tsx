import { useEffect } from "react";
import { useTranslation } from "../context/LocaleContext";
import type { ConfirmDialogProps } from "../types/confirm-dialog";
import "../styles/confirm.css";

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTranslation();
  const resolvedConfirm = confirmLabel ?? t("common.confirm");
  const resolvedCancel = cancelLabel ?? t("common.cancel");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, loading]);

  return (
    <div
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="confirm-dialog">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            className="danger"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? t("common.pleaseWait") : resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
