// The motion layer: smooth scrolling (Lenis) and the scroll-driven scenes (GSAP ScrollTrigger). Loaded by ./main.ts
// after the first paint, and only when prefers-reduced-motion is "no-preference". Every scene starts from the
// finished, readable state in the HTML, so nothing depends on this file to be seen.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { stepAt } from "@/lib/steps";

gsap.registerPlugin(ScrollTrigger);

// ---------- Smooth scrolling ----------
const lenis = new Lenis({
  lerp: 0.11,
  // Scrolling inside an open dialog (menu, details, map) stays native and never moves the page behind it.
  prevent: (node: HTMLElement) => node.closest?.("dialog[open]") !== null,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// In-page links glide to their section and hand it the focus. The skip link and "back to the top" stay native.
document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.hash === "#main" || link.hash.length < 2) return;
  const target = document.querySelector<HTMLElement>(link.hash);
  if (!target) return;
  event.preventDefault();
  const headerHeight = document.querySelector<HTMLElement>("[data-header]")?.offsetHeight ?? 72;
  lenis.scrollTo(target, {
    offset: link.hash === "#flavours" ? 0 : -headerHeight,
    duration: 1.4,
    onComplete: () => {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
  });
  history.replaceState(null, "", link.hash);
});

const mm = gsap.matchMedia();

// ---------- Hero: the headline drifts apart, the cone lifts and tilts (wide screens) ----------
const hero = document.querySelector<HTMLElement>("[data-hero]");
if (hero) {
  mm.add("(min-width: 1024px)", () => {
    const lines = hero.querySelectorAll<HTMLElement>(".hero__line");
    const drift = ["-7vw", "5vw", "-3vw"];
    const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    lines.forEach((line, i) =>
      gsap.to(line, { x: drift[i] ?? 0, ease: "none", scrollTrigger: scrub }),
    );
    gsap.to("[data-hero-cone]", { yPercent: -14, rotate: 7, ease: "none", scrollTrigger: scrub });
    gsap.to("[data-hero-fade]", {
      opacity: 0,
      y: -30,
      ease: "none",
      stagger: 0.05,
      scrollTrigger: { ...scrub, end: "60% top" },
    });
  });
}

// ---------- Parallax: anything marked with data-parallax="<speed>" ----------
mm.add("(min-width: 1024px)", () => {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0;
    gsap.fromTo(
      el,
      { y: () => -speed * 260 },
      {
        y: () => speed * 260,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
});
mm.add("(max-width: 1023px)", () => {
  document.querySelectorAll<HTMLElement>(".hero [data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0;
    gsap.to(el, {
      y: speed * 160,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
});

// ---------- Flavours: the cone is built scoop by scoop ----------
const flavours = document.querySelector<HTMLElement>("[data-flavours]");
const track = flavours?.querySelector<HTMLElement>("[data-flavours-track]");
if (flavours && track) {
  const items = [...flavours.querySelectorAll<HTMLElement>("[data-flavour]")];
  const marks = [...flavours.querySelectorAll<HTMLElement>("[data-progress]")];
  const cone = flavours.querySelector<HTMLElement>(".flavours__cone");
  const fills = items.map((item) => Number(item.dataset.fill));
  let current = -1;

  const show = (index: number) => {
    if (index === current) return;
    const adding = index > current;
    current = index;
    items.forEach((item, i) => item.toggleAttribute("data-active", i === index));
    marks.forEach((mark, i) => {
      mark.toggleAttribute("data-done", i <= index);
      mark.toggleAttribute("data-current", i === index);
    });
    flavours.style.setProperty("--bg", items[index]?.dataset.colour ?? "");
    gsap.to(flavours, {
      "--fill": fills[index] ?? 1,
      duration: adding ? 0.85 : 0.5,
      ease: adding ? "back.out(1.7)" : "power2.out",
      overwrite: true,
    });
    if (adding && cone) {
      gsap.fromTo(
        cone,
        { scaleY: 0.95, scaleX: 1.04 },
        { scaleY: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true },
      );
    }
  };

  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => show(stepAt(self.progress, items.length)),
    onLeaveBack: () => {
      current = -1;
      items.forEach((item, i) => item.toggleAttribute("data-active", i === 0));
      marks.forEach((mark) => mark.removeAttribute("data-done"));
      flavours.style.removeProperty("--bg");
      gsap.to(flavours, { "--fill": 0.26, duration: 0.4, overwrite: true });
    },
  });
}

// ---------- Menu: a card sinks back as the next one slides over it ----------
mm.add("(min-width: 768px)", () => {
  const cards = [...document.querySelectorAll<HTMLElement>("[data-menu-card]")];
  cards.slice(0, -1).forEach((card, i) => {
    const next = cards[i + 1]?.closest("li");
    if (!next) return;
    gsap.fromTo(
      card,
      { scale: 1, filter: "brightness(1)" },
      {
        scale: 0.93,
        filter: "brightness(0.92)",
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 25%", scrub: true },
      },
    );
  });
});

// ---------- Story: the rail fills while the steps are read ----------
const flow = document.querySelector<HTMLElement>("[data-story-steps]");
const line = flow?.querySelector<HTMLElement>("[data-story-line]");
if (flow && line) {
  gsap.fromTo(
    line,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: flow, start: "top 65%", end: "bottom 65%", scrub: true },
    },
  );
}

// ---------- Reveals: cards and steps rise in once ----------
// Hidden only from here on: without this file they are simply there.
gsap.set("[data-reveal]", { y: 48, opacity: 0 });
ScrollTrigger.batch("[data-reveal]", {
  start: "top 88%",
  once: true,
  onEnter: (batch) =>
    gsap.fromTo(
      batch,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true },
    ),
});

// ---------- Numbers: count up the first time they come into view ----------
document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  const counter = { value: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () =>
      gsap.to(counter, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = String(Math.round(counter.value));
        },
      }),
  });
});

// ---------- Ingredients: two rows drift in opposite directions with the scroll ----------
document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((row) => {
  const direction = Number(row.dataset.marquee) || -1;
  gsap.to(row, {
    xPercent: direction * 22,
    ease: "none",
    scrollTrigger: {
      trigger: row.closest("section"),
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});

// Images and fonts change the height of the page: measure the triggers again once everything is in.
window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
