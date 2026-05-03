<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import uPlot from 'uplot'
  import { METRICS } from '../lib/metrics/definitions'
  import { computeSmoothedSeries, computeStdDev } from '../lib/slo/index'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const ACCENT = '#6c63ff'

  function getLast90Dates(): string[] {
    return Array.from({ length: 90 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 89 + i)
      return d.toISOString().slice(0, 10)
    })
  }

  const dates = getLast90Dates()

  function buildRaw(metricId: string): (number | null)[] {
    return dates.map(date => {
      const log = logs.find(l => l.date === date && l.committed)
      if (!log) return null
      const entry = log.entries[metricId]
      if (!entry || entry.skipped) return null
      return entry.value
    })
  }

  interface QRow {
    metric: typeof METRICS[0]
    smoothed: (number | null)[]
    upper: (number | null)[]
    lower: (number | null)[]
    container: HTMLElement | null
  }

  let qRows: QRow[] = METRICS.map(m => {
    const raw = buildRaw(m.id)
    const smoothed = computeSmoothedSeries(raw, 7)
    const stddev = computeStdDev(raw, smoothed)
    const upper = smoothed.map((v, i) => (v !== null && stddev[i] !== null ? v + stddev[i]! : null))
    const lower = smoothed.map((v, i) => (v !== null && stddev[i] !== null ? v - stddev[i]! : null))
    return { metric: m, smoothed, upper, lower, container: null }
  })

  let containerRefs: (HTMLElement | null)[] = Array(METRICS.length).fill(null)
  let charts: (uPlot | null)[] = []

  onMount(() => {
    qRows.forEach((row, i) => {
      const el = containerRefs[i]
      if (!el) return
      const xs = dates.map((_, idx) => idx)
      const data: uPlot.AlignedData = [
        new Float64Array(xs),
        new Float64Array(row.smoothed.map(v => v ?? NaN)),
        new Float64Array(row.upper.map(v => v ?? NaN)),
        new Float64Array(row.lower.map(v => v ?? NaN)),
      ]
      const opts: uPlot.Options = {
        width: el.clientWidth || 300,
        height: 100,
        cursor: { show: false },
        select: { show: false },
        legend: { show: false },
        axes: [
          { show: false },
          { stroke: '#8888aa', ticks: { stroke: '#2a2a4a' }, grid: { stroke: '#2a2a4a', width: 1 } },
        ],
        scales: { x: { time: false } },
        series: [
          {},
          { label: 'Smoothed', stroke: ACCENT, width: 2, spanGaps: false },
          { label: 'Upper', stroke: ACCENT + '44', width: 1, fill: ACCENT + '18', spanGaps: false },
          { label: 'Lower', stroke: ACCENT + '44', width: 1, spanGaps: false },
        ],
        data,
      }
      charts[i] = new uPlot(opts, data, el)
    })
  })

  onDestroy(() => {
    charts.forEach(c => c?.destroy())
  })
</script>

<div class="quarterly-view">
  <div class="view-header">
    <h2>Last 90 Days</h2>
    <span class="subtitle">7-day smoothed · ±1 std dev</span>
  </div>

  <div class="metric-charts">
    {#each qRows as row, i}
      <div class="metric-block">
        <div class="metric-name">{row.metric.name}</div>
        <div class="chart-container" bind:this={containerRefs[i]}></div>
      </div>
    {/each}
  </div>
</div>

<style>
  .quarterly-view {
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
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .metric-charts {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .metric-block {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3) var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .metric-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .chart-container {
    overflow: hidden;
  }
</style>
