/**
 * Site navigation. /product arrives in Phase 3 (until then it resolves to the
 * on-brand 404 page). Recipes stay out of the nav until a /recipes page exists;
 * the landing page links recipe cards to Instagram instead.
 */
export const mainNav = [
  { key: "product", href: "/product" },
  { key: "about", href: "/about" },
  { key: "whereToBuy", href: "/where-to-buy" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const legalNav = [
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
] as const;

export const CART_HREF = "/cart";
export const PRODUCT_HREF = "/product";
