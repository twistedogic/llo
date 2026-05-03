<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import uPlot from 'uplot'
  import { METRICS } from '../lib/metrics/definitions'
  import { computeRollingAverage } from '../lib/slo/index'
  import { sparklineConfig } from '../lib/charts/sparkline'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const ACCENT = '#6c63ff'

  function getWeekDates(offsetWeeks: number): string[] {
    const dates: string[] = []
    const today = new Date()
    const dow = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dow + 1 + offsetWeeks * 7)
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      dates.push(d.toISOString().slice(0, 10))
    }
    return dates
  }

  const thisWeek = getWeekDates(0)
  const lastWeek = getWeekDates(-1)

  function buildSparklineData(metricId: string, dates: string[]): (number | null)[] {
    return dates.map(date => {
      const log = logs.find(l => l.date === date && l.committed)
      if (!log) return null
      const entry = log.entries[metricId]
      if (!entry || entry.skipped) return null
      return entry.value
    })
  }

  function weekAvg(values: (number | null)[]): number | null {
    const valid = values.filter((v): v is number => v !== null)
    if (valid.length === 0) return null
    return valid.reduce((a, b) => a + b, 0) / valid.length
  }

  interface SparkRow {
    metric: typeof METRICS[0]
    thisVals: (number | null)[]
    lastVals: (number | null)[]
    delta: number | null
    container: HTMLElement | null
    chart: uPlot | null
  }

  let rows: SparkRow[] = METRICS.map(m => ({
    metric: m,
    thisVals: buildSparklineData(m.id, thisWeek),
    lastVals: buildSparklineData(m.id, lastWeek),
    delta: null,
    container: null,
    chart: null,
  }))

  rows = rows.map(row => {
    const thisAvg = weekAvg(row.thisVals)
    const lastAvg = weekAvg(row.lastVals)
    return {
      ...row,
      delta: thisAvg !== null && lastAvg !== null ? +(thisAvg - lastAvg).toFixed(2) : null,
    }
  })

  let containerRefs: (HTMLElement | null)[] = Array(METRICS.length).fill(null)
  let charts: (uPlot | null)[] = []

  onMount(() => {
    rows.forEach((row, i) => {
      const el = containerRefs[i]
      if (!el) return
      const xs = thisWeek.map((_, idx) => idx)
      const ys = row.thisVals
      const data: uPlot.AlignedData = [
        new Float64Array(xs),
        new Float64Array(ys.map(v => v ?? NaN)),
      ]
      const opts = sparklineConfig(data, ACCENT, el.clientWidth || 120, 40)
      charts[i] = new uPlot(opts, data, el)
    })
  })

  onDestroy(() => {
    charts.forEach(c => c?.destroy())
  })
</script>

<div class="weekly-view">
  <div class="view-header">
    <h2>This Week</h2>
    <span class="subtitle">vs previous week</span>
  </div>

  <div class="rows">
    {#each rows as row, i}
      <div class="row">
        <div class="row-name">{row.metric.name}</div>
        <div class="spark-container" bind:this={containerRefs[i]}></div>
        <div class="delta" class:pos={row.delta !== null && row.delta > 0} class:neg={row.delta !== null && row.delta < 0}>
          {#if row.delta !== null}
            {row.delta > 0 ? '↑' : row.delta < 0 ? '↓' : '→'}
            {Math.abs(row.delta).toFixed(1)}
          {:else}
            <span class="text-muted">—</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .weekly-view {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    overflow-y: auto;
    height: 100%;
  }

  .view-header {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
  }

  .subtitle {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 120px 60px;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
  }

  .row-name {
    font-size: var(--text-sm);
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .spark-container {
    height: 40px;
    overflow: hidden;
  }

  .delta {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    text-align: right;
    color: var(--color-text-muted);
  }

  .delta.pos { color: var(--color-pass); }
  .delta.neg { color: var(--color-breach); }
</style>
