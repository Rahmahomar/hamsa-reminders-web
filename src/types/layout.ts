import type { ReactNode } from "react";

export type LayoutProps = {
  children: ReactNode;
  hideFooter?: boolean;
  onLogout?: () => void;
};
