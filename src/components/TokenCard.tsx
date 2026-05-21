import type { TokenCardProps } from "../types/token-card";

export function TokenCard({
  token,
  connected,
  connecting = false,
  onTokenChange,
  onConnect,
  onLogout,
}: TokenCardProps) {
  return (
    <div
      className={`token-card reveal reveal-delay-2${connected ? " token-card--connected" : ""}`}
    >
      {connected && (
        <div className="token-card__status">
          <span className="token-card__status-dot" aria-hidden />
          Connected — live sync on
        </div>
      )}

      <h3>JWT Access Token</h3>
      <p>Paste your generated token to test protected APIs.</p>

      <textarea
        placeholder="Paste JWT token here..."
        value={token}
        onChange={(e) => onTokenChange(e.target.value)}
        disabled={connecting}
      />

      <div className="token-card__actions">
        <button type="button" onClick={onConnect} disabled={connecting || !token.trim()}>
          {connecting ? "Connecting…" : connected ? "Refresh" : "Connect"}
        </button>
        {token.trim() ? (
          <button type="button" className="secondary" onClick={onLogout} disabled={connecting}>
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
}
