import { useCallback, useState } from "react";
import type { ToastProps } from "../types/toast";

type ToastTone = NonNullable<ToastProps["tone"]>;

export function useToast() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ToastTone>("info");

  const show = useCallback((text: string, nextTone: ToastTone = "info") => {
    setMessage(text);
    setTone(nextTone);
  }, []);

  const success = useCallback((text: string) => show(text, "success"), [show]);
  const error = useCallback((text: string) => show(text, "danger"), [show]);
  const clear = useCallback(() => setMessage(""), []);

  return { message, tone, show, success, error, clear };
}
