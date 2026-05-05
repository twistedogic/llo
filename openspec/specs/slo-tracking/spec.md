## REMOVED Requirements

### Requirement: Rate SLO for habit and count metrics
**Reason**: SLO compliance tracking removed in favour of direction-based signals (see `direction-signal` spec).
**Migration**: Removed `computeRateSLO` and `computeSLO` from `src/lib/slo/index.ts`.

### Requirement: Average SLO for scale metrics
**Reason**: SLO compliance tracking removed in favour of direction-based signals.
**Migration**: Removed `computeAverageSLO` from `src/lib/slo/index.ts`.

### Requirement: Error budget and burn rate
**Reason**: Error budget is an SLO concept removed from the system.
**Migration**: Removed `computeErrorBudget` from `src/lib/slo/index.ts` and `BudgetBar` component.

### Requirement: Window support
**Reason**: SLO window configuration removed from `MetricDefinition`. Direction uses fixed 14-day window.
**Migration**: Removed `sloWindow` from metric definitions.
