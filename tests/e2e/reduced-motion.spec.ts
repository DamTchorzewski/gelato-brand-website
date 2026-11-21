import { expect, test } from "@playwright/test";

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ reducedMotion: "reduce" });

  test("the scroll story is a plain layout and nothing is animated", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500); // longer than the idle delay that would load the motion layer
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bmotion\b/);
    await expect(html).not.toHaveClass(/\blenis\b/);

    // The flavour track is not pinned: as tall as its stage, all six flavours readable at once.
    const trackBox = await page.locator("[data-flavours-track]").boundingBox();
    const stageBox = await page.locator("[data-flavours-stage]").boundingBox();
    expect(Math.round(trackBox?.height ?? 0)).toBe(Math.round(stageBox?.height ?? -1));
    for (const item of await page.locator("[data-flavour]").all()) {
      await item.scrollIntoViewIfNeeded();
      await expect(item).toBeVisible();
      await expect(item).toHaveCSS("opacity", "1");
    }

    // The ingredients are a plain list, not the drifting rows.
    await expect(page.locator(".numbers__marquee")).toBeHidden();
    await expect(page.getByRole("listitem").filter({ hasText: /^Sea salt$/ })).toBeVisible();
  });
});

test.describe("motion welcome", () => {
  test.use({ reducedMotion: "no-preference" });

  test("scrolling through the flavour scene changes the current scoop", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\blenis\b/, { timeout: 5000 });
    const end = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("[data-flavours-track]");
      if (!track) return 0;
      const top = track.getBoundingClientRect().top + window.scrollY;
      return top + track.offsetHeight - window.innerHeight - 5;
    });
    await page.mouse.move(200, 200);
    // Wheel in steps, like a visitor; Lenis owns the scroll position while motion is on.
    for (let y = 0; y < end; y += 600) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(40);
    }
    await expect(page.locator("[data-flavour][data-active]")).not.toHaveAttribute(
      "data-flavour",
      "0",
      { timeout: 8000 },
    );
  });
});
