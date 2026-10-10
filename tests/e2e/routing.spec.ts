import { expect, test } from "@playwright/test";

test.describe("locale routing", () => {
  test("/ redirects by Accept-Language, falling back to ka", async ({ request }) => {
    const en = await request.get("/", {
      headers: { "accept-language": "en-US,en;q=0.9" },
      maxRedirects: 0,
    });
    expect(en.status()).toBe(307);
    expect(en.headers().location).toMatch(/\/en$/);

    const ka = await request.get("/", {
      headers: { "accept-language": "ka-GE,ka;q=0.9" },
      maxRedirects: 0,
    });
    expect(ka.headers().location).toMatch(/\/ka$/);

    const other = await request.get("/", {
      headers: { "accept-language": "de-DE" },
      maxRedirects: 0,
    });
    expect(other.headers().location).toMatch(/\/ka$/);
  });

  test("sets <html lang>, hreflang alternates and localized metadata", async ({ page }) => {
    await page.goto("/ka/styleguide");
    await expect(page.locator("html")).toHaveAttribute("lang", "ka");
    await expect(page).toHaveTitle(/ნამიერი/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/styleguide$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

    await page.goto("/en/styleguide");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Styleguide · Namieri");
  });

  test("language switch keeps the current path", async ({ page, context, isMobile }) => {
    await context.addInitScript(() => localStorage.setItem("namieri:consent", "denied"));
    await page.goto("/ka/styleguide");
    if (isMobile) {
      // The header switch is hidden on phones; use the one in the footer.
      await page
        .locator("footer")
        .getByRole("link", { name: /English/ })
        .click();
    } else {
      await page
        .locator("header")
        .getByRole("link", { name: /English/ })
        .click();
    }
    await expect(page).toHaveURL(/\/en\/styleguide$/);
    await page
      .locator("footer")
      .getByRole("link", { name: /ქართული/ })
      .click();
    await expect(page).toHaveURL(/\/ka\/styleguide$/);
  });

  test("unknown paths render the localized 404", async ({ page }) => {
    const response = await page.goto("/en/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await page.goto("/ka/no-such-page");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("გვერდი ვერ მოიძებნა");
  });
});
