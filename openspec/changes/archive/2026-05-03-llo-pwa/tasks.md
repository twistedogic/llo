## 1. Project Scaffold

- [x] 1.1 Initialise Svelte 5 + Vite + TypeScript project with `npm create vite@latest llo -- --template svelte-ts`
- [x] 1.2 Install dependencies: `idb`, `uplot`, `vite-plugin-pwa`
- [x] 1.3 Configure `vite-plugin-pwa` with manifest (name: LLO, theme colour, icons) and service worker for full offline cache
- [x] 1.4 Create base directory structure: `src/lib/metrics`, `src/lib/db`, `src/lib/slo`, `src/lib/export`, `src/components`, `src/views`
- [x] 1.5 Add global CSS reset and base typography (mobile-first, no framework)

## 2. Metric Definitions

- [x] 2.1 Define `MetricDefinition` TypeScript interface with fields: id, name, group, type, unit, sloTarget, sloCondition, sloWindow, sloRate, invertDisplay, whySentence
- [x] 2.2 Implement the 9 pre-configured metric constants in `src/lib/metrics/definitions.ts`
- [x] 2.3 Implement metric grouping map (Social / Body / Mind / Life) with display order

## 3. Data Storage Layer

- [x] 3.1 Implement IndexedDB schema in `src/lib/db/schema.ts` with stores: `daily_logs`, `app_settings`
- [x] 3.2 Implement `openDb()` function using `idb` with versioned migrations
- [x] 3.3 Implement `getDayLog(date)` — returns log or null for absent days
- [x] 3.4 Implement `saveDayLog(date, log)` — enforces immutability check (rejects write if already committed)
- [x] 3.5 Implement `commitDay(date)` — sets committed=true, committedAt timestamp, seals the record
- [x] 3.6 Implement `getLogsInRange(startDate, endDate)` — used by SLO and trend computations
- [x] 3.7 Implement `isTodayCommitted()` helper

## 4. SLO Computation Engine

- [x] 4.1 Implement `computeRateSLO(metricId, logs, window)` — rate of committed days meeting threshold, absent days excluded from denominator
- [x] 4.2 Implement `computeAverageSLO(metricId, logs, window)` — rolling average vs threshold with invert support
- [x] 4.3 Implement `computeErrorBudget(metricId, logs, window)` — remaining allowed misses before breach
- [x] 4.4 Implement `computeRollingAverage(metricId, logs, n)` — used as entry default
- [x] 4.5 Implement `computePearsonCorrelation(metricIdA, metricIdB, logs)` — for correlation heatmap
- [x] 4.6 Write unit tests for SLO engine covering: rate passing, rate failing, average inverted, absent day exclusion, budget exhausted

## 5. Daily Entry — Card State Machine

- [x] 5.1 Define entry state machine types in `src/lib/entry/machine.ts`: IDLE, IN_CARD, IN_DEPTH, IN_JOURNAL, IN_COMMIT, COMMITTED
- [x] 5.2 Implement state transitions: advance, back, skip, enterDepth, commitJournal, commit
- [x] 5.3 Implement entry session store in `src/lib/entry/session.svelte.ts` using Svelte 5 runes — holds current card index, per-metric draft values, journal draft
- [x] 5.4 Build `MetricCard.svelte` — Type B numeric card with stepper input, rolling average default, Skip button
- [x] 5.5 Build `EnergyCard.svelte` — dual input (start + end) with derived delta display, Skip button
- [x] 5.6 Build `JournalCard.svelte` — free-text textarea, optional, Done advances to Commit
- [x] 5.7 Build `CommitCard.svelte` — summary of logged vs skipped count, Commit Day button
- [x] 5.8 Build `EntryFlow.svelte` — orchestrates card sequence, handles swipe gestures (touch + mouse drag), wires state machine
- [x] 5.9 Implement swipe animation (CSS transform + transition, no library)

## 6. Dashboard View

- [x] 6.1 Build `SloBar.svelte` — single metric SLO status bar with compliance percentage, pass/breach indicator, no guilt language
- [x] 6.2 Build `BudgetBar.svelte` — error budget progress bar with remaining days label
- [x] 6.3 Build `MetricGroup.svelte` — renders a group heading with its SloBar children
- [x] 6.4 Build `Dashboard.svelte` — assembles all 4 groups, budget bars for rate SLOs, reactive to committed state
- [x] 6.5 Implement auto-switch logic: if today is committed, home screen renders Trends; otherwise renders EntryFlow

## 7. Trend Views

- [x] 7.1 Implement `src/lib/charts/sparkline.ts` — uPlot sparkline config for weekly view, null for absent days
- [x] 7.2 Build `WeeklyView.svelte` — one sparkline per metric, delta indicator vs previous week
- [x] 7.3 Implement `src/lib/charts/lineChart.ts` — uPlot line chart config with goal line, gap support (null values), why sentence slot
- [x] 7.4 Build `MonthlyView.svelte` — one line chart per metric, goal line, why sentence, absent days as gaps
- [x] 7.5 Implement smoothed curve computation (7-day rolling average) and stddev bands for quarterly
- [x] 7.6 Build `QuarterlyView.svelte` — smoothed curves with deviation bands over last 90 days
- [x] 7.7 Build `CorrelationHeatmap.svelte` — custom SVG matrix, Pearson shade intensity, tap-to-scatter, placeholder when <14 days
- [x] 7.8 Build `TrendsView.svelte` — tab switcher (Weekly/Monthly/Quarterly/Correlation), defaults to Monthly

## 8. History View

- [x] 8.1 Build `CalendarHeatmap.svelte` — monthly grid, committed day colour by SLO health, absent as empty outline, month navigation arrows
- [x] 8.2 Build `DayDetail.svelte` — shows all 9 metric values (or skipped state) + journal for a selected day
- [x] 8.3 Build `HistoryView.svelte` — calendar + day detail panel, absent days not tappable

## 9. CSV Export

- [x] 9.1 Implement `src/lib/export/csv.ts` — generates CSV string from all committed logs, correct column order, skipped=empty, absent days omitted
- [x] 9.2 Implement `downloadCsv(filename, content)` utility using Blob + anchor click
- [x] 9.3 Add Export CSV button to app (settings panel or nav), no-data message when empty

## 10. Navigation Shell

- [x] 10.1 Build `AppShell.svelte` — bottom navigation with 3 tabs: Home (entry/dashboard), Trends, History
- [x] 10.2 Implement view routing as Svelte conditional rendering (no router library needed)
- [x] 10.3 Add settings panel accessible from nav — contains Export CSV and app version

## 11. PWA & Polish

- [x] 11.1 Generate PWA icons (192×192, 512×512) and splash screens
- [x] 11.2 Defer PWA install prompt until after first commit using `beforeinstallprompt` event
- [ ] 11.3 Test offline functionality: kill network, reload, verify all views work
- [ ] 11.4 Test on iOS Safari: IndexedDB persistence, PWA install, touch swipe gestures
- [x] 11.5 Audit bundle size with `vite-bundle-visualizer`, target <200KB gzipped
- [x] 11.6 Verify uPlot renders null values as gaps (not zero) in line charts
