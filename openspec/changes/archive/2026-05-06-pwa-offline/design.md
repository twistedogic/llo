## Context

**Current state**: `vite.config.ts` uses `vite-plugin-pwa` but the workbox config has an empty `runtimeCaching` array and no `navigateFallback`. Static assets (JS/CSS/HTML) are precached, but navigation requests have no fallback.

**The problem**: When offline, a navigation request (e.g., going from Dashboard to History view) is intercepted by the service worker, finds no cached response, and returns a network error instead of serving `index.html`.

**Deployment**: GitHub Pages at base path `/llo/`. Service worker scope must cover the entire origin. SPA routing is client-side (no server-side routing).

## Goals / Non-Goals

**Goals:**
- SPA navigation works offline via service worker fallback to `index.html`
- All static assets (JS, CSS, fonts, icons) served from cache when offline
- No runtime network requests (app is fully self-contained)

**Non-Goals:**
- Custom service worker code (using plugin defaults)
- Runtime caching strategies for external resources (no external resources used)
- Background sync (no multi-device sync planned)
- Push notifications

## Decisions

### D1 — Use `navigateFallback: '/index.html'` over custom handler

**Decision**: Configure the built-in `navigateFallback` workbox option to serve `index.html` for all navigation requests that don't match a precached asset.

**Rationale**: `vite-plugin-pwa` generates a service worker that already has the proper scope and registration. Adding `navigateFallback` tells workbox to use the precached `index.html` as the fallback for navigation requests. This is the plugin's recommended approach for SPAs.

**Alternative considered**: Write a custom service worker with a navigation handler — rejected as unnecessary complexity. The plugin handles this pattern.

### D2 — `navigateFallbackDenylist: []` (empty, prepared for future)

**Decision**: No denylist. All routes fall back to `index.html`. If API routes are added in future, they can be added to denylist at that point.

**Rationale**: The app has no API routes currently. Setting the denylist to empty now documents the intent and makes it easy to add exclusions later.

### D3 — `appEntry: 'public/entry-worker.ts'` or plugin default

**Decision**: Use plugin defaults. No custom entry worker needed for this change.

**Rationale**: The plugin auto-generates the service worker from the workbox config. No custom code needed.

### D4 — `registerType: 'autoUpdate'`

**Decision**: Keep existing `registerType: 'autoUpdate'`.

**Rationale**: When a new service worker is installed (app updated), it takes control on next navigation. Users always run the latest version after refreshing. This is the standard PWA behavior.

## Risks / Trade-offs

- **Stale service worker on revisit** → `autoUpdate` handles this; user refreshes once and gets the new version.
- **Base path `/llo/`** → `scope: '/'` in manifest is relative to origin, so scope covers the entire app. Service worker scope will be `/llo/` which is correct.
- **No precache for fonts** → Currently no external fonts loaded. If added later, they should be added to `includeAssets` and/or `runtimeCaching`.

## Implementation

One file: `vite.config.ts`

```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
  manifest: {
    // ... existing manifest config ...
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
    navigateFallback: '/index.html',     // ← the key fix
    navigateFallbackDenylist: [],         // ← future-proof
    runtimeCaching: [],                   // no external resources to cache
  },
})
```

Then: build (`npm run build`), serve the dist folder offline, verify navigation works.