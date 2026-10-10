import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

// Locale negotiation and redirects for every page request.
export const proxy = createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes, generated icons and any path with a file extension.
  matcher: "/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)",
};
