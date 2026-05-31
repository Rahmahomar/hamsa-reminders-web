import { useEffect, useState } from "react";

let now = Date.now();
const listeners = new Set<() => void>();
let intervalId: number | null = null;

function ensureInterval() {
  if (intervalId !== null) return;
  intervalId = window.setInterval(() => {
    now = Date.now();
    listeners.forEach((listener) => listener());
  }, 1000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  ensureInterval();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };
}

/** Single shared 1s clock — avoids duplicate timers across components. */
export function useNow(enabled = true): number {
  const [tick, setTick] = useState(() => (enabled ? now : Date.now()));

  useEffect(() => {
    if (!enabled) return;
    setTick(now);
    return subscribe(() => setTick(now));
  }, [enabled]);

  return enabled ? tick : Date.now();
}
