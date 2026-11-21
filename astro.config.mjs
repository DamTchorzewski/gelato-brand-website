// Astro configuration. SITE_URL is the only environment variable (see .env.example): the deploy workflow sets it
// from the Pages settings (https://damtchorzewski.github.io/gelato-brand-website/), so the path of the project page
// becomes the base and every asset link points under it.
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const siteUrl = process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined;

export default defineConfig({
  site: siteUrl?.origin,
  base: siteUrl ? siteUrl.pathname.replace(/\/$/, "") || "/" : "/",
  trailingSlash: "always",
  build: { assets: "assets" },
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
