import { useTranslation } from "../context/LocaleContext";
import type { NotificationBannerProps } from "../types/notification-banner";

export function NotificationBanner({
  onRequestPermission,
  onDismiss,
}: NotificationBannerProps) {
  const t = useTranslation();

  return (
    <div className="notification-banner" role="status">
      <p>{t("notificationBanner.message")}</p>
      <div className="notification-banner__actions">
        <button type="button" className="primary-btn" onClick={onRequestPermission}>
          {t("notificationBanner.enable")}
        </button>
        <button type="button" className="secondary-btn" onClick={onDismiss}>
          {t("notificationBanner.dismiss")}
        </button>
      </div>
    </div>
  );
}
