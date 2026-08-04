# CLAUDE.md — SOSE Website

Read this before touching anything. It is the source of truth for architecture,
brand, voice, and the rules that must not be broken.

## The client

Sight Over Site Engineering (SOSE). Kenyan construction consulting and building
solutions company. The site's job is to make a serious developer, homeowner, or
institution believe SOSE can be trusted with a build worth millions of
shillings, then get them to make contact.

Contact: info@sosengineeringke.com · www.sosengineeringke.com · Kenya, nationwide.

## Architecture

Static HTML, CSS and vanilla JavaScript. No framework, no bundler, no build
step, no dependencies. One folder per route with an `index.html` inside, so URLs
are clean (`/services/structural-audits/`). All asset paths are root-relative
(`/css/styles.css`, `/img/tower.jpg`).

The shared nav and footer live in `tools/partials/` and are synced into every
page in place by `node tools/sync-partials.mjs`. Pages carry markers:

```html
<!-- partial:nav -->   ...replaced content...   <!-- /partial:nav -->
<!-- partial:footer --> ...replaced content... <!-- /partial:footer -->
```

The project has two scripts and no build step. `tools/sync-partials.mjs` keeps
the nav and footer identical across every page. `tools/check-links.mjs` reports
internal links pointing at routes that do not exist yet. Neither one produces
build output: the sync script edits the files in place and the link checker only
reads, so the repo is always the deployable artifact. There is no `dist/`.

```bash
npm run sync          # push partials into every page
npm run check         # exit 1 if any page has drifted; run before every commit
npm run links         # list internal links whose routes are not built yet
npm run links:strict  # same, but exits 1 on any missing route; the launch gate
npm run dev           # local server on :5173 (needed, since paths are root-relative)
```

Rules that follow from this:

- Never hand-edit the nav or footer inside a page. Edit `tools/partials/` and
  run `npm run sync`.
- Every new page must include both partial markers, or `npm run check` fails.
- Never introduce a framework, a bundler, or a client-side router. If the site
  ever needs a CMS, many blog posts, or a projects database, that is the moment
  to convert to Astro, and the existing HTML converts almost directly into
  layouts. Until then, this stays static.

## Reference page

`services/structural-audits/index.html` is the pattern for every interior page.
Copy its structure: head block, partial markers, `.page-header` with
breadcrumbs, alternating `.sec` and `.sec.white` bands, a `.related` block, a
contextual `.cta-band`, then the footer partial. Match it rather than inventing
a new arrangement.

`index.html` is the home page, ported from v1. It is the only page with a
full-viewport hero.

## Non-negotiable rules

1. Never invent facts. No fake testimonials, no invented case studies, no
   made-up statistics ("250+ projects delivered"), no client logos, no team
   members who do not exist. If a section needs proof SOSE has not supplied,
   leave the section out. See `content/client-inputs-needed.md`.
2. No regulatory specifics without a source. Kenyan construction involves
   contractor registration, county approvals, environmental requirements and
   material standards. Write about them in general terms only. Never state a
   fee, threshold, timeline, or clause number. Anything specific gets flagged
   `<!-- VERIFY: SOSE to confirm -->` and stays out of the build.

   A VERIFY block guards either an absence or a claim. Removing one that
   guarded an absence is complete. Removing one that guarded a claim means the
   claim must also be removed or hedged, since the guard was the only thing
   making it honest.
3. Copy comes from `content/`. Do not improvise marketing copy inline. If copy
   is missing, add it to the content file first, then build the page.

   content/ is the source of truth for copy. HTML follows content, never the
   reverse. The one-time backfill of content/copy/services/structural-audits.md
   from the built page reconciled the reference page; do not backfill again.
   If a page needs a line that content does not have, add it to content first,
   then build.
4. Accessibility floor on every page: semantic landmarks, exactly one `h1`,
   no heading level skipped, labelled icon-only controls, visible focus rings,
   AA contrast, `prefers-reduced-motion` respected.

   Every page opens with a `.skip` link (in the nav partial) targeting
   `<main id="main" tabindex="-1">`, so every page needs that `main`. Focus
   rings come from one baseline rule near the foot of `css/styles.css`;
   components that draw their own out-specify it. Anything hidden must be
   hidden from the tab order too — `visibility`, not just `opacity`.

## Brand tokens

Defined in `:root` in `css/styles.css`. Never hardcode a colour.

```css
--navy: #0B1F4D;  --navy-deep: #071335;
--gold: #C8A14D;  --gold-soft: #D9BC7A;  --gold-ink: #8A6A22;
--paper: #F9F7F2; --ink: #1B2438; --muted: #5C6478; --hairline: #E5E1D6;
```

