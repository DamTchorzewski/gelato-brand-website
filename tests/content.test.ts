// Checks the content file, so a typo in src/content/site.ts fails here and not on the live page.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  flavours,
  footer,
  gallery,
  hero,
  menu,
  nav,
  reviews,
  shops,
  site,
  telHref,
} from "../src/content/site";

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe("site content", () => {
  it("has a title and a description of a sensible length", () => {
    expect(site.title.length).toBeGreaterThan(0);
    expect(site.description.length).toBeGreaterThan(50);
    expect(site.description.length).toBeLessThanOrEqual(160);
  });

  it("links the navigation to sections that exist in the content", () => {
    expect(nav.map((link) => link.href)).toEqual(["#flavours", "#menu", "#story", "#shops"]);
  });

  it("has a colour for every flavour and a frame sequence that exists", () => {
    for (const item of flavours.items) expect(item.colour).toMatch(/^#[0-9a-f]{6}$/i);
    for (const set of ["desktop", "mobile"]) {
      const dir = join("public", flavours.frames.path, set);
      const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
      expect(files).toHaveLength(flavours.frames.count);
      expect(files).toContain(`f_${String(flavours.frames.count).padStart(2, "0")}.webp`);
    }
  });

  it("uses unique ids for the flavours and the menu dialogs", () => {
    for (const list of [flavours.items, menu.items]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("describes every picture that carries content", () => {
    const alts = [hero.alt, ...menu.items.map((i) => i.alt), ...gallery.photos.map((p) => p.alt)];
    for (const alt of alts) expect(alt.trim().length).toBeGreaterThan(10);
  });

  it("has three reviews with a name and a city", () => {
    expect(reviews.items).toHaveLength(3);
    for (const review of reviews.items) {
      expect(review.name).not.toBe("");
      expect(review.city).not.toBe("");
    }
  });

  it("gives every shop hours, a phone and an e-mail address on the example domain", () => {
    for (const shop of shops.items) {
      expect(shop.hours.length).toBeGreaterThan(0);
      expect(telHref(shop.phone)).toMatch(/^tel:\+\d{11}$/);
      expect(shop.email).toMatch(email);
      expect(shop.email.endsWith(".example")).toBe(true);
    }
    expect(footer.email).toMatch(email);
  });
});

describe("telHref", () => {
  it("keeps only the digits and the plus sign", () => {
    expect(telHref("+1 312 555 0142")).toBe("tel:+13125550142");
  });
});
