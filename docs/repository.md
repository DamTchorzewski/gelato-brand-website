# Repozytorium: opis i tagi

Rzeczy, które ustawia się na GitHubie ręcznie (nie da się ich zapisać w plikach repozytorium). Przegląd projektu:
[README](../README.md).

## Nazwa repozytorium: `gelato-brand-website`

Standard nazw: `reops/standards/repo-names.md` (zasada 4: co to jest, fraza wyszukiwana na GitHubie). Projekt powstał
2026-11-21 jako nowa wersja `food-brand-landing-page` (strona marki lodów w Parcelu), która zostaje bez zmian jako
osobne repozytorium. Marka na stronie to **Velluto** (wł. „aksamit”); treść jest przykładowa.

Adres strony: `https://damtchorzewski.github.io/gelato-brand-website/`. Workflow `deploy.yml` czyta go z ustawień Pages
(`configure-pages`) i przekazuje do buildu jako `SITE_URL`, więc ścieżka `/gelato-brand-website/` jest bazą wszystkich
linków.

## Opis i tagi (About)

GitHub: strona repozytorium → ⚙ obok „About” → pola poniżej.

**Opis (Description):**

```text
Scroll-driven website of a gelato brand: a cone built scoop by scoop, stacking menu cards and WCAG 2.2 AA, made with Astro, Tailwind CSS and GSAP.
```

**Strona (Website):**

```text
https://damtchorzewski.github.io/gelato-brand-website/
```

**Tagi (Topics):**

```text
astro tailwindcss gsap scrolltrigger lenis landing-page scroll-animation responsive-design accessibility wcag playwright typescript github-pages github-actions front-end
```

Z GitHub CLI (`gh`):

```bash
gh repo edit DamTchorzewski/gelato-brand-website --homepage "https://damtchorzewski.github.io/gelato-brand-website/" --description "Scroll-driven website of a gelato brand: a cone built scoop by scoop, stacking menu cards and WCAG 2.2 AA, made with Astro, Tailwind CSS and GSAP." --add-topic astro --add-topic tailwindcss --add-topic gsap --add-topic scrolltrigger --add-topic lenis --add-topic landing-page --add-topic scroll-animation --add-topic responsive-design --add-topic accessibility --add-topic wcag --add-topic playwright --add-topic typescript --add-topic github-pages --add-topic github-actions --add-topic front-end
```

## Ustawienia do włączenia

| Gdzie (GitHub)                                  | Co ustawić                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Settings → Pages                                | Source: **GitHub Actions** (publikuje `deploy.yml`)                                               |
| Settings → Environments → `github-pages`        | Deployment branches: tylko `main`                                                                 |
| Settings → General → Default branch             | `main`                                                                                            |
| Settings → General → Pull Requests              | Rebase merging i merge commits włączone, squash wyłączony; automatyczne usuwanie gałęzi wyłączone |
| Settings → Rules → Rulesets → `main`, `develop` | zablokuj force push i usuwanie gałęzi                                                             |
| Settings → Code security                        | Dependabot alerts i security updates, secret scanning z push protection                           |
