# i18n static deploy with hidden default locale

The site uses `hideLocale: 'default-locale'` in fumadocs' `defineI18n`, so
English URLs are bare (`/docs/foo/`) and Chinese URLs carry `/zh/`. But
`output: 'export'` writes everything under `/en/` and `/zh/` on disk — there is
no `/docs/` directory in `out/`. The CI pipeline bridges the gap:

```bash
cp -R deploy/en/. deploy/   # mirror EN tree to root
rm -rf deploy/en             # remove the source — /en/ must not be reachable
```

This means the web server needs no locale-aware rewrite rules. Bare paths hit
the filesystem directly. The only rewrite is a safety 301 from `/en/*` to `/*`
(for anyone who manually types it or follows a stale link).

## Why hide `/en/`

SEO. The bare-path canonical is the dominant pattern for default-locale sites
(Next.js docs, Vercel, Stripe). Google treats `/docs/foo/` and `/en/docs/foo/`
as separate URLs; if both resolve, one must 301 to the other or carry
`rel="canonical"`, or Google sees duplicate content. Hiding the prefix at
build time eliminates the duplication at the source.

## OpenResty behind ESA (CDN)

ESA terminates TLS and connects to the origin over HTTP. nginx therefore sees
`$scheme` as `http` and generates `Location: http://…` in every auto-redirect
(trailing-slash, `/en/` rewrite). The fix is `absolute_redirect off;` in the
server block — nginx emits relative `Location` headers and the browser resolves
them against the original `https://` scheme.

## Accept-Language negotiation

Only at `/`. Content pages must never negotiate — Googlebot does not send
`Accept-Language` and will not discover the alternate version.

Done at the ESA edge, not at the origin. ESA's rule engine supports
`http.request.headers["Accept-Language"]` as a matching field, so the redirect
executes before the request reaches the origin or the CDN cache layer — no
`Vary` header needed, no cache pollution, no extra round trip.

## Consequences

- **The CI copy step is load-bearing.** Without it, every English page 404s.
  The deploy workflow verifies key paths (`deploy/index.html`,
  `deploy/docs/index.html`) after the copy.
- **`/en/` must not resolve to content.** The rewrite returns 301 to the bare
  path. If the CI step fails to `rm -rf deploy/en`, both paths serve content
  and Google sees duplicates.
- **The sitemap and hreflang are correct by default.** fumadocs' sitemap
  generator respects `hideLocale` — English entries use bare paths, Chinese
  entries use `/zh/`. HTML `<link hreflang>` tags are bidirectional in both
  locales.
- **Baidu requires manual submission.** Unlike Google, Baidu does not
  proactively discover sitemaps. Register at ziyuan.baidu.com, verify the
  domain, and submit the sitemap URL.

## Considered and rejected

- **Nginx rewrite from bare paths to `/en/` subtree.** Would let the CI skip
  the copy step, but adds a rewrite rule for every request and makes the server
  config locale-aware — fragile when pages or directories are added.
- **Explicit `/en/` prefix (drop `hideLocale`).** Simplest server config (just
  `root /path/to/out`), but every English URL carries `/en/`, which is the
  minority pattern among reference sites and loses the bare-path canonical.
- **Accept-Language negotiation on all paths.** Googlebot does not send
  `Accept-Language`; same-URL-different-content breaks indexing. ESA would need
  `Vary: Accept-Language` on every response, collapsing CDN cache hit rates.
- **Accept-Language negotiation at the origin (nginx).** Works, but `/` must
  bypass CDN caching or carry `Vary: Accept-Language`, and every request to `/`
  incurs an origin round trip. ESA edge rules avoid both problems.
