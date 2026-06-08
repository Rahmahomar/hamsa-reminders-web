import { useTranslation } from "../context/LocaleContext";
import type { LayoutProps } from "../types/layout";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageBackground } from "./PageBackground";

export function Layout({ children, hideFooter = false, onLogout }: LayoutProps) {
  const t = useTranslation();

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("layout.skipToContent")}
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
