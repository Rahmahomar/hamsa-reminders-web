type NotificationBannerProps = {
  onRequestPermission: () => void;
  onDismiss: () => void;
};

export function NotificationBanner({
  onRequestPermission,
  onDismiss,
}: NotificationBannerProps) {
  return (
    <div className="notification-banner" role="status">
      <p>
        Enable browser notifications to get alerted when a reminder fires.
      </p>
      <div className="notification-banner__actions">
        <button type="button" className="primary-btn" onClick={onRequestPermission}>
          Enable
        </button>
        <button type="button" className="secondary-btn" onClick={onDismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}
