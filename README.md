# PACE R1 — Landing Page (TOLBAWEB demo)

Mobile-only landing page for a men's running shoe. Darija (Arabic, RTL). Portfolio demo: no real orders are sent.

## Structure
```
.vscode/        editor settings (Live Server)
assets/
  images/       product photos (see image-sources.md)
  image-sources.md
css/style.css   all custom styles
js/main.js      CONFIG (price, sizes, images, FAQ) + gallery, form, animations
index.html      page markup (Tailwind via CDN)
```

## Run locally
1. Open the folder in VS Code and install "Live Server" (suggested automatically).
2. Right-click `index.html` → Open with Live Server.
3. On your phone (same Wi-Fi): `http://<your-computer-IP>:5500`.

Or: `python3 -m http.server 8000` then open `http://localhost:8000`.

## Customize
Edit the `CONFIG` object at the top of `js/main.js`: price, sizes, max quantity, images, FAQ.

## Images
Put licensed photos in `assets/images/` and log each source in `assets/image-sources.md`.
