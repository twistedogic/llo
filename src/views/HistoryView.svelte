<script lang="ts">
  import CalendarHeatmap from '../components/CalendarHeatmap.svelte'
  import DayDetail from '../components/DayDetail.svelte'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  let selectedDate = $state<string | null>(null)

  let selectedLog = $derived(
    selectedDate ? logs.find(l => l.date === selectedDate && l.committed) ?? null : null
  )
</script>

<div class="history-view">
  <CalendarHeatmap
    {logs}
    onSelectDay={(date) => { selectedDate = date }}
  />

  {#if selectedLog}
    <DayDetail
      log={selectedLog}
      onClose={() => { selectedDate = null }}
    />
  {/if}
</div>

<style>
  .history-view {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    overflow-y: auto;
    height: 100%;
  }
</style>
