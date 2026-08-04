# Launch checklist

Everything that has to happen before www.sosengineeringke.com goes live. Work
top to bottom. The gates in section 1 are hard stops: if one of them is open,
the site does not ship.

Nothing here is a nice-to-have that got promoted. Items that are genuinely
optional are in section 7 and marked as such.

---

## 1. Hard gates

These block launch outright.

- [ ] **`npm run links:strict` passes with zero missing routes.**
      `npm run links` lists internal links whose routes do not exist yet;
      `links:strict` exits 1 on any of them. A single missing route means a
      visitor can reach a 404 from inside the site, which is the one defect a
      static site has no excuse for. Run it last, after any content change.

- [ ] **`npm run check` passes.** Confirms the nav and footer in all seventeen
      pages still match `tools/partials/`. If it fails, run `npm run sync` and
      commit the result — never hand-edit a nav or footer inside a page.

- [ ] **Legal review of `/privacy/` by someone qualified in Kenyan data
      protection law.** See section 2 below; there is a specific sentence in it
      that commits SOSE to something they have not agreed to.

- [ ] **SOSE confirms the site may state "Kenya, serving clients nationwide"**
      as its only address, or supplies a physical one. This appears on
      `/contact/` and in the JSON-LD on the home page.

- [ ] **Domain, TLS and canonical host settled.** Every canonical URL, the
      sitemap and the Open Graph tags are hard-coded to
      `https://www.sosengineeringke.com`. If the live site ends up on the apex
      domain, or on http, those tags are wrong on all seventeen pages. Decide
      the canonical host first, then redirect the other form to it.

- [ ] **Clean-URL routing works on the real host.** Every route is a folder
      with an `index.html`. Confirm `/services/structural-audits/` serves and
      that `/services/structural-audits` (no trailing slash) redirects to it
      rather than 404ing. Netlify, Cloudflare Pages and GitHub Pages all do this
      by default; a plain Apache or nginx box may not.

---

## 2. `/privacy/` — the specific problem

The page is a plain-language starting point and says so. Two things need
attention before a lawyer sees it, and one of them is a commitment rather than
a wording issue.

- [ ] **The retention sentence commits SOSE to a response policy nobody has
      confirmed.** The page currently reads:

      > We have not set a published retention period for each type of record.
      > If you want to know how long we are holding something of yours, ask and
      > we will tell you.

      The second sentence is an undertaking to answer any data subject who
      asks, on an unstated timescale, about records SOSE has not catalogued.
      That is a live obligation, not a description. Before launch, SOSE must
      either (a) accept it and put a person and a turnaround time behind it, or
      (b) replace it with an actual retention schedule per record type, or
      (c) drop the promise and keep only the factual first sentence. This is a
      business decision, not a copy edit, which is why it is not already made.

- [ ] **Resolve the open `VERIFY` block in `content/copy/privacy.md`.** It
      still guards two unknowns: whether SOSE uses any third-party tools (email
      marketing, CRM), and where the site is hosted, since hosting outside
      Kenya has to be disclosed. Per the rule in CLAUDE.md, that block guards an
      absence — removing it is complete only once the answers are in the copy.

- [ ] **Confirm whether SOSE must register as a data controller** under the
      Data Protection Act 2019. If so, the registration should be referenced on
      the page.

- [ ] The third-party disclosure has already been corrected. The page used to
      say the typefaces were served by Google Fonts. They are now self-hosted
      from `/fonts/`, the site makes no external request of any kind, and the
      page says so. Nothing to do here — this line is a record that it was
      checked.

---

## 3. Content SOSE still owes

Every item in `content/client-inputs-needed.md`, reproduced here so this file
stands alone. Nothing on this list may be invented to fill the gap.

### Visibly missing, but the site can launch without them

- [ ] 1. Phone number and WhatsApp number for the contact page.
- [ ] 2. Physical office address, or confirmation that "Kenya, nationwide" is
      correct. (Also a hard gate — see section 1.)
- [ ] 3. Working hours.
- [ ] 4. Confirmation of which engagement models SOSE actually offers
      (advisory, project-managed delivery, full building solutions) and any
      minimum project size. `/approach/` describes these today.
- [ ] 5. Which structural testing SOSE does in house versus subcontracts.
      `/services/structural-audits/` hedges this deliberately.

### Unlocks a whole section or route when supplied

- [ ] 6. Real projects. Three to five, each with what it was, where, what SOSE
      did, when, one photograph, and permission to publish. Nothing at
      `/projects/` has been built; the route ships the day this arrives.
- [ ] 7. Client testimonials with named permission.
- [ ] 8. Team. Names, roles, qualifications, registrations, one photograph
      each. Buyers of engineering services look for this.
- [ ] 9. Registrations and memberships (professional bodies, contractor
      registration, certifications). The strongest trust signal an engineering
      firm has, and its absence is noticeable.
- [ ] 10. Year founded, and any headline numbers SOSE can actually stand
      behind.

