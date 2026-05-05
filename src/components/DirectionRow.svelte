<script lang="ts">
  import type { MetricDefinition } from '../lib/metrics/types'
  import type { DirectionResult } from '../lib/slo/index'

  let {
    metric,
    direction,
  }: {
    metric: MetricDefinition
    direction: DirectionResult
  } = $props()

  let arrow = $derived(
    direction.direction === 'up' ? '↑'
    : direction.direction === 'down' ? '↓'
    : direction.direction === 'flat' ? '→'
    : '—'
  )

  let arrowClass = $derived(
    direction.direction === 'up' ? 'up'
    : direction.direction === 'down' ? 'down'
    : 'neutral'
  )

  let avgDisplay = $derived(
    direction.recentAvg !== null
      ? `${+direction.recentAvg.toFixed(1)} ${metric.unit}`
      : '—'
  )
</script>

<div class="direction-row">
  <span class="metric-name">{metric.name}</span>
  <span class="avg">{avgDisplay}</span>
  <span class="arrow {arrowClass}">{arrow}</span>
</div>

<style>
  .direction-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: var(--space-3);
  }

  .metric-name {
    font-size: var(--text-sm);
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .avg {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .arrow {
    font-size: var(--text-base);
    font-family: var(--font-mono);
    font-weight: 600;
    width: 1.5rem;
    text-align: right;
  }

  .arrow.up   { color: var(--color-accent); }
  .arrow.down { color: var(--color-text-muted); }
  .arrow.neutral { color: var(--color-text-muted); }
</style>
