import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/toast.css";
import type { ToastProps } from "../types/toast";

export function Toast({
  message,
  tone = "info",
  onClose,
  durationMs = 4000,
}: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const onCloseRef = useRef(onClose);
  const dismissTimerRef = useRef<number | null>(null);

  onCloseRef.current = onClose;

  const dismiss = () => {
    if (dismissTimerRef.current !== null) return;
    setExiting(true);
    dismissTimerRef.current = window.setTimeout(() => {
      dismissTimerRef.current = null;
      onCloseRef.current?.();
    }, 220);
  };

  useEffect(() => {
    setExiting(false);
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }

    const autoHide = window.setTimeout(dismiss, durationMs);
    return () => window.clearTimeout(autoHide);
  }, [message, durationMs]);

  return createPortal(
    <div
      className={`toast toast-${tone}${exiting ? " toast-exit" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-content">{message}</div>
      <button
        className="toast-close"
        type="button"
        onClick={dismiss}
        aria-label="Close"
      >
        ×
      </button>
    </div>,
    document.body
  );
}
