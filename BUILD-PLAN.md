# BUILD-PLAN.md

Six phases. Each ends with something you can open in a browser. Run
`npm run check` and commit at every boundary. The prompts are written to be
pasted into Claude Code as-is.

Phase 0 is done. The project already has: the clean-URL folder structure, the
partial system, the multi-page nav and footer, the interior-page CSS, the
rewritten `js/main.js`, the ported home page, and one finished interior page at
`/services/structural-audits/` that acts as the pattern.

Start with:

```bash
npm run dev     # leave running in a second terminal, open http://localhost:5173
git init && git add -A && git commit -m "Phase 0: static multi-page scaffold"
claude
```

---

## Phase 1 — The four remaining service pages

> Read CLAUDE.md. Build the four remaining service pages using
> `services/structural-audits/index.html` as the exact structural pattern:
> `/services/construction-consulting/`, `/services/project-management/`,
> `/services/building-solutions/`, `/services/sustainable-solutions/`.
> Copy for each is in `content/copy/services/`. Use only the existing CSS
> primitives listed in CLAUDE.md; do not add new CSS unless something genuinely
> has no primitive, and say so if you do. Each page gets its own title, meta
> description, canonical, and the service-specific CTA from its copy file. Then
> run `npm run sync` and `npm run check`.

Check: five service pages, consistent structure, no new CSS, check passes.
`npm run links`.

## Phase 2 — Services index and sectors

> Build `/services/` as an index of the five services, and `/sectors/` from
> `content/copy/sectors.md`. The services index reuses the existing `.svc` card
> styles from the home page. Sectors uses one block per sector with its
> "what matters most here" line, and the imagery in `/img/` where it helps.
> Both pages end with a contextual CTA band.

Check: every service card links to a real page, sectors reads as expertise
rather than a list. `npm run links`.

## Phase 3 — About and Approach

> Build `/about/` from `content/copy/about.md` and `/approach/` from
> `content/copy/approach.md`. The approach page owns the five-step process in
> full, so port the process section from the home page into a fuller treatment
> there, then reduce the home page version to a summary that links to it. Keep
> the hexagon step markers.

Check: process exists in full in exactly one place, home links to it.
`npm run links`.

## Phase 4 — Field notes

> Build `/insights/` as a card index using the `.insight` styles, and one page
> per article under `/insights/[slug]/`, converting the three markdown files in
> `content/insights/` to HTML using the `.prose` styles. Frontmatter becomes
> the page title, meta description, and the category pill and reading time in
> the page header. Add JSON-LD Article structured data to each. Any block
> marked VERIFY in the markdown is omitted from the HTML and listed back to me.

Check: articles read well at 360px, measure holds at 68ch, no VERIFY text ships.
`npm run links`.

## Phase 5 — Readiness check, contact, privacy

> Build the readiness tool at `/project-check/` exactly as specified in
> `content/copy/project-check.md`, in a new `js/project-check.js` loaded only
> on that page. Plain TypeScript-free vanilla JS, no framework. Radio groups in
> proper fieldsets with legends, results announced in a live region, state in
> memory only, nothing transmitted until the user chooses to send. Then build
> `/contact/` from `content/copy/contact.md`, reusing the existing form styles
> and the handler already in `js/main.js`, and `/privacy/` from
> `content/copy/privacy.md`. Add an entry card for the readiness check on
> `/contact/` and `/services/`.

Check: the tool is fully operable with a keyboard, the send action composes a
correct email, no data leaves the page otherwise. `npm run links`.

## Phase 6 — Home rebuild, SEO and ship

> Rework `index.html` so each section is a summary that links to its full page,
> per `content/copy/home.md`, including the new three-door strip under the hero
> and the field notes teaser. Then a site-wide pass: unique titles and meta
> descriptions everywhere, Open Graph and Twitter tags, JSON-LD
> ProfessionalService on home, `sitemap.xml` and `robots.txt` written by hand,
> favicon and og image generated from `/img/logo.png`, `loading="lazy"` and
> explicit width and height on every image below the fold. Finish with an
> accessibility and performance pass and list what you changed.

Check: `npm run check` passes, `npm run links`, Lighthouse on home, a service
page and an article. `npm run links:strict` must pass with zero missing routes
before deploy. Then deploy.

---

## Working notes

- One phase per session, then `/clear`. Long sessions drift and it starts
  forgetting decisions made earlier.
- `npm run check` before every commit. It is the guard that makes the no-build
  architecture safe.
- If it hand-edits the nav inside a page instead of the partial, stop it.
- If it starts inventing project names, client quotes or statistics, stop it
  and point at rule 1 in CLAUDE.md.
- If it proposes adding a framework or a build step, point at the architecture
  section. The conversion threshold is written down there.
- Ask it to update CLAUDE.md at the end of each phase with anything future
  sessions need to know.
