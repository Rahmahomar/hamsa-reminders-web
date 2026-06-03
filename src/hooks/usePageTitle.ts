import { useEffect } from "react";

import { useTranslation } from "../context/LocaleContext";

export function usePageTitle(connected: boolean, pendingCount: number) {
  const t = useTranslation();

  useEffect(() => {
    const base = t("common.hamsaReminder");

    if (!connected) {
      document.title = `${base} — ${t("pageTitle.connect")}`;
      return;
    }

    if (pendingCount > 0) {
      document.title = `${base} — ${t("pageTitle.pending", { count: pendingCount })}`;
      return;
    }

    document.title = `${base} — ${t("pageTitle.schedule")}`;
  }, [connected, pendingCount, t]);
}
