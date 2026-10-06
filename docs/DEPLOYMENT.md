# Deployment

## GitHub Pages (default)

Pushing to `main` runs [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): install → test → build → publish.

**One-time setup:** in the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

The site is served at `https://amirdirv.github.io/amir-iravani-portfolio/`. The workflow sets `--base-href` to `/<repo-name>/` automatically, so renaming the repository just works. Remember to update the absolute URLs in `src/index.html`, `public/robots.txt` and `public/sitemap.xml`.

Pull requests and other branches run [`ci.yml`](../.github/workflows/ci.yml): formatting check, tests and build.

## Custom domain (e.g. `amir-iravani.com`)

1. Create `public/CNAME` containing just the domain:
   ```
   amir-iravani.com
   ```
   When this file exists, the workflow builds with base href `/`.
2. At your DNS provider, add:
   | Type | Name | Value |
   | --- | --- | --- |
   | `A` | `@` | `185.199.108.153` |
   | `A` | `@` | `185.199.109.153` |
   | `A` | `@` | `185.199.110.153` |
   | `A` | `@` | `185.199.111.153` |
   | `CNAME` | `www` | `amirdirv.github.io` |
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS** once the certificate is issued.
4. Replace `https://amirdirv.github.io/amir-iravani-portfolio/` with `https://amir-iravani.com/` in `src/index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Any static host

```bash
npm run build                      # base href "/"
# upload dist/amir-iravani-portfolio/browser/
```

There is no routing, so no rewrite rules are needed. On cPanel, upload the contents of `browser/` into `public_html/`.

## Checklist after deploying

- Open the site in EN, IT and FA (`?lang=fa`)
- Paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh the preview card
- Submit `sitemap.xml` in Google Search Console
