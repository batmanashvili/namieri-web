import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type SiteShellProps = {
  /** overlay for pages that open with a navy hero; solid elsewhere. */
  headerVariant?: "overlay" | "solid";
  /** Optional AnnouncementBar, rendered above the header. */
  announcement?: ReactNode;
  /** Optional StickyMobileCTA, rendered after the footer. */
  stickyCta?: ReactNode;
  children: ReactNode;
};

/** Header, <main id="main"> and footer: the frame every page uses. */
export function SiteShell({
  headerVariant = "solid",
  announcement,
  stickyCta,
  children,
}: SiteShellProps) {
  return (
    <>
      {announcement}
      <Header variant={headerVariant} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      {stickyCta}
    </>
  );
}
