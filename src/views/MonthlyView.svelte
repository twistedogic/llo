<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import uPlot from 'uplot'
  import { METRICS } from '../lib/metrics/definitions'
  import { lineChartConfig } from '../lib/charts/lineChart'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const ACCENT = '#6c63ff'

  function getMonthDates(): string[] {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(year, month, i + 1)
      return d.toISOString().slice(0, 10)
    })
  }

  const monthDates = getMonthDates()

  function buildSeries(metricId: string): (number | null)[] {
    return monthDates.map(date => {
      const log = logs.find(l => l.date === date && l.committed)
      if (!log) return null
      const entry = log.entries[metricId]
      if (!entry || entry.skipped) return null
      return entry.value
    })
  }

  function buildGoalSeries(target: number, length: number): number[] {
    return Array(length).fill(target)
  }

  interface ChartRow {
    metric: typeof METRICS[0]
    values: (number | null)[]
    container: HTMLElement | null
  }

  let chartRows: ChartRow[] = METRICS.map(m => ({
    metric: m,
    values: buildSeries(m.id),
    container: null,
  }))

  let containerRefs: (HTMLElement | null)[] = Array(METRICS.length).fill(null)
  let charts: (uPlot | null)[] = []

  onMount(() => {
    chartRows.forEach((row, i) => {
      const el = containerRefs[i]
      if (!el) return
      const xs = monthDates.map((_, idx) => idx)
      const ys = row.values.map(v => v ?? NaN)
      const goal = buildGoalSeries(row.metric.sloTarget, monthDates.length)
      const data: uPlot.AlignedData = [
        new Float64Array(xs),
        new Float64Array(ys),
        new Float64Array(goal),
      ]
      const opts = lineChartConfig(data, ACCENT, row.metric.sloTarget, el.clientWidth || 300, 120)
      charts[i] = new uPlot(opts, data, el)
    })
  })

  onDestroy(() => {
    charts.forEach(c => c?.destroy())
  })
</script>

<div class="monthly-view">
  <div class="view-header">
    <h2>This Month</h2>
  </div>

  <div class="metric-charts">
    {#each chartRows as row, i}
      <div class="metric-block">
        <div class="metric-header">
          <span class="metric-name">{row.metric.name}</span>
        </div>
        <p class="why">{row.metric.whySentence}</p>
        <div class="chart-container" bind:this={containerRefs[i]}></div>
      </div>
    {/each}
  </div>
</div>

<style>
  .monthly-view {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    overflow-y: auto;
    height: 100%;
  }

  .view-header h2 {
    font-size: var(--text-xl);
  }

  .metric-charts {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .metric-block {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .metric-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .why {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-style: italic;
  }

  .chart-container {
    overflow: hidden;
  }
</style>
