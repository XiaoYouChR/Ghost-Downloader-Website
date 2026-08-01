# Ghost Downloader Website — Domain Model

## Glossary

- **Ghost Downloader (GD)**: Cross-platform multithreaded downloader supporting HTTP, BT/Magnet, FTP, M3U8, MPEG-DASH, eD2k. Runs on Windows, macOS, Linux, Android. Currently at v4.2.2.
- **Browser Extension**: Companion browser extension that sniffs page media (video, audio, images), displays "Download this video" buttons on pages, intercepts browser downloads, and bridges tasks to the desktop app. Supports Chrome, Edge, Firefox.
- **Media Sniffing**: The extension's ability to detect downloadable media resources on a web page — including HLS/DASH streams, embedded videos, and direct media URLs — and present them for download. Comparable to IDM's detection coverage.
- **TLS Fingerprint Emulation**: Technique to mimic real-browser TLS handshakes so download requests are not blocked by anti-bot systems. A key differentiator — competitors like Gopeed trigger anti-bot checks on ~50% of tested downloads.
- **Smart Chunking**: IDM-style intelligent file splitting for parallel download without requiring post-download file merging.
- **M3U8 Recording**: Ability to record live M3U8 streams with real-time decryption. Works on both desktop and Android. Not offered by IDM or other tested competitors.
- **Platform Parity**: Android version is not a stripped-down port — it supports the same core capabilities including M3U8 recording, background downloading, and notifications.
- **Ghost mark**: The website's brand symbol, stored at `public/brand/ghost-mark.svg`. A single-path silhouette with `fill-rule="evenodd"` cutout eyes — one color, any background, no separate dark/light asset. Distinct from the **app icon** (`public/images/logo.png`, the 3D rounded ghost with a smile), which stays unchanged.
- **Connection field**: The hero's abstract artwork. Vertical lines that tell a story top to bottom: **blockade → passage → speed** — the order the product actually works in.

## Product Positioning

- **Tagline (EN)**: "The only downloader you need."
- **Tagline (ZH)**: "你唯一需要的下载器。"
- **One-line positioning**: Ghost Downloader is the first downloader that is simultaneously the fastest, most complete in protocol coverage, most reliable against anti-bot, and truly cross-platform — replacing the need for multiple tools.
- **"AI-powered" is deliberately removed** from all marketing. It was a 2025-era buzzword that no longer differentiates.

## Competitive Positioning

- Benchmark data exists (see `/Users/xiaoyouchr/Downloads/benchmark.xlsx`) proving GD is fastest in 5/6 speed tests, with 100% download takeover success rate.
- **Do not name competitors on the homepage.** Use absolute numbers and category references ("IDM-level sniffing") instead.
- Detailed benchmark comparisons belong in documentation pages, not the landing page.
- IDM may be referenced as an industry benchmark (positive framing), not as a competitor to attack.
- **Speed claim must be honest**: at equal connection counts, GD is ~2.5x faster on constrained/slow networks; on fast servers the gap is marginal (~1.1x). Do not cherry-pick unequal-connection benchmarks.

## Website Narrative (section order)

1. **Hero** — A full-bleed abstract field carrying the whole first viewport, with the tagline, sub-copy and CTAs living inside it. No product screenshot above the fold. Sub-copy explains *what kind of* downloader this is (the tagline already names the category), following Raycast's two-sentence shape: capability sentence, then three qualities. EN: "A downloader that sniffs page media, records live streams, and replaces five tools. Fast, free, and open source." ZH tagline is culturally adapted, not literal: "下载器的集大成者。" (the culmination of downloaders — classical allusion, modestly confident rather than assertively exclusive). The screenshot is the reward for scrolling one notch, not a first-viewport element. The primary CTA names the visitor's platform ("下载 macOS 版" / "Download for Windows"), resolved on mount because the site is a static export — see [ADR 0001](./docs/adr/0001-platform-aware-cta-under-static-export.md).
2. **Resilience** — "Fast where it matters" (2.5x on constrained networks) + "Never blocked" (TLS fingerprint, 100% completion rate). Speed and reliability as one unified story, not a raw speed claim.
3. **Browser Sniffing** — "See it. Sniff it. Download it." Extension → desktop flow, "Download this video" button, M3U8 on-demand + live recording support. Three beats: page button → extension popup → desktop task.
4. **Protocol Coverage + Android** — "One app instead of five." Protocol grid (HTTP / BitTorrent / FTP / M3U8 / DASH / eD2k), two desktop feature shots (live recording, parsers), then an Android beat below them: "Same engine on your phone" with a 9:16 phone screenshot. The Android story was merged here because the Android argument is "it records live streams too" — the same argument as the M3U8 beat, on a different device.
5. **Download CTA** — "Get Ghost Downloader" / "Free and open source." Four platform cards side by side plus browser extension links. **This band does no platform detection** — it lays all four out and lets the visitor choose, and `recommended` marks the preferred *build within* a chosen platform (Installer over Portable), not the visitor's OS. Only the Hero CTA detects the platform. Chinese visitors get a GitCode mirror for domestic CDN speed.