There are three golds and they are not interchangeable. On a light ground
`--gold` measures 2.26:1 and `--gold-soft` 1.72:1, both far under AA, so
neither may ever carry text there. `--gold-ink` is the same hue carried down
until it passes: 4.71:1 on paper, 5.04:1 on white. The rule:

- **Text, focus rings and any icon that must be read on paper or white** →
  `--gold-ink`.
- **Text on navy** → `--gold-soft` (9.8:1) or `--gold` (7.5:1).
- **Decoration anywhere** — rules, dashes, borders, hexagon fills, hover
  border colours, gradients → `--gold`, on either ground.

The `.eyebrow` defaults to `--gold-ink` because it sits on a light ground on
every interior page; the home page's dark bands opt back into `--gold-soft`.

Type: Playfair Display for headings, Inter for body and UI. Nothing else.
Both are self-hosted from `/fonts/` as variable woff2 and declared with
`font-display:swap` at the top of `css/styles.css`. Three faces, 107 KB, latin
subset only — Inter 400–700, Playfair 400–700, Playfair italic 500. The
latin-ext subset was dropped because no character painted anywhere on the site
falls in it; if copy ever needs one, the glyph falls back to the system font
until that face is added back. The site makes no third-party request of any
kind — no Google Fonts link, no preconnect, nothing. `/privacy/` states that
plainly, so if anything external is ever added, that page changes the same day.

The gold hexagon from the logo is the signature motif: the nav wordmark's O,
the hero background mark, the page header watermark, the checkmark shape, the
process step numbers, and the `.hexlist` bullet. Before adding a new shape, ask
whether the hexagon can do that job.

## Routes

```
/                              Home. Story condensed, every section links out.
/about/                        Who SOSE is, the three principles, mission.
/approach/                     Five-step process in full, quality, engagement models.
/services/                     Index of the five services.
/services/construction-consulting/
/services/project-management/
/services/building-solutions/
/services/structural-audits/          <- built, use as the pattern
/services/sustainable-solutions/
/sectors/                      Six sectors, each with its own failure mode named.
/insights/                     Field notes index.
/insights/before-you-break-ground/
/insights/what-a-structural-audit-looks-for/
/insights/building-green-without-the-premium/
/project-check/                Eight-question readiness tool. The lead generator.
/contact/                      Details and inquiry form.
/privacy/                      Data protection notice.
```

Deliberately absent: Projects, Testimonials, Team. All three ship the day SOSE
supplies real content, not before.

Non-route files at the root, all hand-written or generated once, none built:
`sitemap.xml` (add a line when you add a route), `robots.txt`,
`site.webmanifest`, `favicon.ico`, and `/img/icon-*.png` plus `/img/og.png`,
which were rasterised from `/img/logo.png`. `docs/launch-checklist.md` is the
gate list for going live.

## CSS conventions

`css/styles.css` is one file, two halves. Everything above the `MULTI-PAGE
ADDITIONS (v2)` banner is the v1 home page system. Everything below supports
interior pages. Add new component styles below the banner, grouped with a
comment. Do not fork colours or type between the halves.

Existing interior primitives, use these before writing new CSS:
`.page-header`, `.crumbs`, `.sec` / `.sec.white` / `.sec.tight`, `.split` /
`.split.narrow-left`, `.measure`, `.hexlist`, `.related` + `.rel`,
`.cta-band`, `.prose`, `.insight-grid` + `.insight`, `.eyebrow`, `.btn` +
`.btn-gold` / `.btn-ghost`, `.rv` + `.d1`–`.d4` for scroll reveals,
`.matters` (the sectors "what matters most here" callout), `.sector-media`
(a cropped photo panel inside a `.split` column). The home page `.svc` card
also works as a whole-card link: use `<a class="svc">` with an `h2` and a
`.arrow`, as on `/services/`.

## Voice

Confident, plain, specific. Short sentences carry weight. Write like an engineer
explaining something to a client who is spending their own money.

The running theme is the name: sight before site. Foresight is the product. Use
it where it earns its place, do not run it into the ground.

Words that do not appear on this site: cutting-edge, world-class, robust,
synergy, seamless, best-in-class, leverage, unlock, empower.

## Motion

Elements get class `rv` and reveal once on scroll, with `d1`–`d4` for stagger.
Reduced motion turns it all off. No scroll hijacking, no parallax libraries, no
page transition frameworks. The restraint is the design.

## Definition of done for any page

- Renders at 360px, 768px and 1440px with no horizontal scroll
- Unique `<title>`, meta description, canonical and Open Graph tags
- Both partial markers present, `npm run check` passes
- Keyboard reachable, focus visible, sensible tab order
- No copy invented outside `content/`
- No console errors
