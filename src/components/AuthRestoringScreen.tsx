import "../styles/auth-restoring.css";

export function AuthRestoringScreen() {
  return (
    <div className="auth-restoring" role="status" aria-live="polite" aria-busy="true">
      <div className="auth-restoring__card">
        <div className="auth-restoring__spinner" aria-hidden />
        <p className="auth-restoring__text">Restoring your session…</p>
      </div>
    </div>
  );
}
