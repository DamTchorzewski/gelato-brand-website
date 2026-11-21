/// <reference types="vitest/config" />
// Unit tests run through Astro's Vite config, so the `@/` alias and image imports in the content file resolve.
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
