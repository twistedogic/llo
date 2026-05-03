<script lang="ts">
  import type { DayLog } from '../lib/metrics/types'
  import { METRICS } from '../lib/metrics/definitions'

  let {
    log,
    onClose,
  }: {
    log: DayLog
    onClose: () => void
  } = $props()

  function formatDate(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('en', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  function getDisplayValue(metricId: string): string {
    const entry = log.entries[metricId]
    if (!entry) return '—'
    if (entry.skipped) return 'skipped'
    if (entry.value === null) return '—'
    return String(entry.value)
  }

  let energyDelta = $derived(
    log.energy.start !== null && log.energy.end !== null
      ? log.energy.end - log.energy.start
      : null
  )
</script>

<div class="day-detail">
  <div class="detail-header">
    <button class="close-btn" onclick={onClose}>×</button>
    <div class="date-str">{formatDate(log.date)}</div>
  </div>

  <div class="metrics-grid">
    {#each METRICS as metric}
      <div class="metric-row">
        <span class="metric-name">{metric.name}</span>
        <span
          class="metric-value"
          class:skipped={log.entries[metric.id]?.skipped}
        >
          {getDisplayValue(metric.id)}
          {#if !log.entries[metric.id]?.skipped && log.entries[metric.id]?.value !== null}
            <span class="unit">{metric.unit}</span>
          {/if}
        </span>
      </div>
    {/each}

    <div class="metric-row energy-row">
      <span class="metric-name">Energy</span>
      <span class="metric-value" class:skipped={log.energy.skipped}>
        {#if log.energy.skipped}
          skipped
        {:else if log.energy.start !== null && log.energy.end !== null}
          {log.energy.start} → {log.energy.end}
          {#if energyDelta !== null}
            <span class="delta" class:neg={energyDelta < 0} class:pos={energyDelta > 0}>
              ({energyDelta > 0 ? '+' : ''}{energyDelta})
            </span>
          {/if}
        {:else}
          —
        {/if}
      </span>
    </div>
  </div>

  {#if log.journal}
    <div class="journal-section">
      <div class="journal-label">Journal</div>
      <p class="journal-text">{log.journal}</p>
    </div>
  {/if}
</div>

<style>
  .day-detail {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .detail-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .close-btn {
    font-size: var(--text-xl);
    color: var(--color-text-muted);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    background: var(--color-surface-alt);
  }

  .close-btn:hover { color: var(--color-text); }

  .date-str {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
  }

  .metrics-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    background: var(--color-surface-alt);
    border-radius: var(--radius-sm);
  }

  .metric-name {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .metric-value {
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    font-weight: 600;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  .metric-value.skipped {
    color: var(--color-skip);
    font-weight: 400;
  }

  .unit {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-weight: 400;
  }

  .delta.pos { color: var(--color-pass); }
  .delta.neg { color: var(--color-breach); }

  .journal-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .journal-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    text-transform: uppercase;
  }

  .journal-text {
    font-size: var(--text-sm);
    color: var(--color-text);
    line-height: 1.6;
    white-space: pre-wrap;
  }
</style>
