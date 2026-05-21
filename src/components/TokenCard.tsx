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
      id="connect"
      className={`token-card reveal reveal-delay-2${connected ? " token-card--connected" : ""}`}
    >
      {connected && (
        <div className="token-card__status" role="status">
          <span className="token-card__status-dot" aria-hidden />
          Connected — live sync on
        </div>
      )}

      <h3>JWT Access Token</h3>
      <p>Paste your generated token to test protected APIs.</p>

      {!connected && (
        <ol className="token-card__steps" aria-label="How to connect">
          <li className="token-card__step">
            <span className="token-card__step-num" aria-hidden>
              1
            </span>
            <span>Open the Hamsa Console and copy your project JWT.</span>
          </li>
          <li className="token-card__step">
            <span className="token-card__step-num" aria-hidden>
              2
            </span>
            <span>Paste it below and press Connect.</span>
          </li>
          <li className="token-card__step">
            <span className="token-card__step-num" aria-hidden>
              3
            </span>
            <span>Create reminders — they appear in Your Schedule instantly.</span>
          </li>
        </ol>
      )}

      <label className="sr-only" htmlFor="jwt-token">
        JWT access token
      </label>
      <textarea
        id="jwt-token"
        placeholder="Paste JWT token here..."
        value={token}
        onChange={(e) => onTokenChange(e.target.value)}
        disabled={connecting}
        autoComplete="off"
        spellCheck={false}
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
