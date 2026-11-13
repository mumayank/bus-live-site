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
