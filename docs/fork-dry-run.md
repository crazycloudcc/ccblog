# Fork → configure → deploy dry-run

Maintainer checklist. Run this on a **second GitHub account** (not the author account) so the path matches a cold visitor. Close [issue #4](https://github.com/crazycloudcc/ccblog/issues/4) only after every box is checked and every snag is a doc fix or a code fix.

Related: [Start Up](../content/notes/nextjs-blog-setup.md), [CONTRIBUTING](../CONTRIBUTING.md), [issue #6](https://github.com/crazycloudcc/ccblog/issues/6).

## 0. Accounts

- [ ] Second GitHub user is logged in
- [ ] A Vercel account that has never imported `crazycloudcc/ccblog`

## 1. Create the repo

Prefer **Use this template** over Fork:

- [ ] Open https://github.com/crazycloudcc/ccblog/generate
- [ ] Create a public repo owned by the second account
- [ ] Clone it

```bash
git clone git@github.com:<second-user>/ccblog.git
cd ccblog
```

## 2. Replace the demo identity

The committed `ccblog.config.ts` is the live demo. Overwrite it:

```bash
cp ccblog.config.example.ts ccblog.config.ts
```

- [ ] `name`, `author`, `handle`, `initials`, `url`, `social` are the second account
- [ ] `features.apps` is **false** (example default). Leaving the demo config as-is syncs the author's App Store list
- [ ] `source.href` still points at `https://github.com/crazycloudcc/ccblog` (keep the credit)

## 3. Local dev

```bash
npm install
npm run dev
```

- [ ] `/` boot sequence runs
- [ ] `/about` shows the new name and the `template: ccblog` / os-release panel
- [ ] `/playground` loads the editor (toolchain may take a first-fetch moment)

`/blog` search is expected to be degraded here — Pagefind is a `postbuild` artifact.

## 4. Production build locally

```bash
npm run build
npm run start
```

- [ ] `validate-config` prints OK
- [ ] App Store sync is skipped (`features.apps` false)
- [ ] `/blog` search (`grep -R`) returns a hit for "quicksort" or "Start Up"
- [ ] `/playground` Run on hello-world prints to stdout

## 5. Vercel

Either the README **Deploy** button or Import at https://vercel.com/new.

- [ ] Env: `NEXT_PUBLIC_SITE_URL=https://<this-preview>.vercel.app` (no trailing slash)
- [ ] Framework preset is Next.js (auto)
- [ ] Build command is the default `npm run build` (prebuild + postbuild ride along)

## 6. After deploy

Open the preview URL, not crazycloud.cc.

- [ ] `/` boot + notes
- [ ] `/blog` search works
- [ ] `/blog/quicksort` in-article Run produces sorted output (stdin `5` then `3 1 4 1 5` → `1 1 3 4 5`)
- [ ] `/about` `HOME_URL` still points at the **upstream** template
- [ ] `/feed.xml` and `/opengraph-image` use the preview host, not `crazycloud.cc`
- [ ] Theme toggle persists

## Known traps

| Symptom | Fix |
|---------|-----|
| Site still says crazycloudcc | You skipped `cp ccblog.config.example.ts ccblog.config.ts` |
| `/apps` lists someone else's titles | Set `features.apps: false` and rebuild |
| OG / RSS still name crazycloud.cc | `NEXT_PUBLIC_SITE_URL` missing or has a trailing slash |
| Search empty / degraded panel | You only ran `next dev`; need `npm run build` |
| Playground toolchain error in production | Note the URL and status; set `NEXT_PUBLIC_TOOLCHAIN_BASE` or file an issue |
| Hobby build timeout | WASM is not bundled; if it still times out, inspect pagefind / monaco in the build log |

## After the run

- [ ] Every failure is a merged doc or code fix (not a private note)
- [ ] Record the preview URL privately (do not add it to README)
- [ ] Comment on issues #4 and #6 with the date and the preview host, then close them
