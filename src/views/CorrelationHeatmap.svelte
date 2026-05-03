<script lang="ts">
  import { onMount } from 'svelte'
  import { METRICS } from '../lib/metrics/definitions'
  import { computePearsonCorrelation } from '../lib/slo/index'
  import type { DayLog } from '../lib/metrics/types'

  let { logs = [] }: { logs?: DayLog[] } = $props()

  const WINDOW = 30
  const MIN_DAYS = 14

  let committedCount = $derived(logs.filter(l => l.committed).length)
  let hasEnough = $derived(committedCount >= MIN_DAYS)

  let matrix = $derived(
    METRICS.map(mA =>
      METRICS.map(mB => {
        if (mA.id === mB.id) return null
        return computePearsonCorrelation(mA.id, mB.id, logs, WINDOW)
      })
    )
  )

  let selectedPair = $state<[number, number] | null>(null)

  function cellColor(r: number | null): string {
    if (r === null) return 'var(--color-border)'
    const abs = Math.abs(r)
    const alpha = Math.round(abs * 200 + 30)
    return r >= 0
      ? `rgba(108, 99, 255, ${abs.toFixed(2)})`
      : `rgba(248, 113, 113, ${abs.toFixed(2)})`
  }

  function selectPair(i: number, j: number) {
    if (i === j) return
    if (selectedPair && selectedPair[0] === i && selectedPair[1] === j) {
      selectedPair = null
    } else {
      selectedPair = [i, j]
    }
  }

  function getScatterData(idA: string, idB: string): Array<[number, number]> {
    return logs
      .filter(l => l.committed)
      .map(l => {
        const a = l.entries[idA]
        const b = l.entries[idB]
        if (!a || a.skipped || a.value === null) return null
        if (!b || b.skipped || b.value === null) return null
        return [a.value, b.value] as [number, number]
      })
      .filter((v): v is [number, number] => v !== null)
  }

  let scatterData = $derived(
    selectedPair
      ? getScatterData(METRICS[selectedPair[0]].id, METRICS[selectedPair[1]].id)
      : []
  )
</script>

<div class="heatmap-view">
  {#if !hasEnough}
    <div class="placeholder">
      <p>Correlation requires at least {MIN_DAYS} committed days.</p>
      <p class="text-muted text-sm">You have {committedCount} so far.</p>
    </div>
  {:else}
    <div class="view-header">
      <h2>Correlations</h2>
      <span class="subtitle">Last {WINDOW} days</span>
    </div>

    <div class="matrix-wrapper">
      <div class="matrix" style:grid-template-columns="auto {METRICS.map(() => '1fr').join(' ')}">
        <div class="corner"></div>
        {#each METRICS as m}
          <div class="col-label">{m.name.split(' ').slice(-1)[0]}</div>
        {/each}

        {#each METRICS as mRow, i}
          <div class="row-label">{mRow.name.split(' ').slice(-1)[0]}</div>
          {#each METRICS as mCol, j}
            <button
              class="cell"
              class:diagonal={i === j}
              class:selected={selectedPair && selectedPair[0] === i && selectedPair[1] === j}
              style:background={i === j ? 'var(--color-surface-alt)' : cellColor(matrix[i][j])}
              onclick={() => selectPair(i, j)}
              title={i !== j ? `r = ${matrix[i][j]?.toFixed(2) ?? 'n/a'}` : ''}
            >
              {#if i !== j && matrix[i][j] !== null}
                <span class="r-value">{matrix[i][j]!.toFixed(1)}</span>
              {/if}
            </button>
          {/each}
        {/each}
      </div>
    </div>

    {#if selectedPair !== null}
      <div class="scatter-panel">
        <div class="scatter-header">
          <span class="scatter-title">
            {METRICS[selectedPair[0]].name} vs {METRICS[selectedPair[1]].name}
          </span>
          <span class="r-label">
            r = {matrix[selectedPair[0]][selectedPair[1]]?.toFixed(2) ?? '—'}
          </span>
        </div>
        <div class="scatter-points">
          {#each scatterData as [x, y]}
            <div
              class="point"
              style:left="{Math.round((x / 10) * 100)}%"
              style:bottom="{Math.round((y / 10) * 100)}%"
            ></div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .heatmap-view {
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    overflow-y: auto;
    height: 100%;
  }

  .placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
    text-align: center;
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

  .matrix-wrapper {
    overflow-x: auto;
  }

  .matrix {
    display: grid;
    gap: 2px;
    min-width: 320px;
  }

  .corner { width: 40px; }

  .col-label, .row-label {
    font-size: 9px;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    height: 40px;
    align-items: flex-end;
  }

  .row-label {
    width: 40px;
    justify-content: flex-end;
    padding-right: var(--space-2);
  }

  .cell {
    aspect-ratio: 1;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity var(--transition-fast);
    border: 1px solid transparent;
  }

  .cell.diagonal {
    cursor: default;
    opacity: 0.4;
  }

  .cell.selected {
    border-color: var(--color-accent);
  }

  .cell:hover:not(.diagonal) {
    opacity: 0.85;
  }

  .r-value {
    font-size: 8px;
    font-family: var(--font-mono);
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .scatter-panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
  }

  .scatter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .scatter-title {
    font-size: var(--text-sm);
    color: var(--color-text);
  }

  .r-label {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    color: var(--color-accent);
  }

  .scatter-points {
    position: relative;
    height: 150px;
    background: var(--color-surface-alt);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .point {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--color-accent);
    transform: translate(-50%, 50%);
    opacity: 0.7;
  }
</style>
