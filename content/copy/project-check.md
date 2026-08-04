# Project Readiness Check

The site's one interactive tool, and its main lead generator. It replaces the
fake statistics a template would use with something genuinely useful.

Page header
Eyebrow: Free tool
H1: Are you ready to break ground?
Standfirst: Eight questions, two minutes. You get an honest read on where your
project stands and what to sort out next. Nothing is sent anywhere unless you
choose to send it.

## Questions

Each is yes / no / not sure. Grouped in three stages.

Land and permissions
1. Do you have clean title to the land, in the name that will hold the building?
2. Have you confirmed what the local authority will allow you to build on this
   plot?
3. Do you know which approvals your project needs before work can legally start?

Ground and design
4. Has the soil been investigated, or are you assuming it is fine?
5. Do you have complete drawings that a contractor could price without guessing?
6. Do you know where surface water goes during heavy rain, both on your plot and
   from your neighbours?

Money and delivery
7. Is your budget based on current material and labour rates, with a contingency
   you have not already spent?
8. Do you have a written scope and a way of controlling variations once work
   starts?

## Scoring

Count yes answers. Not sure counts as no, and the result says so plainly.

7 to 8 yes: Ready to move. You've done the work most projects skip. The remaining
risk is in execution and control, not preparation.

4 to 6 yes: Nearly there. There are gaps that get expensive once concrete is
poured. Fix them while they are still paperwork.

0 to 3 yes: Stop and plan. Starting here is how projects stall halfway. The good
news is that everything on this list is cheaper to solve now.

For every "no" or "not sure", show the specific gap in the results, in one
sentence, with a link to the relevant service or field note. Example: "Soil not
investigated. A foundation designed on assumption is the most expensive guess in
construction. See: Before you break ground."

## Gap lines

One per question, shown only when that question was answered no or not sure.

1. Title not confirmed. Everything above ground rests on that document, and an
   ownership or boundary problem found in month six is no longer a legal problem.
   See: Before you break ground → /insights/before-you-break-ground/
2. You do not yet know what this plot allows. What you are permitted to build
   shapes the design, so find out before you pay anyone to draw it.
   See: Construction consulting → /services/construction-consulting/
3. Approvals not mapped. Work that starts before the paperwork is in place is
   work that can be stopped.
   See: Construction consulting → /services/construction-consulting/
4. Soil not investigated. A foundation designed on assumption is the most
   expensive guess in construction.
   See: Before you break ground → /insights/before-you-break-ground/
5. Drawings are incomplete. A contractor who has to guess prices the guess, and
   you pay for it twice.
   See: Building solutions → /services/building-solutions/
6. Drainage is unresolved. Water with nowhere to go finds the foundations, and
   your neighbour's runoff becomes your problem the moment it arrives.
   See: Building green without the premium →
   /insights/building-green-without-the-premium/
7. The budget is not grounded in current rates. A figure built on old prices,
   with a contingency already spent, is not a budget.
   See: Project management → /services/project-management/
8. No written scope, no control on variations. Every change then becomes a
   negotiation you are having from the weaker position.
   See: Project management → /services/project-management/

## Short labels

Used only in the emailed and copied result, one per question, in place of the
full question text. A mailto: URL has a practical ceiling around 2,000
characters and the full wording was already close to it, so the summary names
the subject of each question rather than repeating it. The band, the blank
lines that separate the blocks, and the framing line are unchanged.

1. Land title
2. Permitted use
3. Approvals
4. Soil investigation
5. Drawings
6. Surface water
7. Budget and contingency
8. Scope and variations

## Result framing

Score line: [n] of 8 checks clear.

Honest framing line, always shown with the result: This is a prompt to think,
not an engineering assessment. It cannot see your site, your drawings or your
budget.

Shown when any answer was "not sure": Not sure counts as no. On a build, an
answer nobody is certain of is a gap until someone checks it.

Unanswered questions: Answer all eight questions to see your result.

Submit button: See my result

Gaps heading: What to sort out

No-JavaScript note: This check needs JavaScript to score your answers. If you
have it switched off, email info@sosengineeringke.com and we will walk the same
eight questions with you.

## Related

Before you break ground → /insights/before-you-break-ground/
What we do → /services/

## After the result

Two actions:
- Send my results to SOSE. Composes an email containing the answers so the first
  conversation starts with context instead of twenty questions.
- Copy results. For their own records.

## Cross-link card

Wherever the check is offered from another page:
Not sure what stage you're at? Run the two-minute readiness check → /project-check

## CTA band

Headline: Want a second read on the gaps?
Sub: Bring the result to the first conversation and we can start with what
matters instead of twenty questions.
Primary: Talk to us → /contact
Secondary: How a project runs → /approach

## Build notes

Plain TypeScript, no framework. Fully keyboard operable, radio groups with proper
fieldset and legend, results announced via a live region. State lives in memory
only, nothing persisted, nothing transmitted until the user acts. Honest framing
throughout: this is a prompt to think, not an engineering assessment, and the
results page should say exactly that in one line.
