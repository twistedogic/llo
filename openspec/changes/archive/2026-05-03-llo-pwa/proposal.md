## Why

People who want to live intentionally lack a tool that applies SRE-style measurement discipline to personal life — tracking leading indicators (daily inputs) that compound toward long-term outcomes, with honest absence-as-signal semantics and no gamification pressure. LLO fills that gap as a private, offline-first PWA.

## What Changes

- New Svelte TypeScript PWA application (`/src`)
- Offline-first data layer using IndexedDB
- 9 pre-configured life metrics across 4 groups (Social, Body, Mind, Life)
- Sequential card-swipe daily entry with progressive depth unlock
- Immutable daily commit — sealed same-day, absence treated as signal not failure
- SLO-style threshold + budget model per metric
- Dashboard with auto-switch to Trends when today is committed
- Weekly / monthly / quarterly trend views with gap-preserving line charts
- Calendar heatmap history view with day drill-down
- Correlation heatmap across metrics (Pearson, v1 simple)
- CSV export of all logged data
- PWA manifest + service worker for installability and offline use

## Capabilities

### New Capabilities

- `daily-entry`: Sequential card-swipe entry flow — binary gate (Type A) or numeric input (Type B), progressive depth unlock, rolling average defaults, skip=0 for counts, journal card, immutable commit
- `metric-definition`: Metric schema — name, type, unit, SLO target, invert flag, "why" sentence, grouping; 9 pre-configured metrics with sensible defaults
- `slo-tracking`: SLO computation engine — threshold + window + budget model, miss-rate for habits, threshold for numerics, burn rate derived from rolling window
- `trend-views`: Weekly sparklines, monthly line charts (gaps for no-entry), quarterly smoothed curves, correlation heatmap
- `dashboard`: Home screen — SLO status bars, budget remaining, group view (Social/Body/Mind/Life), auto-switch to trends post-commit
- `history-view`: Calendar heatmap + day drill-down showing all metric values and journal for a selected day
- `data-storage`: IndexedDB offline-first storage — daily log entries, metric definitions, journal entries; immutable committed days
- `csv-export`: Full data export — one row per day, columns per metric + journal, downloadable from app

### Modified Capabilities

## Impact

- New project — no existing code affected
- Dependencies: Svelte + Vite, TypeScript, idb (IndexedDB wrapper), chart library (uPlot or Chart.js), vite-plugin-pwa
- No backend, no auth, no network dependency — fully client-side
