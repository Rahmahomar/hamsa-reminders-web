import { useEffect, useRef, type RefObject } from "react";
import { getFocusableElements, trapTabKey } from "../utils/focusTrap";

type UseDialogOptions = {
  enabled?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
};

export function useDialog(
  containerRef: RefObject<HTMLElement | null>,
  { enabled = true, closeOnEscape = true, onClose }: UseDialogOptions = {}
): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!enabled) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frameId = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      (focusable[0] ?? container).focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      const container = containerRef.current;
      if (container && event.key === "Tab") {
        trapTabKey(event, container);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [enabled, closeOnEscape, containerRef]);
}
