# Deployment

The site is served from **https://amir-iravani.it** on the GoDaddy cPanel host, with a mirror on GitHub Pages.

```
push to main
   └─► GitHub Actions (.github/workflows/deploy.yml)
         ├─ npm ci → tests
         ├─ build (base href "/")      → commits the output to the `deploy` branch
         └─ build (base href "/<repo>/") → GitHub Pages mirror
                                   │
cPanel host: ~/amir-iravani.it is a git checkout of `deploy`
         └─ cron, every 5 minutes: git fetch + reset to origin/deploy
```

There is no build on the server, so the host needs neither Node nor npm. The `deploy` branch holds only static files.

## One-time server setup

Requirements: the domain `amir-iravani.it` has an **A record → 92.204.16.155**, and the cPanel domain was created with document root `amir-iravani.it` ("Share document root" unticked).

SSH in from PowerShell:

```bash
ssh q9y2mpp9vjlh@92.204.16.155
```

Replace the empty document root with a checkout of the `deploy` branch:

```bash
ls -A ~/amir-iravani.it        # should be empty (or only cgi-bin / default files)
rm -rf ~/amir-iravani.it
git clone --branch deploy --single-branch https://github.com/amirdirv/amir-iravani-portfolio.git ~/amir-iravani.it
```

Add the auto-update cron job in **cPanel → Cron Jobs** (Common Settings: *Once Per Five Minutes*):

```bash
cd /home/q9y2mpp9vjlh/amir-iravani.it && git fetch -q origin deploy && git reset -q --hard origin/deploy
```

`reset --hard` (rather than `pull`) makes the checkout always match the branch exactly, whatever happened to it.

Then issue the certificate: **cPanel → SSL/TLS Status → Run AutoSSL**. `public/.htaccess` already redirects `http://` and `www.` to `https://amir-iravani.it`.

## Updating the site

Push to `main`. The host picks up the change within about 5 minutes of the workflow finishing. To update immediately:

```bash
ssh q9y2mpp9vjlh@92.204.16.155 "cd ~/amir-iravani.it && git fetch -q origin deploy && git reset -q --hard origin/deploy"
```

## Security notes

- The document root is a git checkout. `.htaccess` returns **403** for anything under `.git/`. Check it with `curl -I https://amir-iravani.it/.git/config`.
- Directory listing is disabled (`Options -Indexes`).

## Daily projects under the same domain

Each project can be published the same way into a sub-folder, e.g. `~/amir-iravani.it/sql-lab/`, from its own repo's `deploy` branch, with its own cron line. It is then served at `https://amir-iravani.it/sql-lab/` with no extra domain cost. Build that project with `--base-href /sql-lab/`.

## Moving away from GitHub Pages

The Pages mirror is kept while the domain settles. To retire it, delete the `pages` job and the Pages build steps from `deploy.yml`, then switch Pages off in **Settings → Pages**.
