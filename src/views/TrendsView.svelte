<script lang="ts">
  import WeeklyView from './WeeklyView.svelte'
  import MonthlyView from './MonthlyView.svelte'
  import QuarterlyView from './QuarterlyView.svelte'
  import CorrelationHeatmap from './CorrelationHeatmap.svelte'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  type Tab = 'weekly' | 'monthly' | 'quarterly' | 'correlation'
  let activeTab = $state<Tab>('monthly')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'weekly', label: 'Week' },
    { id: 'monthly', label: 'Month' },
    { id: 'quarterly', label: 'Quarter' },
    { id: 'correlation', label: 'Correlation' },
  ]
</script>

<div class="trends-view">
  <div class="tab-bar">
    {#each tabs as tab}
      <button
        class="tab-btn"
        class:active={activeTab === tab.id}
        onclick={() => activeTab = tab.id}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div class="tab-content">
    {#if activeTab === 'weekly'}
      <WeeklyView {logs} />
    {:else if activeTab === 'monthly'}
      <MonthlyView {logs} />
    {:else if activeTab === 'quarterly'}
      <QuarterlyView {logs} />
    {:else}
      <CorrelationHeatmap {logs} />
    {/if}
  </div>
</div>

<style>
  .trends-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tab-bar {
    display: flex;
    gap: var(--space-1);
    padding: var(--space-3) var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .tab-btn {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    border-bottom: 2px solid transparent;
    transition: color var(--transition-fast), border-color var(--transition-fast);
  }

  .tab-btn.active {
    color: var(--color-text);
    border-bottom-color: var(--color-accent);
  }

  .tab-content {
    flex: 1;
    overflow: hidden;
  }
</style>
