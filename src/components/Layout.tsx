import type { LayoutProps } from "../types/layout";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageBackground } from "./PageBackground";

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageBackground />
      <div className="page">
        <Navbar />
        <div className="page__content">{children}</div>
      </div>
      <Footer />
    </>
  );
}