### Legal and compliance

- [ ] 11. Confirm data retention periods for the privacy page. (See section 2.)
- [ ] 12. Confirm whether registration as a data controller applies.
- [ ] 13. Confirm whether any analytics or third-party tools will be used, so
      the privacy page is accurate on day one. **If any are added later, the
      privacy page has to change the same day** — it currently states plainly
      that the site loads nothing from anywhere else, and that statement is
      only true while it is true.
- [ ] 14. Legal review of the privacy page before launch. (Hard gate.)

### Assets

- [ ] 15. Logo as SVG, if it exists. Only a 1080px PNG exists today. The nav
      and footer marks are hand-built SVG recreations, which works, but a real
      SVG would improve `/img/og.png` and the favicon, both of which are
      currently rasterised from the PNG.
- [ ] 16. Any photography of SOSE's own work. The current imagery is generic
      stock and is the weakest part of the site. Even three phone photos of
      real sites, shot well, would beat it.

---

## 4. Verify nothing invented shipped

The site's first rule is that it states no fact SOSE has not supplied. Confirm
before launch:

- [ ] No `VERIFY` comment has been removed without the claim it guarded being
      removed or hedged with it. `grep -rn "VERIFY" content/ *.html */index.html`
      and read each hit.
- [ ] No project names, client names, testimonials, statistics, certifications
      or team members appear anywhere in the built HTML.
- [ ] No regulatory specific — a fee, a threshold, a timeline, a clause number
      — appears anywhere. Kenyan construction regulation is described in
      general terms only, and that is deliberate.
- [ ] The three field notes under `/insights/` carry no unsourced claim. They
      were converted from `content/insights/` with VERIFY blocks omitted.

---

## 5. Technical checks on the built site

Run these against the deployed URL, not localhost.

- [ ] **No external request from any page.** Open DevTools → Network, hard
      reload, and confirm every request is to the site's own origin. There
      should be no request to `fonts.googleapis.com` or `fonts.gstatic.com`;
      the typefaces are self-hosted from `/fonts/`.
- [ ] **No console errors** on the home page, a service page, `/project-check/`
      and an article.
- [ ] **`/sitemap.xml` and `/robots.txt` both serve**, and the sitemap lists
      exactly the seventeen live routes. Submit the sitemap to Google Search
      Console once the domain is verified.
- [ ] **Favicon and OG image resolve.** `/favicon.ico`, `/img/icon-180.png`,
      `/img/icon-512.png`, `/site.webmanifest`, `/img/og.png`.
- [ ] **Social previews render.** Paste the home page URL into the Facebook
      Sharing Debugger and X's card validator. `og:image` is 1200×630 and
      absolute, which is what both want.
- [ ] **The two mailto flows compose correctly** in a real mail client:
      the `/contact/` form and the "Send my results to SOSE" button on
      `/project-check/`. The readiness-check body is deliberately short; a
      mailto URL has a practical ceiling near 2,000 characters.
- [ ] **`/project-check/` works with JavaScript disabled** to the extent
      intended: the `<noscript>` note appears and points at the email address.
- [ ] **Lighthouse** on the home page, one service page and one article.
      Accessibility and Best Practices should be 100; investigate anything that
      is not.

---

## 6. Accessibility spot checks

The automated pass is done — heading order, alt text, contrast, focus rings and
reduced motion are all in place. These are the things a script cannot confirm.

- [ ] **Tab through the home page from the address bar.** First stop should be
      "Skip to content". Nothing invisible should take focus, and every stop
      should show a ring.
- [ ] **Open the mobile menu at 360px, then press Escape.** It should close and
      focus should return to the burger button.
- [ ] **Complete `/project-check/` using only the keyboard**, including reading
      the result, which is announced through a live region.
- [ ] **Turn on "reduce motion" at the OS level and reload the home page.** The
      hero should appear without the wipe, nothing should pulse, and no card
      should lift on hover.
- [ ] **Render at 360px, 768px and 1440px** on every page. No horizontal
      scroll at any width.
- [ ] **Zoom to 200%** on a service page and an article. Nothing should be cut
      off or overlap.

---

## 7. Optional, and honestly optional

None of these block launch.

- [ ] Compress the four JPEGs in `/img/`. They total roughly 680 KB and are all
      unoptimised. WebP or AVIF alongside a JPEG fallback would roughly halve
      it, at the cost of a `<picture>` element on each.
- [ ] A 404 page. There is none; the host serves its default.
- [ ] Search Console and Bing Webmaster Tools verification.
- [ ] Decide whether SOSE wants analytics at all. The current answer is no, and
      the privacy page is stronger for it. If that changes, item 13 above
      applies.

---

## 8. Ship

- [ ] `npm run check` and `npm run links:strict` both pass on the exact commit
      being deployed.
- [ ] Deploy.
- [ ] Load every one of the seventeen routes on the live domain once, by hand.
      It takes five minutes and it is the only check that tests the real thing.
