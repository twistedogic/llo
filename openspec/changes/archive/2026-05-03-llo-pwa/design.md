## Context

LLO is a greenfield TypeScript PWA with no backend. All data lives on-device. The design must prioritize offline reliability, a frictionless daily entry UX, and honest data semantics (absence ≠ zero). The SRE-inspired framing (SLOs, budgets, burn rate) shapes both the data model and the UI vocabulary.

Stack: **Svelte 5 + Vite + TypeScript**, **idb** (IndexedDB wrapper), **uPlot** (charts), **vite-plugin-pwa** (service worker + manifest).

## Goals / Non-Goals

**Goals:**
- Fully offline-capable PWA installable on mobile and desktop
- Immutable daily log with absence-as-signal semantics
- SLO computation over rolling 7 / 30 / 90 day windows
- Sequential card-swipe entry with progressive depth and rolling-average defaults
- Three trend views (weekly sparklines, monthly line chart, quarterly smoothed) + correlation heatmap
- Calendar heatmap history with day drill-down
- CSV export of all stored data
- Pre-configured 9 metrics with sensible SLO defaults

**Non-Goals:**
- Backend, sync, or multi-device support (v1)
- User accounts or authentication
- Social / sharing features
- Push notifications or reminders
- Custom metric creation UI (metrics are code-configured in v1)

## Decisions

### D1 — Svelte 5 + Vite over React/Next or SvelteKit

**Decision**: Plain Svelte 5 compiled app via Vite, no SvelteKit routing.

**Rationale**: No SSR needed, no file-based routing complexity. Single-page app with client-side view switching is sufficient. Svelte 5 runes give fine-grained reactivity ideal for the card-swipe state machine. Smaller bundle than React equivalents.

**Alternative considered**: SvelteKit — rejected because it adds server-rendering concepts to a purely client-side offline app, and the routing overhead isn't needed for ~4 views.

### D2 — IndexedDB via `idb` over localStorage

**Decision**: All persistent data in IndexedDB using the `idb` typed wrapper.

**Rationale**: localStorage is synchronous, size-limited (~5MB), and unsuitable for structured daily log data that will grow over years. IndexedDB supports indexes, transactions, and typed schemas. `idb` removes the raw IDB callback complexity.

**Schema**:
```
Store: daily_logs
  key: date (YYYY-MM-DD string)
  value: {
    date: string,
    committed: boolean,
    committedAt: ISO timestamp | null,
    entries: {
      [metricId]: {
        skipped: boolean,       // true = 0 for counts, absence for others
        binaryValue: boolean | null,   // Type A only
        depthValue: number | null,     // optional depth
      }
    },
    energyStart: number | null,
    energyEnd: number | null,
    journal: string | null
  }

Store: metric_definitions
  key: metricId (string)
  value: MetricDefinition (see metric-definition spec)

Store: app_settings
  key: string
  value: any
```

**Alternative considered**: PouchDB — rejected as overkill without CouchDB sync target.

### D3 — Metrics as Code-Configured Constants (v1)

**Decision**: The 9 LLO metrics are defined as TypeScript constants, not user-configurable via UI in v1.

**Rationale**: Metric definition UI adds significant surface area and scope creep. The 9 metrics are well-defined from the design exploration. Code-configuring them lets us ship a focused v1. The schema supports future user-defined metrics — the constants just implement the same interface.

**Alternative considered**: Full metric CRUD UI — deferred to v2.

### D4 — uPlot for Charts

**Decision**: uPlot for all trend and sparkline charts.

**Rationale**: Extremely small bundle (~40KB), fast canvas rendering, suitable for sparklines and line charts. Correlation heatmap will be custom SVG (simple enough to not need a library).

**Alternative considered**: Chart.js — larger bundle, more abstraction than needed. D3 — too much custom code for the benefit.

### D5 — Card Swipe as State Machine

**Decision**: Daily entry is a Svelte 5 state machine — not a router, not a component array.

**Rationale**: The card sequence has complex state (which cards are unlocked, current depth state per card, commit gate) that is best modeled explicitly. A state machine prevents invalid states (e.g., accessing journal before any metric is entered, committing a half-typed card).

```
States:
  IDLE          → no entry in progress
  IN_CARD       → on a metric card (binary or numeric phase)
  IN_DEPTH      → depth input unlocked on current card (Type A ✓ tapped)
  IN_JOURNAL    → journal card
  IN_COMMIT     → commit confirmation card
  COMMITTED     → today is sealed
```

### D6 — Rolling Average Computation

**Decision**: Rolling averages computed on read from IndexedDB, not stored.

**Rationale**: Stored aggregates go stale and add write complexity. Reading the last 30 days of logs on app open is fast enough for ≤9 metrics. Memoized in Svelte store, invalidated on new commit.

### D7 — SLO Budget Model

**Decision**: Two SLO shapes, computed over configurable windows:

- **Rate SLO** (Type A habits, count metrics): `(days meeting threshold / total days in window) ≥ target_rate`
- **Average SLO** (scale metrics like mood, cognitive load, energy): `rolling_avg` compared to threshold with invert flag

Budget = days remaining before SLO breach given current burn rate.

### D8 — Absence vs. Zero vs. Skip

**Decision**: Three distinct entry states per metric per day:
- `no_entry` — day not committed (absence = signal of busyness/forgetting)
- `skipped` — metric explicitly skipped during commit (= 0 for count metrics)
- `value` — explicitly entered

SLO computation excludes `no_entry` days from the denominator (absence doesn't count against you). `skipped` days count as 0 / miss depending on metric type.

**Rationale**: Penalizing absence would punish busy days and corrupt the signal. A missed day is its own data point visible in the calendar heatmap.

### D9 — CSV Export Shape

One row per committed day. Columns:
```
date, committed_at, [metricId_binary], [metricId_depth], energy_start, energy_end, energy_delta, journal
```
No-entry days omitted. Skipped values exported as empty cell (not 0) for downstream clarity.

## Risks / Trade-offs

- **IndexedDB browser support on iOS PWA** → Use `idb` which handles Safari quirks; test on iOS Safari explicitly
- **uPlot gap rendering for no-entry days** → uPlot supports `null` values as gaps natively; ensure no-entry days map to `null` not `0`
- **Card state machine complexity** → Mitigate with exhaustive TypeScript discriminated unions for card states; no implicit transitions
- **Rolling average on first week** → Show SLO target as placeholder when fewer than 7 days of data exist; label clearly
- **PWA install prompt timing** → Defer install prompt until after first commit; don't interrupt the first-run experience
- **Bundle size on mobile** → uPlot is small; audit with `vite-bundle-visualizer` before shipping; target <200KB gzipped

## Open Questions

- None — all design decisions resolved during exploration session.
