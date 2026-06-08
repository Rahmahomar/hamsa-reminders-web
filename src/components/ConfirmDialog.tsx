import { useRef } from "react";
import { useTranslation } from "../context/LocaleContext";
import { useDialog } from "../hooks/useDialog";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const resolvedConfirm = confirmLabel ?? t("common.confirm");
  const resolvedCancel = cancelLabel ?? t("common.cancel");

  useDialog(dialogRef, {
    closeOnEscape: !loading,
    onClose: onCancel,
  });

  return (
    <div
      className="confirm-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        tabIndex={-1}
      >
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
