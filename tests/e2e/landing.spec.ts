import { expect, test, type Page } from "@playwright/test";

const locales = ["ka", "en"] as const;
const PAGES = ["", "/about", "/where-to-buy", "/contact", "/faq", "/terms", "/privacy"];
const WIDTHS = [360, 768, 1280, 1920];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem("namieri:consent", "denied"));
});

/** Scrolls to the end so Reveal, CountUp and lazy content run. */
async function scrollThrough(page: Page) {
  for (let i = 0; i < 120; i++) {
    const done = await page.evaluate(() => {
      window.scrollBy({ top: 700, behavior: "instant" });
      return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    });
    if (done) break;
    await page.waitForTimeout(20);
  }
}

/**
 * Headings whose last line holds a single short word (under half the widest
 * line) while the line above holds three or more: an orphan. A long Georgian
 * word that fills its own line is not one. Measured from the rendered word boxes.
 */
function findOrphans(page: Page) {
  return page.evaluate(() => {
    const orphans: string[] = [];
    for (const heading of document.querySelectorAll<HTMLElement>("h1, h2, h3")) {
      if (!heading.offsetParent) continue;
      const words: { top: number; left: number; right: number }[] = [];
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? "";
        for (const match of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const rect = range.getClientRects()[0];
          if (rect && rect.width > 0)
            words.push({ top: Math.round(rect.top), left: rect.left, right: rect.right });
        }
      }
      const tops = [...new Set(words.map((w) => w.top))];
      if (tops.length < 2) continue;
      const line = (top: number) => words.filter((w) => Math.abs(w.top - top) < 4);
      const width = (ws: typeof words) =>
        Math.max(...ws.map((w) => w.right)) - Math.min(...ws.map((w) => w.left));
      const last = line(tops.at(-1)!);
      const previous = line(tops.at(-2)!);
      const widest = Math.max(...tops.map((t) => width(line(t))));
      if (last.length === 1 && previous.length >= 3 && width(last) < widest / 2)
        orphans.push(heading.textContent?.trim() ?? "");
    }
    return orphans;
  });
}

test.describe("home page", () => {
  for (const locale of locales) {
    test(`/${locale} renders every landing section in order`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("[data-announcement]")).toBeVisible();
      const ids = await page
        .locator("main > section[id]")
        .evaluateAll((sections) => sections.map((s) => s.id));
      // "reviews" is hidden while content/testimonials.ts is empty.
      expect(ids).toEqual([
        "hero",
        "ingredients",
        "numbers",
        "process",
        "why",
        "moments",
        "sizes",
        "quality",
        "kitchen",
        "where-to-buy",
        "faq",
      ]);
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      for (const id of ids) {
        await expect(page.locator(`#${id}`)).toHaveAttribute("aria-labelledby", /.+/);
      }
    });
  }

  test("size cards: two orderable sizes and a Coming soon card with no price or link", async ({
    page,
  }) => {
    await page.goto("/en");
    const cards = page.locator("#sizes li[data-size]");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0).getByRole("link")).toHaveAttribute(
      "href",
      "/en/product?size=cup-150",
    );
    await expect(cards.nth(1).getByRole("link")).toHaveAttribute(
      "href",
      "/en/product?size=tub-500",
    );
    await expect(cards.nth(0)).toContainText("₾4.50");
    const soon = page.locator('#sizes li[data-size="coming-soon"]');
    await expect(soon).toContainText("Coming soon");
    await expect(soon.getByRole("link")).toHaveCount(0);
    await expect(soon).not.toContainText("₾");
  });

  test("every Order now links to the product page", async ({ page }) => {
    await page.goto("/en");
    const links = page.getByRole("link", { name: "Order now" });
    expect(await links.count()).toBeGreaterThan(0);
    for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute("href"))))
      expect(href).toBe("/en/product");
  });

  test("publishes Organization and FAQPage structured data", async ({ page }) => {
    await page.goto("/ka");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((els) => els.map((e) => JSON.parse(e.textContent ?? "{}")));
    const types = blocks.map((b) => b["@type"]);
    expect(types).toContain("Organization");
    const faqPage = blocks.find((b) => b["@type"] === "FAQPage");
    expect(faqPage.mainEntity).toHaveLength(6);
    expect(faqPage.mainEntity[0].name).toBe("როგორ შევინახო?");
    await expect(page.locator("#faq h3 button")).toHaveCount(6);
    await expect(page.locator("#faq").getByRole("link", { name: "ყველა კითხვა" })).toHaveAttribute(
      "href",
      "/ka/faq",
    );
  });

  test("records CTA and size clicks once analytics is accepted", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("namieri:consent", "granted"));
    await page.goto("/en");
    // Keep the page here: cancel navigation in the capture phase; React's handlers still run.
    await page.evaluate(() =>
      document.addEventListener("click", (e) => e.preventDefault(), { capture: true }),
    );
    await page.locator("#hero").getByRole("link", { name: "Order now" }).click();
    await page.locator("#sizes").getByRole("link", { name: "Choose 500 g" }).click();
    const events = await page.evaluate(() =>
      window.dataLayer?.filter((e) => e.event !== "consent_granted"),
    );
    expect(events).toEqual([
      { event: "cta_order_click", section: "hero" },
      { event: "select_size_from_landing", item_id: "tub-500", section: "sizes" },
    ]);
  });
});

