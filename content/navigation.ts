/**
 * Site navigation. Routes are created in later phases; until then these
 * links resolve to the on-brand 404 page.
 */
export const mainNav = [
  { key: "product", href: "/product" },
  { key: "about", href: "/about" },
  { key: "whereToBuy", href: "/where-to-buy" },
  { key: "recipes", href: "/recipes" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const legalNav = [
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
] as const;

export const CART_HREF = "/cart";
export const PRODUCT_HREF = "/product";
