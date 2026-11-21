import { expect, test } from "@playwright/test";
import { ROUTES, stubMaps, trackErrors } from "./helpers";

for (const route of ROUTES) {
  test(`${route} renders without errors or sideways scrolling`, async ({ page }) => {
    const errors = trackErrors(page);
    await stubMaps(page);
    const response = await page.goto(route);
    expect(response?.ok() || response?.status() === 404).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("the home page has the sections the navigation points at", async ({ page }) => {
  await page.goto("/");
  for (const id of ["flavours", "menu", "story", "shops"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
  await expect(page.getByRole("heading", { level: 2, name: "On the menu" })).toBeAttached();
});
