<script lang="ts">
  import type { MetricDefinition } from '../lib/metrics/types'

  let {
    metric,
    defaultValue,
    onDone,
    onSkip,
    onBack,
  }: {
    metric: MetricDefinition
    defaultValue: number | null
    onDone: (value: number) => void
    onSkip: () => void
    onBack: () => void
  } = $props()

  let value = $state(defaultValue ?? 0)
  let isDefault = $state(defaultValue !== null)

  const step = metric.type === 'hours' ? 0.5 : metric.type === 'scale' ? 1 : 1
  const min = 0
  const max = metric.type === 'scale' ? 10 : metric.type === 'hours' ? 24 : 99

  function decrement() {
    value = Math.max(min, +(value - step).toFixed(1))
    isDefault = false
  }

  function increment() {
    value = Math.min(max, +(value + step).toFixed(1))
    isDefault = false
  }

  function handleDone() {
    onDone(value)
  }
</script>

<div class="card">
  <div class="card-header">
    <button class="btn-ghost back-btn" onclick={onBack} aria-label="Back">←</button>
    <span class="group-label">{metric.group.toUpperCase()}</span>
  </div>

  <div class="card-body">
    <h2 class="metric-name">{metric.name}</h2>
    <p class="why">{metric.whySentence}</p>

    <div class="stepper">
      <button class="stepper-btn" onclick={decrement} aria-label="Decrease">−</button>
      <div class="stepper-value">
        <span class="value" class:is-default={isDefault}>{value}</span>
        <span class="unit">{metric.unit}</span>
        {#if isDefault}
          <span class="avg-label">avg</span>
        {/if}
      </div>
      <button class="stepper-btn" onclick={increment} aria-label="Increase">+</button>
    </div>
  </div>

  <div class="card-actions">
    <button class="btn-skip" onclick={onSkip}>Skip</button>
    <button class="btn-primary" onclick={handleDone}>Done →</button>
  </div>
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--space-4);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
  }

  .back-btn {
    font-size: var(--text-xl);
    color: var(--color-text-muted);
    padding: var(--space-2);
  }

  .group-label {
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-4);
  }

  .metric-name {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--color-text);
  }

  .why {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    font-style: italic;
    line-height: 1.6;
  }

  .stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    margin-top: var(--space-8);
  }

  .stepper-btn {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    font-size: var(--text-2xl);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-fast);
  }

  .stepper-btn:hover {
    background: var(--color-accent-dim);
  }

  .stepper-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .value {
    font-size: var(--text-3xl);
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--color-text);
  }

  .value.is-default {
    color: var(--color-text-muted);
  }

  .unit {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .avg-label {
    font-size: var(--text-xs);
    color: var(--color-accent);
    margin-top: 2px;
  }

  .card-actions {
    display: flex;
    gap: var(--space-3);
    padding-top: var(--space-6);
  }

  .btn-skip {
    flex: 0 0 auto;
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: var(--text-base);
  }

  .btn-primary {
    flex: 1;
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: white;
    font-size: var(--text-base);
    font-weight: 600;
    transition: background var(--transition-fast);
  }

  .btn-primary:hover {
    background: #5a52e0;
  }
</style>
