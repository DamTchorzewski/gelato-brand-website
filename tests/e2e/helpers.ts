import type { Page } from "@playwright/test";

// Every page template of the site.
export const ROUTES = ["/", "/404/"] as const;

// Collects console errors and uncaught exceptions; a test asserts the list is empty at the end.
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

// The map embed is answered locally: tests never call Google.
export async function stubMaps(page: Page): Promise<void> {
  await page.route("https://www.google.com/maps**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Map</title>",
    }),
  );
}

// Scrolls to the bottom in steps, so lazy images load and in-view animations reach their final state.
export async function scrollThrough(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
}
