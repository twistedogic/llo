<script lang="ts">
  import MetricGroup from '../components/MetricGroup.svelte'
  import { getGroups } from '../lib/metrics/groups'
  import { METRICS } from '../lib/metrics/definitions'
  import { computeDirection } from '../lib/slo/index'
  import type { DayLog } from '../lib/metrics/types'
  import type { DirectionResult } from '../lib/slo/index'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const groups = getGroups()

  let directions = $derived(
    Object.fromEntries(
      METRICS.map(m => [m.id, computeDirection(m.id, logs, m.invertDisplay)])
    ) as Record<string, DirectionResult>
  )
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h1 class="title">LLO</h1>
    <span class="subtitle">Life Level Objectives</span>
  </div>

  <div class="groups">
    {#each groups as group}
      <MetricGroup
        label={group.label}
        metrics={group.metrics}
        {directions}
      />
    {/each}
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-4);
    overflow-y: auto;
    height: 100%;
  }

  .dashboard-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .title {
    font-size: var(--text-2xl);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-accent);
  }

  .subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .groups {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }
</style>
