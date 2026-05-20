import type { LayoutProps } from "../types/layout";
import { Navbar } from "./Navbar";
import { PageBackground } from "./PageBackground";

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageBackground />
      <div className="page">
        <Navbar />
        {children}
      </div>
    </>
  );
}