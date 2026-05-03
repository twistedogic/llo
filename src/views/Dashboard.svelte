<script lang="ts">
  import MetricGroup from '../components/MetricGroup.svelte'
  import BudgetBar from '../components/BudgetBar.svelte'
  import { getGroups } from '../lib/metrics/groups'
  import { METRICS } from '../lib/metrics/definitions'
  import { computeSLO, computeErrorBudget } from '../lib/slo/index'
  import type { DayLog } from '../lib/metrics/types'
  import type { SloResult, BudgetResult } from '../lib/slo/index'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const groups = getGroups()

  const RATE_METRICS = ['sleep', 'exercise', 'family']

  let slos = $derived(
    Object.fromEntries(
      METRICS.map(m => [m.id, computeSLO(m, logs)])
    ) as Record<string, SloResult>
  )

  let budgets = $derived(
    Object.fromEntries(
      RATE_METRICS.map(id => {
        const metric = METRICS.find(m => m.id === id)!
        return [id, computeErrorBudget(metric, logs)]
      }).filter(([, b]) => b !== null)
    ) as Record<string, BudgetResult>
  )

  const budgetMetricNames: Record<string, string> = {
    sleep: 'Sleep budget',
    exercise: 'Exercise budget',
    family: 'Family time budget',
  }
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
        {slos}
      />
    {/each}
  </div>

  {#if Object.keys(budgets).length > 0}
    <div class="budgets-section">
      <h3 class="section-label">Error Budgets</h3>
      <div class="budgets-list">
        {#each Object.entries(budgets) as [id, budget]}
          <BudgetBar
            metricName={budgetMetricNames[id] ?? id}
            {budget}
          />
        {/each}
      </div>
    </div>
  {/if}
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

  .budgets-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .section-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .budgets-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }
</style>