## Hero visual — the connection field

The first viewport is a single abstract field, in the Raycast tradition where the hero artwork *is* the product's argument rather than decoration. Ours is built from vertical lines, and it tells one story top to bottom: **blockade → passage → speed**. That is the product's real causal order — clear the fingerprint check first, and only then does parallel chunked downloading mean anything. It also runs in the same direction the visitor scrolls.

- **Upper band — blockade.** Even spacing, unbroken full-height lines, static, pure neutral grey. Cold and man-made. This is the problem the page opens on.
- **Transition band — the ghost's waist.** The ghost is a *negative* form: the lines are what it displaced. The crossfade is a fast 10% band inside the silhouette's span, so no hard seam crosses open field.
- **Lower band — speed.** Lines break into segments of uneven length that drift downward at uneven rates, with a handful running cobalt. This is a chunked download progress bar stood on end — a true picture of what the app does.
- **Live connections.** Six accent columns carry a pulse — a dim comet that creeps down through the blockade, turns cobalt where the field changes character, and runs. One event states the entire product claim: held up, through, gone.
- **Page-wide arc:** full strength in the hero, ~30% under the screenshot that follows, absent through the four evidence sections, returning at ~25% behind the Download CTA. The opening and the close are the same field; the middle is proof.

## Design rules

- **Visual direction**: Raycast / Arc Browser aesthetic — opinionated, not generic, one story per viewport. No mock UI; real product screenshots only.
- **Palette**: Deep Cobalt (`#1d4ed8` light / `#93b4ff` dark) is the only saturated hue, on a near-black `#0a0b0d` / off-white `#f6f7f5` ground. Flat cobalt, never a gradient.
- **Type**: Archivo for display and body, JetBrains Mono for data (speeds, versions, architectures, protocol names).
- **Animation rule**: content entrance animations use `translateY(32px) → 0` only, never `opacity`. The failure mode of a transform-only entrance is a 32px offset — still readable. The failure mode of `opacity: 0` is invisible content that depends on script. Uniform across all four sections.
- **Mono labels name things, never sections.** Version numbers, protocol names, platform triples — fine. Category labels over headlines — never.
- **Home and docs get separate nav links** — see [ADR 0002](./docs/adr/0002-separate-nav-links-for-home-and-docs.md).

## Copy architecture

- `src/lib/copy/en.ts` is the source of truth and defines the key set; `zh.ts` is typed as `CopyTable`, so a missed or invented key fails the build.
- Keys are flat and dotted (`hero.title`), not deeply nested. Adding a language means copying one file and translating values.
- Components receive a `Translate` function (`t('hero.title')`) rather than nested copy objects.
- fumadocs docs UI translations come from `@fumadocs/language/zh-cn` via the `translations()` builder.

## Documentation

Content lives in `content/docs/` with two folders (`user/`, `dev/`) plus standalone pages (`benchmark`, `donate`).

### Content rules

- No onboarding or IDM-era common knowledge (pause, resume, save path, speed limit, max tasks).
- Every page is either **(a)** behaviour nobody can guess, or **(b)** a symptom that repeats in the issue tracker.
- A repeated symptom that should be fixed in code (e.g. clipboard monitoring, 9 issues) does not get a docs page.
- Symptom pages get their own URL so search lands the reader on the answer directly.
- UI text in docs must come from the app's source (`self.tr(…)` / `gd3.en_US.ts`), never invented.

### i18n filenames

Unsuffixed = default language = English. Chinese = `*.zh.mdx` / `meta.zh.json`.

China-specific topics (LinkSwift, 百度网盘) may ship as `*.zh.mdx` only — they won't appear in the English sidebar.

### Frozen URLs

`/zh/docs/donate/` — app's `DONATE_URL` in `constants.py` points here. Cannot be changed in shipped binaries.

### 控件规矩

All registered globally in `mdx.tsx`. Each has one allowed use; anything else is a bug.

| 控件 | 只允许用在 |
|---|---|
| `Steps` | 必须按顺序做完才生效的流程 |
| `Tabs` | 同一件事在不同平台的不同做法，必带 `groupId="os"` |
| `Callout` | 只用 `warn`/`error`，一页最多一个 |
| `Accordions` | 症状列表 |
| `Files` | 真实目录结构 |
| `TypeTable` | 设置项与 RPC 参数 |
| `Cards` | 跨页导航，不罗列功能点 |
| `ImageZoom` | 产品截图 |
| `Banner` | 不用 |
| `GithubInfo` | 只在开发者文档 |

### 实测记录

标题是「实测记录」不是 benchmark：单次测量、家庭宽带。点名竞品、写出输的项。详见 `project-benchmark-methodology` memory。
