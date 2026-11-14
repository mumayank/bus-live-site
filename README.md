# Bus Live showcase

A static one-page showcase for the Bus Live Android app. Real screenshots, hand-drawn notes, and a floating bus you can drag around.

## Preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy

Push to `main`. GitHub Pages serves the repository root. No build step, no dependencies, no runtime network calls.

## Notes

- The Install now links point at the latest release in `mumayank/bus-live-releases`.
- The download button is a plain link, so there is no script to maintain when a version ships.
- The trip link in the settings screenshot is replaced with `<your link here>`.
- No analytics, forms, cookies, or third-party scripts.
- Fonts, icons, illustrations, and screenshots are served locally.
- `source-shots/` is local-only and is excluded from git.

## Share card

`assets/og-card.jpg` is the 1200x630 image WhatsApp and other link previews show. It is rendered from `tools/og-card.html`, which uses the site fonts and the current home screenshot, and marks itself ready only after both have loaded.

Regenerate it after the hero copy, fonts, or home screenshot change:

```bash
python3 -m http.server 8099 &
SERVER_PID=$!
trap 'kill $SERVER_PID' EXIT
npx playwright screenshot --channel chrome --viewport-size "1200,630" \
  --wait-for-selector 'html[data-ready="true"]' \
  http://127.0.0.1:8099/tools/og-card.html assets/og-card.jpg
```

WhatsApp caches previews and preview images by URL. When the card changes, publish it under a new file name and update `og:image` and `twitter:image` in `index.html` instead of overwriting the old file.
