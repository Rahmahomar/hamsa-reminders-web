export function PageBackground() {
  return (
    <div className="page-background" aria-hidden>
      <div className="page-background__mesh" />
      <div className="page-background__glow" />
      <div className="page-background__orb page-background__orb--lime" />
      <div className="page-background__orb page-background__orb--purple" />
      <div className="page-background__orb page-background__orb--sky" />
      <div className="page-background__dot" />
      <div className="page-background__dot page-background__dot--accent" />
      <img
        className="page-background__waves page-background__waves--desktop"
        src="/hamsa-waves-desktop.svg"
        alt=""
      />
      <img
        className="page-background__waves page-background__waves--mobile"
        src="/hamsa-waves-mobile.svg"
        alt=""
      />
    </div>
  );
}