test.describe("mobile sticky CTA", () => {
  test("appears after the hero leaves the screen, with the lowest price", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "phones only");
    await page.goto("/ka");
    const bar = page.getByRole("complementary", { name: "სწრაფი შეკვეთა" });
    await expect(bar).toHaveAttribute("inert", "");
    await page.locator("#ingredients").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: "instant" }));
    await expect(bar).not.toHaveAttribute("inert", "");
    await expect(bar).toContainText("4,50 ₾-დან");
    await expect(bar.getByRole("link", { name: "შეუკვეთე ახლა" })).toHaveAttribute(
      "href",
      "/ka/product",
    );
  });
});

test.describe("layout at 360, 768, 1280 and 1920 px", () => {
  test.skip(({ isMobile }) => isMobile, "runs once, on the desktop project");
  test.setTimeout(240_000);

  for (const locale of locales) {
    test(`/${locale}: no overflow and no orphaned heading words`, async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        for (const path of PAGES) {
          await page.goto(`/${locale}${path}`);
          await scrollThrough(page);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          );
          expect(overflow, `${width}px /${locale}${path}`).toBeLessThanOrEqual(0);
          expect(await findOrphans(page), `${width}px /${locale}${path}`).toEqual([]);
        }
      }
    });
  }
});

test.describe("reduced motion on the landing page", () => {
  test.use({ reducedMotion: "reduce" });

  test("the pinned scene is a static illustration and counters show final values", async ({
    page,
  }) => {
    await page.goto("/en");
    await scrollThrough(page);
    const scene = page.locator("#ingredients");
    expect(
      await scene.locator("[data-pinned]").evaluate((el) => el.getBoundingClientRect().height),
    ).toBeLessThan(await page.evaluate(() => window.innerHeight * 1.5));
    await expect(scene.getByRole("heading", { level: 2 })).toHaveCSS("opacity", "1");
    await expect(scene.getByText("Live cultures").last()).toBeVisible();
    // The visible counter (not the width-reserving or screen-reader copies) holds the final value.
    const counters = await page
      .locator('#numbers [class*="inline-grid"] > span:nth-child(2)')
      .allTextContents();
    expect(counters).toEqual(["18", "0", "64", "2"]);
  });
});

