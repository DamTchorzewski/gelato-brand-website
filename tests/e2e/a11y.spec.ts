import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES, scrollThrough, stubMaps } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// The site has one palette; both colour schemes are checked so a future dark mode cannot slip in unchecked.
for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`WCAG 2.2 AA (${colorScheme})`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });
    for (const route of ROUTES) {
      test(route, async ({ page }) => {
        await stubMaps(page);
        await page.goto(route);
        await scrollThrough(page);
        const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        expect(
          violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
        ).toEqual([]);
      });
    }
  });
}

test.describe("WCAG 2.2 AA with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the scroll story keeps its contrast", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\blenis\b/, { timeout: 5000 });
    await scrollThrough(page);
    await page.waitForTimeout(800);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    ).toEqual([]);
  });
});
