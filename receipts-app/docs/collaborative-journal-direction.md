# Collaborative Journal Direction

## Goal
Shift Receipts away from tall insight decks and toward a collaborative notebook where the user's entries are primary and AI appears as a thoughtful writing partner around the edges.

## Product principles
- The journal entry is the main character.
- AI should feel like margin writing, not a dashboard.
- Long pages should collapse naturally instead of becoming endless stacks.
- Voice, image, and text all belong in the same notebook flow.
- Weekly/monthly reads should feel like a page spread, not a pile of cards.

## Concrete implementation backlog

### Phase 1 — Home becomes a journal stream
**Goal:** make `/app` feel like the front page of the notebook instead of a metrics dashboard.

- [x] Reframe home copy from dashboard language to notebook-home language.
- [x] Let fresh entries carry more of the page weight than stat tiles.
- [x] Add progressive reveal so the latest stream stays readable on mobile.
- [ ] Replace summary stat tiles with lighter chapter metadata (days active this week, last capture, pending reads).
- [ ] Add "continue this thread" affordances from home entries into related timeline/journal pages.
- [ ] Inline one short AI margin read directly inside the home stream rather than isolating it in a separate box.

### Phase 2 — Thread callbacks actually feel threaded
**Goal:** turn annotation follow-ups into visible conversations.

- [x] Group AI replies beneath the user note they answer.
- [x] Sort threads in natural reading order rather than reverse-log order.
- [ ] Allow replying to an existing thread instead of always creating a new top-level margin note.
- [ ] Add tiny callback anchors from AI notes/evidence cards into the relevant thread.
- [ ] Let day-page inline margin notes deep-link into the margin conversation section.

### Phase 3 — Progressive reveal across long pages
**Goal:** reduce scroll fatigue without hiding the notebook.

- [x] Introduce a shared collapsible section primitive.
- [x] Use folds for side notes and margin conversation sections.
- [x] Fold older home-stream items behind a deliberate reveal.
- [ ] Collapse long evidence stacks after the first 1–2 receipts.
- [ ] Collapse long day entry runs after the first few entries, with a "keep reading this day" affordance.
- [ ] Add inline "peek" summaries on closed sections so the page still feels alive.

### Phase 4 — Chapter spreads for week/month reads
**Goal:** weekly and monthly reads should feel like opening a spread.

- [ ] Split the insights page into a clearer lead-page / side-margin composition on desktop.
- [ ] Give month scope its own chapter-spread framing instead of reusing weekly language.
- [ ] Surface a short table-of-contents rail for days included in the active week/month.
- [ ] Place supporting notes as stitched side annotations, not stacked cards.
- [ ] Let the primary insight link directly to the exact day pages behind its evidence.

### Phase 5 — Mobile polish
**Goal:** preserve the notebook feeling on narrow screens instead of just shrinking desktop.

- [x] Tighten copy and spacing in collapsible controls and home-page sections.
- [x] Keep long supporting content hidden until asked for.
- [ ] Reduce border/chrome density on small screens.
- [ ] Audit tap targets on entry actions, annotation actions, and page-turn nav.
- [ ] Revisit heading scale and line-length on journal/day pages below 390px.
- [ ] Test voice/image entries inside collapsed sections for awkward overflow.

## Highest-leverage next code changes
1. **Inline chapter stream on Home** — combine latest entries and one short weekly notebook note in a single chronological/home stream component.
2. **Reply-in-thread actions** — extend annotation creation to optionally target an existing thread root and render nested callbacks under it.
3. **Day-page entry folding** — show the first few entries, then tuck the rest behind a fold with a count.
4. **Evidence progressive reveal** — keep only the strongest 1–2 receipts open by default in insights.
5. **Desktop chapter spread layout** — make week/month reads feel like a spread, not a centered stack.

## What changed in this pass
- Home is now framed more like a journal front page and less like a dashboard.
- The fresh-notes section now uses progressive reveal so older items can stay tucked away.
- Annotation callbacks are rendered as actual threads, with notebook replies grouped under the note they answer.

## Experience target
The app should feel less like "the AI analyzed your life" and more like "you and the AI are keeping a shared private journal together."