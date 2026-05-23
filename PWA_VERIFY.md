# PWA verification (Brynier)

Date: 2026-05-23 (SAST)

Goal: confirm the PWA is installable and has a safe offline fallback.

## 0) One-time: redeploy after PWA changes

If you have not redeployed since the PWA changes, redeploy on Vercel so `manifest.webmanifest` and `sw.js` exist.

## 1) Verify manifest loads

1. Open `https://brynier.vercel.app/manifest.webmanifest` in your browser.
2. You should see JSON (not a 404).

## 2) Verify service worker registers (Chrome desktop)

1. Open `https://brynier.vercel.app/`.
2. Open DevTools → Application.
3. Go to Application → Service Workers.
4. Confirm a service worker is **Activated and is running** for `https://brynier.vercel.app`.

If it is not registering:
- Hard refresh (Ctrl+Shift+R)
- Or DevTools → Application → Storage → “Clear site data”, then reload.

## 3) Verify install prompt / installability

### Chrome desktop
1. Open `https://brynier.vercel.app/`.
2. In the address bar, click the “Install” icon (if shown), or menu → “Install Brynier…”.
3. Install and launch.
4. Confirm it opens in a standalone window.

### Android Chrome
1. Open `https://brynier.vercel.app/`.
2. Menu → “Add to Home screen” / “Install app”.
3. Install.
4. Launch from home screen.

## 4) Verify offline fallback

1. Open `https://brynier.vercel.app/` once while online.
2. DevTools → Network → check “Offline”.
3. Hard refresh the page.
4. Expected: you see the offline page (from `offline.html`).

Notes:
- Offline mode should show a clear message. We are not trying to make the whole app usable offline yet.

## 5) (Optional) Update service worker

If you make changes to `public/sw.js` later:
- DevTools → Application → Service Workers → “Update”, then reload.

## Done criteria

- Manifest returns 200.
- Service worker is activated.
- Install works (desktop and/or Android).
- Offline hard refresh shows the offline page.