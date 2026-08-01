# The home page and the docs pages get separate nav link sets

`baseOptions()` in `src/lib/layout.shared.tsx` used to hand one `links` array to
both `HomeLayout` and `DocsLayout`. Those two layouts do not render `links` in
the same place: `HomeLayout` puts them in the top bar, while `DocsLayout` routes
them into the **sidebar**, above the page tree (`fumadocs-ui/dist/layouts/docs/
slots/sidebar.js` renders `menuItems`, and `createLinkItemRenderer` turns a
`type: 'menu'` item into a collapsible `SidebarFolder`). A single shared array
therefore stacks a copy of the top-bar menus on top of the very page tree they
index. `baseOptions()` now carries only what both layouts share — brand, i18n,
theme switch, `githubUrl` — and each layout supplies its own `links`.

This also matches the references: on zed.dev, cursor.com, linear.app and
obsidian.md, the docs-page header shares nothing with the home-page header
except the download CTA (4 of 4 measured).

## Consequences

- **The home bar is our own component, `SiteHeader`, passed as `slots.header`.**
  Not a preference: upstream's `Header` hardcodes three breakpoints in className
  strings with no prop to reach them — links at `max-sm:hidden`, the actions at
  `max-lg:hidden`, and a `lg:hidden` hamburger rendered unconditionally, so
  640–1024 always shows both a full nav and a hamburger no matter how `links` is
  arranged. We want the opposite split (see below), which leaves overriding
  those utilities from `global.css` by `#nd-nav` specificity as the only
  alternative. That was tried first and reverted: it is invisible to anyone
  reading the component, and it breaks silently on a fumadocs bump.
- **The links never collapse; the actions do, into one row.** Docs, Blog and
  Community stay in the bar at every width — burying a site's navigation behind
  a tap is what makes a bar read as empty. The star count, language select and
  download button move together into the sheet below 640px, laid out as one
  right-aligned row rather than a stacked list. The wordmark drops to the mark
  alone below 768px.
- **640px is the English budget, not a round number.** Measured across both
  locales: the links are 232px in English against 182px in Chinese, the actions
  225px against 189px. With the wordmark gone English needs 545px and Chinese
  459px, so Chinese would in fact survive to ~390px and English fails at 480px.
  One breakpoint has to serve both, and 640 leaves English 79px of slack.
  Swept 15 widths from 360 to 1440 in both locales against the production
  build: overflow is 0 everywhere. **A fourth link or a longer label than
  "Community" spends that slack** — re-measure rather than assume.
- **Every control in the bar is a 32px box with 6px between.** Left to their
  intrinsic sizes the three actions came out 30, 34 and 32px tall, which made an
  even gap look uneven.
- **Theme switching is off on the home page and on in the docs.**
  `themeSwitch: { enabled: false }` on `HomeLayout` only; the control moves to
  `SiteFooter`. None of the 7 sites measured has a theme toggle in its home-page
  header, and Cursor — the only one with an explicit three-way switch — puts it
  in the footer. Docs pages keep fumadocs' native placement at the foot of the
  sidebar, which is also where Zed puts theirs.
- **`社区` is a `Popover`, not a nav menu.** fumadocs renders a `type: 'menu'`
  into a viewport spanning the whole bar — a mega-menu, right for a grid of
  product links and absurd for two chat invites. A popover anchors under its
  trigger and is sized by its contents, so nothing has to cap it.
- **The frost is a Tailwind utility on the shell, not a CSS declaration.**
  `backdrop-filter` written in `global.css` is stripped by the build: the served
  rule for `#nd-nav > div` arrives with no `backdrop-filter` at all, prefixed or
  otherwise, while the identical value set inline takes effect. The glass on the
  bar had therefore always been fumadocs' own `backdrop-blur-lg` (16px) on the
  wrapper div, which is why replacing the header took it away. It is now
  `backdrop-blur-[22px] backdrop-saturate-[1.65]` in `SiteHeader`, the value
  `global.css` had been asking for.
- **`githubUrl` is dropped from the home page's options** so fumadocs stops
  auto-appending its GitHub icon there; the bar carries its own GitHub link with
  the star count. The docs layout keeps `githubUrl`, so the sidebar's icon row is
  unchanged.
- **The star count is baked at build time and refreshed in the browser.**
  `output: 'export'` leaves no server to ask per request, and fetching only
  client-side reflows the bar on every load. `scripts/gen-stars.mjs` runs from
  `pnpm build` and writes `src/lib/stars.generated.ts`; the component refetches
  once mounted. api.github.com allows 60 unauthenticated requests an hour per IP
  and sends `access-control-allow-origin: *`, so a throttled request just leaves
  the baked number standing.
