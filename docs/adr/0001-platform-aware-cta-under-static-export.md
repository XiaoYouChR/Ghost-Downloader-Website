# Platform-aware download CTA under a static export

The site is `output: 'export'` (see `next.config.mjs`), so there is no server at
request time and no `User-Agent` to read — not from `headers()`, not from
middleware. Every reference site we measured puts a platform-specific label on
its hero CTA (`Download for Mac`, `Download for macOS`, `Get Obsidian for
macOS`, `Download now` — 5 of 6), so we do the same, but the label can only be
resolved **after hydration**. The hero button therefore ships a generic label in
the static HTML and swaps to the platform-specific one on mount, reserving the
width of the widest candidate so the swap moves nothing.

The reservation is done by **stacking every candidate label in one CSS grid
cell** (`col-start-1 row-start-1`) and hiding all but the active one with
`visibility: hidden`. The grid track sizes itself to the widest child, so the
width is correct in every locale and stays correct when the copy changes — with
no measured constant to maintain. `visibility: hidden` rather than
`display: none` is what makes this work: it reserves layout space, and it also
removes the inactive labels from the accessibility tree, so no `aria-hidden` is
required.

## Consequences

- **The stacked hidden labels are load-bearing, not dead markup.** Deleting them
  and rendering only the active label makes the most important element of the
  first viewport visibly resize a beat after paint.
- **Four extra label strings ship in the HTML.** Accepted: they are short, they
  are invisible to assistive technology, and the alternative — a hardcoded
  `min-width` — silently goes wrong the first time anyone edits the copy.
- **The hero's two CTAs now stack on phones.** Naming the platform makes the
  primary button 230px in English; with "View on GitHub" at 178px they cannot
  share a 350px row at any gap, so `hero.tsx` switches to a full-width column
  below `sm`. This is caused by the label, not by the width reservation — the
  active label is 230px with or without it. It costs roughly 60px of the
  silhouette's copy budget, which is why the stacked pair is given matched
  widths and heights: the cost reads as a decision rather than an accident.
  `primaryAction` carries `border border-transparent` for the same reason —
  without it the borderless primary is 2px shorter than the outlined secondary,
  which a flex row hides by stretching but a column does not.
- **The fallback label must be a complete, correct CTA on its own**, because it
  is what a no-JS visitor, a crawler, and the first paint all get. "Download" /
  "免费下载" qualifies; "Download for …" does not.
- **The top bar's `Download` button never swaps.** All 7 sites measured keep a
  generic label there; only Warp adapts, and it adapts its `href`
  (`?package=dmg` vs `?package=exe_x86_64`), not its text. Generic in the bar,
  specific in the hero, is the division of labour the references converged on.

## Considered and rejected

- **Server-side detection from the `User-Agent` header.** Foreclosed by
  `output: 'export'`. Adopting it would mean giving up static hosting, which the
  deploy pipeline depends on (`.github/workflows/deploy.yml` copies
  `deploy/en/index.html` to the site root).
- **Swapping the label without reserving width.** Cheapest to write, and the
  reason this ADR exists — the resulting shift lands on the hero CTA, inside the
  ghost's negative space where the composition is tightest.
- **Keeping the hero label generic and only varying the `href` (Warp's move).**
  Viable, and it needs none of this machinery. Rejected because a hero CTA that
  names the visitor's platform also answers "does this run on my machine?" in
  the first viewport, which a bare "Download" does not.
