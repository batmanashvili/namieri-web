import { expect, test } from "@playwright/test";

const SECTIONS = [
  "colour",
  "type",
  "space",
  "motifs",
  "buttons",
  "content",
  "forms",
  "navigation",
  "feedback",
  "motion",
];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("namieri:consent", "denied"));
});

for (const locale of ["ka", "en"] as const) {
  test(`/${locale}/styleguide renders every chapter, token and the Coming soon card`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/styleguide`);
    for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toHaveCount(1);

    const swatches = page.locator("#colour li code.tabular");
    await expect(swatches).toHaveCount(14);
    await expect(swatches.first()).toHaveText("#0B1B36");

    await expect(page.locator("#type p[lang=ka]")).toHaveCount(9);
    await expect(page.locator("#type p[lang=en]")).toHaveCount(7);

    const comingSoon = locale === "ka" ? "მალე" : "Coming soon";
    await expect(
      page.locator("#content article").filter({ hasText: comingSoon }).first(),
    ).toBeVisible();
    await expect(page.locator("#content table").first()).toBeVisible();
  });
}

test("prices render with the ₾ sign in both languages", async ({ page }) => {
  await page.goto("/ka/styleguide");
  await expect(page.locator("#content").getByText("4,50 ₾").first()).toBeVisible();
  await page.goto("/en/styleguide");
  await expect(page.locator("#content").getByText("₾4.50").first()).toBeVisible();
});

test("no page is wider than the viewport and long Georgian headings wrap", async ({ page }) => {
  for (const path of ["/ka/styleguide", "/en/styleguide", "/ka", "/ka/missing"]) {
    await page.goto(path);
    const result = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflowing = [...document.querySelectorAll("h1, h2, h3, .font-display")].filter(
        // Skip visually hidden text (sr-only is 1 px wide by design).
        (el) => el.clientWidth > 1 && el.scrollWidth > el.clientWidth + 1,
      );
      const scrollers = [...document.querySelectorAll("table")].filter(
        (t) => t.parentElement!.scrollWidth > t.parentElement!.clientWidth + 1,
      );
      return {
        pageOverflow: doc.scrollWidth - doc.clientWidth,
        headings: overflowing.map((el) => el.textContent),
        scrollingTables: scrollers.length,
      };
    });
    expect(result.pageOverflow, path).toBeLessThanOrEqual(0);
    expect(result.headings, path).toEqual([]);
    expect(result.scrollingTables, path).toBe(0);
  }
});

test("dialogs trap focus and close on Escape", async ({ page }) => {
  await page.goto("/en/styleguide#feedback");
  const opener = page.getByRole("button", { name: "Open modal" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Delivery in Tbilisi" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("mobile menu opens full-screen and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu button is hidden on desktop");
  await page.goto("/ka/styleguide");
  await page.getByRole("banner").getByRole("button", { name: "მენიუს გახსნა" }).click();
  const menu = page.getByRole("dialog", { name: "მენიუ" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "ჩვენ შესახებ" })).toBeVisible();
  await menu.getByRole("button", { name: "მენიუს დახურვა" }).click();
  await expect(menu).toBeHidden();
});
