## REMOVED Requirements

### Requirement: Sequential card swipe entry
**Reason**: Replaced by scrollable grouped form (daily-form-entry capability). Card-at-a-time navigation is incompatible with mid-day incremental updates.
**Migration**: Delete `EntryFlow.svelte`, `machine.ts`, `MetricCard.svelte`, `CommitCard.svelte`, `EnergyCard.svelte`, `JournalCard.svelte`. Replace with `DailyForm.svelte`.

### Requirement: Card sequence order
**Reason**: No card sequence exists in the form model. Metrics are grouped by `group` field within a single scrollable view.
**Migration**: Group ordering (social → body → mind → life → energy → journal) is preserved visually but no longer navigable as a sequence.

### Requirement: Type B numeric card input
**Reason**: Replaced by `−/+` row controls on each metric row in the form. Rolling-average prefill is removed; default is 0.
**Migration**: Remove rolling-average prefill logic from entry path. `computeRollingAverage` remains available for history/trend views.

### Requirement: Energy card dual input
**Reason**: Energy is now two rows inside the form's ENERGY section, not a standalone card.
**Migration**: Delete `EnergyCard.svelte`. Energy rows rendered inline in `DailyForm.svelte`.

### Requirement: Journal card
**Reason**: Journal is now a textarea section at the bottom of the form, not a standalone card.
**Migration**: Delete `JournalCard.svelte`. Journal textarea rendered inline in `DailyForm.svelte`.

### Requirement: Commit card and immutable seal
**Reason**: Replaced by auto-save and auto-commit. Users no longer perform an explicit commit action. Days are sealed automatically when the next day is opened.
**Migration**: Delete `CommitCard.svelte`. Remove `isTodayCommitted()` gating from `AppShell`. Remove `onCommitted` callback chain.

### Requirement: Absence as signal
**Reason**: Requirement wording updated — days are now auto-committed rather than requiring explicit commit, but the absence-as-signal principle is preserved. Days with no saved log (user never opened the app) remain absent. Days where the user opened but left all values at 0 are committed as zero-value days.
**Migration**: No migration. SLO exclusion of absent days remains correct; days the user never touched are not saved to IDB at all.
