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

## Root redirect for Chinese visitors

Only at `/`, as two ESA 请求重定向 rules, both static 302 to
`https://gd.xychr.com/zh/`. The console's expression builder only accepts flat
`and` chains, and its header operators have no `starts_with`, hence two rules
and `contains`:

```
i18n-zh:     (http.host eq "gd.xychr.com" and http.request.uri.path eq "/" and http.request.headers["accept-language"] contains "zh" and not http.cookie contains "locale=en")
i18n-chosen: (http.host eq "gd.xychr.com" and http.request.uri.path eq "/" and http.request.cookies["locale"] eq "zh")
```

Why it exists: until 2026-07-28 `/` was a Chinese-titled page that
JS-redirected to `/zh/`, and every Baidu search click in the origin logs landed
on `/`. Commit 8a6faa5 replaced it with the English home; Baidu clicks stopped
on 2026-08-11 and `site:gd.xychr.com` went to zero, although Baiduspider kept
fetching `/zh/` with 200.

- **`contains "zh"` also catches English-first browsers with Chinese as a
  fallback.** They land on `/zh/`, switch once, and the cookie keeps them on
  English.
- **No Baiduspider rule yet.** Whether Baiduspider sends a Chinese
  `Accept-Language` is unknown; the origin log format records
  `$http_accept_language` to find out before adding a user-agent rule.
- **Googlebot and Bingbot are not redirected.** They send no Chinese
  `Accept-Language` and keep crawling the English `/`, which stays `x-default`.
  Google's hreflang docs name "auto-redirecting home pages" as an x-default
  case; its advice against language redirects is about redirecting every page.
- **`locale` cookie** is written by `LocaleProvider` when the visitor picks a
  language, so either choice sticks on the next visit to `/`.
- **Edge, not origin.** The rule runs before the 30-day ESA cache, so `/` needs
  no `Vary` and the cache stays shared.

The site has no banner on `/`; the redirect replaces it.

hreflang uses `zh`, not `zh-CN`: `zh-CN` targets users located in mainland
China, and Google sees mainland visitors behind proxies as HK/JP/US. With
`zh-CN`, a Chinese-UI search from any non-CN region showed neither `/` nor
`/zh/` in the top 30 (measured 2026-10-22).

## Removed docs pages

The docs tree was reorganised three times. Instead of a per-URL map, any 404
under `/docs/` or `/zh/docs/` 301s to that docs index:

```nginx
location /docs/    { error_page 404 = @docs; }
location @docs     { return 301 /docs/; }
location /zh/docs/ { error_page 404 = @zhdocs; }
location @zhdocs   { return 301 /zh/docs/; }
location = /en     { return 301 /; }
```

The full server block lives in 1Panel at `/opt/1panel/www/conf.d/gd.conf`.

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
- **A "切换到中文" banner on `/` instead of a redirect** (8a6faa5, 2026-07-28).
  Search engines saw only an English `/`; Baidu dropped the site two weeks
  later.
- **An ESA edge function.** The 请求重定向 rule can match headers and cookies
  directly, so there is no code to deploy.
