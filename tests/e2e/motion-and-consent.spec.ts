import { expect, test } from "@playwright/test";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("removes all animation", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/en/styleguide");
    // Scroll the whole page so every Reveal, Parallax and CountUp gets a chance to run.
    for (let i = 0; i < 80; i++) {
      const done = await page.evaluate((step) => {
        window.scrollBy(0, step);
        return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      }, 800);
      if (done) break;
      await page.waitForTimeout(25);
    }
    const state = await page.evaluate(() => ({
      running: document
        .getAnimations()
        .filter(
          (a) => a.playState === "running" && Number(a.effect?.getComputedTiming().duration) > 1,
        ).length,
      hiddenReveals: document.querySelectorAll('[data-reveal="hidden"]').length,
      pinnedHeight: (document.querySelector("[data-pinned]") as HTMLElement).style.height,
      transformed: [...document.querySelectorAll("[data-parallax] > *")].filter(
        (el) => getComputedStyle(el).transform !== "none",
      ).length,
    }));
    expect(state).toEqual({ running: 0, hiddenReveals: 0, pinnedHeight: "", transformed: 0 });
  });
});

test.describe("analytics consent", () => {
  test("sends nothing until consent, then starts the data layer", async ({ page }) => {
    await page.goto("/en/styleguide");
    const banner = page.getByRole("region", { name: "Cookie consent" });
    await expect(banner).toBeVisible();
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();

    await banner.getByRole("button", { name: "Accept analytics" }).click();
    await expect(banner).toBeHidden();
    expect(await page.evaluate(() => window.dataLayer?.map((e) => e.event))).toEqual([
      "consent_granted",
    ]);

    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toHaveCount(0);
  });

  test("declining keeps the data layer empty", async ({ page }) => {
    await page.goto("/ka/styleguide");
    await page.getByRole("button", { name: "უარი" }).click();
    await page.reload();
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  });
});
