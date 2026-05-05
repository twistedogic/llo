<script lang="ts">
  import { onMount } from 'svelte'
  import { METRICS } from '../lib/metrics/definitions'
  import {
    loadToday,
    getMetricValues,
    getEnergy,
    getJournal,
    setMetric,
    setEnergy,
    setJournal,
  } from '../lib/entry/form.svelte'
  import type { MetricDefinition } from '../lib/metrics/types'

  const GROUP_ORDER = ['social', 'body', 'mind', 'life'] as const
  const GROUP_LABELS: Record<string, string> = {
    social: 'SOCIAL',
    body: 'BODY',
    mind: 'MIND',
    life: 'LIFE',
  }

  const groupedMetrics: { group: string; metrics: MetricDefinition[] }[] =
    GROUP_ORDER.map(g => ({
      group: g,
      metrics: METRICS.filter(m => m.group === g),
    })).filter(g => g.metrics.length > 0)

  function stepFor(m: MetricDefinition): number {
    return m.type === 'hours' ? 0.5 : 1
  }

  function fmt(value: number, m: MetricDefinition): string {
    return m.type === 'hours' ? value.toFixed(1) : String(value)
  }

  function fmtEnergy(value: number): string {
    return value.toFixed(0)
  }

  let metricValues = $derived(getMetricValues())
  let energy = $derived(getEnergy())
  let journalText = $derived(getJournal())
  let delta = $derived(energy.end - energy.start)

  onMount(() => {
    loadToday()
  })
</script>

<div class="daily-form">
  <header class="form-header">
    <span class="form-date">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
  </header>

  <div class="form-body">
    {#each groupedMetrics as { group, metrics }}
      <section class="metric-group">
        <h2 class="group-label">{GROUP_LABELS[group]}</h2>
        {#each metrics as metric}
          {@const value = metricValues[metric.id] ?? 0}
          {@const step = stepFor(metric)}
          <div class="metric-row">
            <span class="metric-name">{metric.name}</span>
            <div class="stepper">
              <button
                class="stepper-btn"
                onclick={() => setMetric(metric.id, value - step)}
                aria-label="Decrease {metric.name}"
              >−</button>
              <span class="stepper-value">{fmt(value, metric)}</span>
              <button
                class="stepper-btn"
                onclick={() => setMetric(metric.id, value + step)}
                aria-label="Increase {metric.name}"
              >+</button>
            </div>
          </div>
        {/each}
      </section>
    {/each}

    <section class="metric-group">
      <h2 class="group-label">ENERGY</h2>
      <div class="metric-row">
        <span class="metric-name">Start of Day</span>
        <div class="stepper">
          <button class="stepper-btn" onclick={() => setEnergy('start', energy.start - 1)} aria-label="Decrease start energy">−</button>
          <span class="stepper-value">{fmtEnergy(energy.start)}</span>
          <button class="stepper-btn" onclick={() => setEnergy('start', energy.start + 1)} aria-label="Increase start energy">+</button>
        </div>
      </div>
      <div class="metric-row">
        <span class="metric-name">End of Day</span>
        <div class="stepper">
          <button class="stepper-btn" onclick={() => setEnergy('end', energy.end - 1)} aria-label="Decrease end energy">−</button>
          <span class="stepper-value">{fmtEnergy(energy.end)}</span>
          <button class="stepper-btn" onclick={() => setEnergy('end', energy.end + 1)} aria-label="Increase end energy">+</button>
        </div>
      </div>
      {#if energy.start !== 0 || energy.end !== 0}
        <div class="energy-delta">
          <span class="delta-label">Delta</span>
          <span class="delta-value" class:positive={delta > 0} class:negative={delta < 0}>
            {delta > 0 ? '+' : ''}{delta}
          </span>
        </div>
      {/if}
    </section>

    <section class="metric-group journal-group">
      <h2 class="group-label">JOURNAL</h2>
      <textarea
        class="journal-input"
        placeholder="How was your day?"
        value={journalText}
        oninput={(e) => setJournal((e.target as HTMLTextAreaElement).value)}
        rows="5"
      ></textarea>
    </section>
  </div>
</div>

<style>
  .daily-form {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .form-header {
    padding: var(--space-4) var(--space-4) var(--space-2);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .form-date {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .form-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2) 0 var(--space-8);
  }

  .metric-group {
    padding: var(--space-3) var(--space-4) var(--space-1);
  }

  .group-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    margin-bottom: var(--space-1);
  }

  .metric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .metric-row:last-of-type {
    border-bottom: none;
  }

  .metric-name {
    font-size: var(--text-base);
    color: var(--color-text);
    flex: 1;
    padding-right: var(--space-3);
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .stepper-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    font-size: var(--text-lg);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-fast);
    flex-shrink: 0;
  }

  .stepper-btn:active {
    background: var(--color-accent-dim);
  }

  .stepper-value {
    font-size: var(--text-lg);
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--color-text);
    min-width: 3ch;
    text-align: center;
  }

  .energy-delta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-2);
    padding: var(--space-2) 0 var(--space-1);
  }

  .delta-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .delta-value {
    font-size: var(--text-sm);
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
  }

  .delta-value.positive {
    color: var(--color-accent);
  }

  .delta-value.negative {
    color: var(--color-text-muted);
  }

  .journal-group {
    padding-bottom: var(--space-4);
  }

  .journal-input {
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    font-size: var(--text-base);
    color: var(--color-text);
    font-family: inherit;
    line-height: 1.6;
    resize: none;
    margin-top: var(--space-2);
  }

  .journal-input:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  .journal-input::placeholder {
    color: var(--color-text-muted);
  }
</style>
