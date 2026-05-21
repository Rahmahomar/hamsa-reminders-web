import { useEffect } from "react";

const BASE_TITLE = "Hamsa Reminder";

export function usePageTitle(connected: boolean, pendingCount: number) {
  useEffect(() => {
    if (!connected) {
      document.title = `${BASE_TITLE} — Connect to get started`;
      return;
    }

    if (pendingCount > 0) {
      document.title = `${BASE_TITLE} — ${pendingCount} pending`;
      return;
    }

    document.title = `${BASE_TITLE} — Your schedule`;
  }, [connected, pendingCount]);
}