test.describe("information pages", () => {
  test("each page has its own title, description and share image", async ({ page }) => {
    const seen = new Set<string>();
    for (const path of ["/about", "/where-to-buy", "/contact", "/faq"]) {
      await page.goto(`/en${path}`);
      const title = await page.title();
      expect(seen.has(title)).toBe(false);
      seen.add(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
        "content",
        new RegExp(`/en${path}/opengraph-image`),
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
    }
    const image = await page.request.get("/en/faq/opengraph-image");
    expect(image.headers()["content-type"]).toBe("image/png");
  });

  test("where to buy shows the Wolt card, DM buttons and the empty store list", async ({
    page,
  }) => {
    await page.goto("/en/where-to-buy");
    await expect(page.locator('[data-channel="wolt"]')).toContainText("Namieri Saburtalo");
    await expect(page.getByRole("link", { name: /Message on Instagram/ })).toHaveAttribute(
      "href",
      "https://ig.me/m/namieri.ge",
    );
    await expect(page.getByText("Stores coming soon")).toBeVisible();
  });

  test("FAQ lists every question with FAQPage data", async ({ page }) => {
    await page.goto("/en/faq");
    const questions = page.locator("main h3 button");
    expect(await questions.count()).toBeGreaterThanOrEqual(7);
    await questions.filter({ hasText: "cancel" }).click();
    await expect(page.getByText("we can't accept returns once delivered")).toBeVisible();
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}",
    );
    expect(data.mainEntity).toHaveLength(await questions.count());
  });

  for (const slug of ["terms", "privacy"]) {
    test(`/${slug} renders the Markdown draft, kept out of search`, async ({ page }) => {
      for (const locale of locales) {
        await page.goto(`/${locale}/${slug}`);
        await expect(page.locator("[data-draft]")).toBeVisible();
        await expect(page.locator(".legal-prose h2").first()).toBeVisible();
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      }
    });
  }

  test("there is no returns or refund page", async ({ page }) => {
    for (const path of ["/en/returns", "/en/refund"]) {
      expect((await page.goto(path))?.status()).toBe(404);
    }
  });
});

test.describe("contact page", () => {
  test("the map loads only after a click", async ({ page }) => {
    await page.goto("/en/contact");
    const map = page.locator("[data-map]");
    await expect(map).toHaveAttribute("data-map", "placeholder");
    await expect(map.locator("iframe")).toHaveCount(0);
    await page.route("https://www.google.com/**", (route) => route.fulfill({ body: "" }));
    await map.getByRole("button", { name: "Show map" }).click();
    await expect(map.locator("iframe")).toHaveAttribute(
      "src",
      /google\.com\/maps\?q=25%20Niko%20Buri/,
    );
  });

  test("the map loads straight away once cookies are accepted", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("namieri:consent", "granted"));
    await page.route("https://www.google.com/**", (route) => route.fulfill({ body: "" }));
    await page.goto("/en/contact");
    await expect(page.locator("[data-map]")).toHaveAttribute("data-map", "loaded");
  });

  test("the wholesale form validates on blur and on submit", async ({ page }) => {
    await page.goto("/en/contact");
    const form = page.getByRole("form", { name: "Wholesale enquiry" });
    const phone = form.getByLabel("Mobile number");
    await phone.fill("12");
    await phone.blur();
    await expect(form.getByText("Enter a 9-digit Georgian mobile number")).toBeVisible();
    await phone.fill("574077779");
    await expect(form.getByText("Enter a 9-digit Georgian mobile number")).toHaveCount(0);

    await form.getByRole("button", { name: "Send enquiry" }).click();
    await expect(form.getByText(/Please check \d+ fields below/)).toBeVisible();
    await expect(form.getByLabel("Business name")).toBeFocused();
    await expect(form).not.toContainText("₾");
  });

  test("a valid enquiry is queued and shows the success state", async ({ page }) => {
    await page.goto("/ka/contact");
    const form = page.locator("form").filter({ has: page.getByLabel("ბიზნესის სახელი") });
    await form.getByLabel("ბიზნესის სახელი").fill("ტესტ მარკეტი");
    await form.getByLabel("საკონტაქტო პირი").fill("ნინო");
    await form.getByLabel("მობილურის ნომერი").fill("599123456");
    await form.getByLabel("ბიზნესის ტიპი").selectOption("shop");
    await form.getByLabel("რაიონი").selectOption("saburtalo");
    await form.getByLabel(/150 გ/).check();
    await form.getByLabel(/ვეთანხმები/).check();
    await form.getByRole("button", { name: "მოთხოვნის გაგზავნა" }).click();
    await expect(page.getByRole("status").filter({ hasText: "გმადლობთ" })).toBeVisible();
    await page.getByRole("button", { name: "ახალი მოთხოვნის გაგზავნა" }).click();
    await expect(page.getByLabel("ბიზნესის სახელი")).toHaveValue("");
  });
});
