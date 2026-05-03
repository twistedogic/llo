<script lang="ts">
  import type { BudgetResult } from '../lib/slo/index'

  let {
    metricName,
    budget,
  }: {
    metricName: string
    budget: BudgetResult
  } = $props()

  let pct = $derived(
    budget.allowed === 0 ? 0 : Math.round((budget.remaining / budget.allowed) * 100)
  )
  let statusClass = $derived(budget.exhausted ? 'breach' : pct < 30 ? 'warn' : 'pass')
</script>

<div class="budget-bar">
  <div class="budget-header">
    <span class="metric-name">{metricName}</span>
    <span class="budget-label {statusClass}">
      {budget.remaining} days left
    </span>
  </div>
  <div class="bar-track">
    <div
      class="bar-fill {statusClass}"
      style:width="{pct}%"
    ></div>
  </div>
</div>

<style>
  .budget-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .metric-name {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .budget-label {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
  }

  .budget-label.pass   { color: var(--color-pass); }
  .budget-label.warn   { color: var(--color-warn); }
  .budget-label.breach { color: var(--color-breach); }

  .bar-track {
    height: 4px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-slow);
  }

  .bar-fill.pass   { background: var(--color-pass); }
  .bar-fill.warn   { background: var(--color-warn); }
  .bar-fill.breach { background: var(--color-breach); }
</style>
