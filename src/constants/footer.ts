export const FOOTER_NAV_PRIMARY = [
  { labelKey: "footer.nav.about", href: "https://tryhamsa.com/about" },
  { labelKey: "footer.nav.products", href: "https://tryhamsa.com/" },
  { labelKey: "footer.nav.solutions", href: "https://tryhamsa.com/" },
  { labelKey: "footer.nav.contactUs", href: "https://tryhamsa.com/contact/" },
] as const;

export const FOOTER_NAV_LEGAL = [
  { labelKey: "footer.nav.terms", href: "https://tryhamsa.com/terms-of-service" },
  { labelKey: "footer.nav.privacy", href: "https://tryhamsa.com/privacy-policy" },
  { labelKey: "footer.nav.faqs", href: "https://tryhamsa.com/#faqs" },
] as const;

export const COPYRIGHT_YEAR = new Date().getFullYear();
