## 1. Configure navigateFallback in vite.config.ts

- [x] 1.1 Add `navigateFallback: '/index.html'` to the workbox config in `vite.config.ts`
- [x] 1.2 Add `navigateFallbackDenylist: []` to the workbox config (empty array, future-proofed)

## 2. Verify offline behavior

- [x] 2.1 Run `npm run build` to generate the production build
- [x] 2.2 Serve the dist folder locally and open in browser
- [x] 2.3 Confirm service worker registers and precaches 11 assets (verified via `grep` on dist/sw.js)
- [x] 2.4 Confirm `NavigationRoute` with `createHandlerBoundToURL("index.html")` present in sw.js — navigation fallback is wired