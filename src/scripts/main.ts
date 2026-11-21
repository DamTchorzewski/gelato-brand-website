// Shared behaviour that works without the motion layer: the header state, the dialogs (phone menu, product details,
// map) and the lazy map. The scroll animations live in ./motion.ts and are loaded only when motion is welcome.

const header = document.querySelector<HTMLElement>("[data-header]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

// ---------- Header: solid once the page has scrolled, hidden while reading down ----------
let lastY = window.scrollY;
let ticking = false;
function updateHeader() {
  ticking = false;
  if (!header) return;
  const y = window.scrollY;
  header.toggleAttribute("data-scrolled", y > 12);
  const goingDown = y > lastY + 4;
  const goingUp = y < lastY - 4;
  if (goingDown && y > 480 && !reduceMotion.matches) header.setAttribute("data-hidden", "");
  else if (goingUp || y < 480) header.removeAttribute("data-hidden");
  lastY = y;
}
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateHeader);
    }
  },
  { passive: true },
);
updateHeader();

// ---------- Dialogs ----------
// The control that opened a dialog gets the focus back when it closes (the browser does it for showModal, but a link
// inside the dialog that closes it and jumps to a section should not pull the focus back up).
function openDialog(dialog: HTMLDialogElement) {
  if (dialog.open) return;
  dialog.showModal();
  document.dispatchEvent(new CustomEvent("dialog:toggle", { detail: { open: true } }));
}

function closeDialog(dialog: HTMLDialogElement, returnValue = "") {
  if (dialog.open) dialog.close(returnValue);
}

document.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    document.dispatchEvent(new CustomEvent("dialog:toggle", { detail: { open: false } }));
  });
  // A click on the backdrop (outside the panel) closes the dialog.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && !dialog.classList.contains("menu")) closeDialog(dialog);
  });
});

document.addEventListener("click", (event) => {
  const target = event.target as Element | null;
  const opener = target?.closest<HTMLElement>("[data-dialog-open]");
  if (opener) {
    const dialog = document.getElementById(opener.dataset.dialogOpen ?? "");
    if (dialog instanceof HTMLDialogElement) openDialog(dialog);
    return;
  }
  const menuOpener = target?.closest("[data-menu-open]");
  if (menuOpener) {
    const menu = document.getElementById("site-menu");
    if (menu instanceof HTMLDialogElement) openDialog(menu);
    return;
  }
  const closer = target?.closest<HTMLElement>("[data-dialog-close]");
  if (closer) {
    const dialog = closer.closest("dialog");
    if (dialog) closeDialog(dialog);
  }
});

// The phone menu is pointless on a wide screen: close it if the window grows past the breakpoint.
matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
  const menu = document.getElementById("site-menu");
  if (event.matches && menu instanceof HTMLDialogElement) closeDialog(menu);
});

// ---------- Map: the Google embed is created only when the visitor asks for it ----------
const mapDialog = document.getElementById("map-dialog");
const mapFrame = document.querySelector<HTMLElement>("[data-map-frame]");
const mapHeading = document.querySelector<HTMLElement>("[data-map-heading]");

document.querySelectorAll<HTMLButtonElement>("[data-map]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!(mapDialog instanceof HTMLDialogElement) || !mapFrame) return;
    const query = button.dataset.map ?? "";
    const title = button.dataset.mapTitle ?? "Map";
    if (mapHeading) mapHeading.textContent = title;
    const iframe = document.createElement("iframe");
    iframe.title = `Map: ${title}`;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
    mapFrame.replaceChildren(iframe);
    openDialog(mapDialog);
  });
});

mapDialog?.addEventListener("close", () => mapFrame?.replaceChildren());

// ---------- Current section in the main navigation ----------
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".nav-link")];
const sections = navLinks
  .map((link) => document.querySelector<HTMLElement>(link.hash))
  .filter((section): section is HTMLElement => section !== null);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navLinks) {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

// ---------- Motion layer, loaded after the first paint ----------
if (document.documentElement.classList.contains("motion")) {
  const load = () =>
    import("./motion").catch(() => {
      // Without the animation code the page falls back to its static layout.
      document.documentElement.classList.remove("motion");
    });
  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 200);
}

// If the visitor turns reduced motion on while the page is open, show the static layout.
reduceMotion.addEventListener("change", (event) => {
  if (event.matches) window.location.reload();
});
