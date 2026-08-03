# Design notes

Decisions already made, so nobody relitigates them mid-build.

## Why the hexagon carries everything

The logo gives us one distinctive shape and two colours. Rather than introduce
new decorative elements, the hexagon does structural work across the site: nav
wordmark, hero background mark, checkmark container, process step number holder,
section marker on interior pages, and the bullet on insight cards. This is what
keeps the site from reading as a template with the client's colours swapped in.

Rule: before adding a new shape, ask whether the hexagon can do that job.

## Why home is the only full-viewport hero

Full-height heroes on every page make a site feel like a series of adverts.
Interior pages use a compact navy header, around 340px, which reads as a document
set. It also means the first real content is above the fold on interior pages,
which matters more there than on home.

## Why there is no Projects page yet

Because there are no projects to show. A case studies section with invented
projects is the single fastest way to lose a serious client, who will ask about
one in the first meeting. Build the component, ship the route when the content
exists.

## Why the readiness check exists

Every engineering site wants a trust signal. Most fake one with statistics. SOSE
does not have the numbers yet, so the site earns trust a different way: by giving
something useful away before asking for anything. The check also does lead
qualification, since a completed result tells SOSE exactly what stage the enquiry
is at.

## Why insights, not a blog

"Blog" implies cadence, and an abandoned blog with three posts from 2026 is worse
than no blog. "Field notes" implies occasional, considered writing. Three good
articles that stay accurate for years beat twenty that go stale.

## Type scale

Playfair Display carries all headings, Inter carries everything else. Playfair is
used at large sizes and with restraint, so it stays characterful rather than
decorative. Italic Playfair in gold is the emphasis device in headings; use it
once per heading, never twice.

## Things deliberately not done

- No scroll hijacking or smooth-scroll libraries
- No page transition framework
- No parallax beyond what the hero already does
- No carousels except where content genuinely exceeds the viewport
- No cookie banner, because there are currently no cookies to consent to
