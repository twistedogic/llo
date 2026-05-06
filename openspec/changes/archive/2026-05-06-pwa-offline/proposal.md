## Why

The PWA is currently not fully offline-capable. While the service worker precaches static assets (JS/CSS/HTML/icons), it lacks navigation fallback — meaning when offline, navigating to any route shows a blank/error screen instead of the cached SPA shell. This breaks the "function fully offline" guarantee in the data-storage spec.

## What Changes

- Add `navigateFallback` to vite-plugin-pwa workbox config so all navigation requests fall back to `index.html` when offline
- Add `navigateFallbackDenylist` (empty, future-proofed for any potential API routes)
- Ensure service worker registers and controls all pages from first load
- Verify offline behavior works via manual test

## Capabilities

### New Capabilities

<!-- No new capabilities — fixing implementation gap in existing spec -->

### Modified Capabilities

- `data-storage`: The existing "Offline-first IndexedDB storage" and "PWA installability" requirements already define offline behavior. This change fixes the implementation to actually meet those spec requirements.

## Impact

- `vite.config.ts` — workbox configuration only
- No new dependencies
- No changes to data model, UI, or feature behavior
- Offline behavior is purely a service-worker configuration fix