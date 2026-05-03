<script lang="ts">
  import type { MetricDefinition } from '../lib/metrics/types'
  import type { SloResult } from '../lib/slo/index'

  let {
    metric,
    slo,
  }: {
    metric: MetricDefinition
    slo: SloResult
  } = $props()

  let pct = $derived(Math.round(slo.compliance * 100))
  let statusClass = $derived(slo.passing ? 'pass' : 'breach')
</script>

<div class="slo-bar">
  <div class="slo-header">
    <span class="metric-name">{metric.name}</span>
    <span class="slo-status {statusClass}">
      {pct}%
    </span>
  </div>
  <div class="bar-track">
    <div
      class="bar-fill {statusClass}"
      style:width="{pct}%"
    ></div>
    {#if metric.sloRate !== null}
      <div
        class="target-line"
        style:left="{Math.round(metric.sloRate * 100)}%"
      ></div>
    {/if}
  </div>
</div>

<style>
  .slo-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .slo-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .metric-name {
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  .slo-status {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    font-weight: 600;
  }

  .slo-status.pass   { color: var(--color-pass); }
  .slo-status.breach { color: var(--color-breach); }

  .bar-track {
    position: relative;
    height: 6px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: visible;
  }

  .bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
    max-width: 100%;
  }

  .bar-fill.pass   { background: var(--color-pass); }
  .bar-fill.breach { background: var(--color-breach); }

  .target-line {
    position: absolute;
    top: -3px;
    width: 2px;
    height: 12px;
    background: var(--color-warn);
    border-radius: 1px;
    transform: translateX(-50%);
  }
</style>
