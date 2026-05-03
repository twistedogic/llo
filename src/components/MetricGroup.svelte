<script lang="ts">
  import SloBar from './SloBar.svelte'
  import type { MetricDefinition } from '../lib/metrics/types'
  import type { SloResult } from '../lib/slo/index'

  let {
    label,
    metrics,
    slos,
  }: {
    label: string
    metrics: MetricDefinition[]
    slos: Record<string, SloResult>
  } = $props()
</script>

<div class="group">
  <h3 class="group-label">{label}</h3>
  <div class="metrics-list">
    {#each metrics as metric}
      {#if slos[metric.id]}
        <SloBar {metric} slo={slos[metric.id]} />
      {/if}
    {/each}
  </div>
</div>

<style>
  .group {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .group-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .metrics-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }
</style>
