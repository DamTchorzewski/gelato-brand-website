import { expect, test } from "@playwright/test";
import { stubMaps, trackErrors } from "./helpers";

test.use({ reducedMotion: "reduce" });

test("the skip link moves the focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("a product dialog opens, holds the focus, closes with Escape and returns it", async ({
  page,
}) => {
  const errors = trackErrors(page);
  await page.goto("/");
  const opener = page.getByRole("button", { name: "More about milkshakes" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Milkshakes" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  expect(errors).toEqual([]);
});

test("the map loads only when asked for", async ({ page }) => {
  await stubMaps(page);
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Show Chicago on the map" }).click();
  const dialog = page.getByRole("dialog", { name: "Café in Chicago" });
  await expect(dialog.locator("iframe")).toHaveAttribute("src", /google\.com\/maps.*Wicker%20Park/);
  await dialog.getByRole("button", { name: "Close the map" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("the phone menu opens, links to a section and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the menu button is shown on narrow screens only");
  await page.goto("/");
  const button = page.getByRole("button", { name: "Menu" });
  await button.click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(button).toBeFocused();

  await button.click();
  await menu.getByRole("link", { name: /Shops/ }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#shops$/);
  await expect(page.getByRole("heading", { level: 2, name: "Find a shop" })).toBeInViewport();
});

test("the desktop navigation is visible on wide screens", async ({ page, isMobile }) => {
  test.skip(isMobile, "wide screens only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Flavours" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
});
