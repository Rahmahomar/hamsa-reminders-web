import type { LayoutProps } from "../types/layout";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageBackground } from "./PageBackground";

export function Layout({ children, hideFooter = false, onLogout }: LayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PageBackground />
      <div className="page">
        <Navbar onLogout={onLogout} />
        <main id="main-content" className="page__content">
          {children}
        </main>
      </div>
      {!hideFooter ? <Footer /> : null}
    </>
  );
}