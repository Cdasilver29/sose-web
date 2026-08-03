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

## After the result

Two actions:
- Send my results to SOSE. Composes an email containing the answers so the first
  conversation starts with context instead of twenty questions.
- Copy results. For their own records.

## Build notes

Plain TypeScript, no framework. Fully keyboard operable, radio groups with proper
fieldset and legend, results announced via a live region. State lives in memory
only, nothing persisted, nothing transmitted until the user acts. Honest framing
throughout: this is a prompt to think, not an engineering assessment, and the
results page should say exactly that in one line.
