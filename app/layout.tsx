import type { ReactNode } from "react";

/*
 * The real root layout (<html>, fonts, providers) is app/[locale]/layout.tsx.
 * This pass-through exists so app/not-found.tsx can handle requests outside
 * any locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
