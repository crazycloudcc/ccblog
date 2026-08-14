# README media

Promotional stills and the hero GIF live here so they are not shipped in the Vercel bundle.

Capture from the **production** site (`https://crazycloud.cc` or `npm run build && npm run start`), desktop **1440×900**, dark theme, bookmarks hidden. Wait for the home boot sequence to finish before stills.

| File | Shot |
|------|------|
| `home-dark.png` | Terminal window + sidebar + notes after boot. Width ≥ 1400. |
| `playground-run.png` | `/playground` with stdout visible after a successful run. |
| `quicksort-embed.png` | `/blog/quicksort` showing the in-article `:::playground` block. |
| `boot-and-run.gif` | 8–12s, **under 2.5 MB**: home boot (2–3s) → click playground → Run → stdout. |
| `social-preview.png` | 1280×640 crop of `home-dark.png` for GitHub Settings → Social preview. |

Compress the GIF:

```bash
ffmpeg -i raw.gif -vf "fps=12,scale=1200:-1:flags=lanczos" -loop 0 docs/media/boot-and-run.gif
```

If it is still over 2.5 MB, drop to width 1000 or 10 fps.

Use real screen captures. Do not substitute generated mockups.

Recapture from a running production server:

```bash
npm run build
npx next start -p 3010
# in another shell, after: npm --prefix /tmp/ccblog-capture install puppeteer-core
BASE_URL=http://127.0.0.1:3010 node scripts/capture-readme-media.mjs
```

The script writes the five files above. Trim a long GIF if needed (`ffmpeg -ss 1 -i …`). Then confirm the embeds at the top of `README.md` and `README.zh-CN.md`.
