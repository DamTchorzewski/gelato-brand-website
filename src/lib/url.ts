// Builds a link that respects the base path (a project page on github.io lives under /<repo>/).
export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
