import type { LayoutProps } from "../types/layout";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageBackground } from "./PageBackground";

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PageBackground />
      <div className="page">
        <Navbar />
        <main id="main-content" className="page__content">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}