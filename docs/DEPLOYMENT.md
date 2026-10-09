# Deployment

The site is served from **https://amir-iravani.it** on the GoDaddy cPanel host.

```
push to main
   └─► GitHub Actions (.github/workflows/deploy.yml)
         ├─ npm ci → unit tests
         ├─ npm run build      → 28 prerendered pages + 404.html, sitemap.xml, llms.txt
         ├─ npm run seo:check  → crawler-style audit; any error stops the deploy
         ├─ static output      → committed to the `deploy` branch
         └─ GitHub Pages       → redirect stub to amir-iravani.it (no duplicate site)
                                   │
cPanel host: ~/amir-iravani.it is a git checkout of `deploy`
         └─ cron, every 5 minutes: git fetch + reset to origin/deploy
```

There is no build on the server, so the host needs neither Node nor npm. The `deploy` branch holds only static files.

`public/.htaccess` (copied into the build) makes Apache serve the site correctly:

| Rule | Why |
| --- | --- |
| `DirectorySlash Off` + rewrite to `…/index.html` | clean URLs such as `/it/projects/diar`, no trailing-slash duplicates |
| `/index.html` and trailing `/` → 301 | exactly one URL per page |
| `http://`, `www.` → `https://amir-iravani.it` (301) | one canonical host |
| `?lang=it` / `?lang=fa` → `/it`, `/fa` (301) | old language links keep their ranking |
| `ErrorDocument 404 /404.html` | custom 404 page with a real 404 status |
| `.git` → 403 | the document root is a git checkout |
| cache headers, gzip, security headers | performance and hardening |

Test the build locally exactly as the host serves it: `npm run build && npm run serve:dist` → http://localhost:4400

## One-time server setup

Requirements: the domain `amir-iravani.it` has an **A record → 92.204.16.155**, and the cPanel domain was created with document root `amir-iravani.it` ("Share document root" unticked).

Everything is done in the cPanel web UI (no SSH needed):

1. **Git™ Version Control → Create**, turn on *Clone a Repository*:
   - Clone URL: `https://github.com/amirdirv/amir-iravani-portfolio.git`
   - Repository Path: `amir-iravani.it`
2. **Manage** that repository → *Checked-Out Branch* → **`deploy`** → Update. (The default branch holds source code; `deploy` holds the built site.)
3. **Domains**: the document root of `amir-iravani.it` must be **`amir-iravani.it`** — not `public_html/amir-iravani.it`, which inherits the main site's `.htaccess` and returns 403/500.

Add the auto-update cron job in **cPanel → Cron Jobs** (Common Settings: *Once Per Five Minutes*):

```bash
cd /home/q9y2mpp9vjlh/amir-iravani.it && git fetch -q origin deploy && git reset -q --hard origin/deploy
```

`reset --hard` (rather than `pull`) makes the checkout always match the branch exactly, whatever happened to it.

Then issue the certificate: **cPanel → SSL/TLS Status → Run AutoSSL**. `public/.htaccess` already redirects `http://` and `www.` to `https://amir-iravani.it`.

## Updating the site

Push to `main`. The host picks up the change within about 5 minutes of the workflow finishing. To update immediately: **cPanel → Git™ Version Control → Manage → Pull or Deploy → Update from Remote**.

## Security notes

- The document root is a git checkout. `.htaccess` returns **403** for anything under `.git/`. Check it with `curl -I https://amir-iravani.it/.git/config`.
- Directory listing is disabled (`Options -Indexes`).

## Daily projects under the same domain

Each project can be published the same way into a sub-folder, e.g. `~/amir-iravani.it/sql-lab/`, from its own repo's `deploy` branch, with its own cron line. It is then served at `https://amir-iravani.it/sql-lab/` with no extra domain cost. Build that project with `--base-href /sql-lab/`.

## GitHub Pages

`amirdirv.github.io/amir-iravani-portfolio/…` now serves only a redirect stub (`noindex`, canonical to the domain) that forwards to the same path on `amir-iravani.it`, so old links keep working and search engines see one site.

## After deploying

- Google Search Console: add the `amir-iravani.it` domain property, submit `https://amir-iravani.it/sitemap.xml`.
- Bing Webmaster Tools: import from Search Console.
- [Rich Results Test](https://search.google.com/test/rich-results) on `/` and a project page.
- LinkedIn [Post Inspector](https://www.linkedin.com/post-inspector/) to refresh share previews.
