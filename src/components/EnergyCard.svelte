<script lang="ts">
  let {
    defaultStart,
    defaultEnd,
    onDone,
    onSkip,
    onBack,
  }: {
    defaultStart: number | null
    defaultEnd: number | null
    onDone: (start: number, end: number) => void
    onSkip: () => void
    onBack: () => void
  } = $props()

  let startVal = $state(defaultStart ?? 7)
  let endVal = $state(defaultEnd ?? 6)

  const step = 1
  const min = 1
  const max = 10

  let delta = $derived(endVal - startVal)

  function handleDone() {
    onDone(startVal, endVal)
  }
</script>

<div class="card">
  <div class="card-header">
    <button class="btn-ghost back-btn" onclick={onBack} aria-label="Back">←</button>
    <span class="group-label">LIFE</span>
  </div>

  <div class="card-body">
    <h2 class="metric-name">Energy</h2>
    <p class="why">So that I notice what drains or charges me each day.</p>

    <div class="energy-grid">
      <div class="energy-field">
        <span class="field-label">Start of day</span>
        <div class="stepper">
          <button class="stepper-btn" onclick={() => startVal = Math.max(min, startVal - step)}>−</button>
          <span class="value">{startVal}</span>
          <button class="stepper-btn" onclick={() => startVal = Math.min(max, startVal + step)}>+</button>
        </div>
        {#if defaultStart !== null}
          <span class="avg-hint">avg: {defaultStart}</span>
        {/if}
      </div>

      <div class="energy-field">
        <span class="field-label">End of day</span>
        <div class="stepper">
          <button class="stepper-btn" onclick={() => endVal = Math.max(min, endVal - step)}>−</button>
          <span class="value">{endVal}</span>
          <button class="stepper-btn" onclick={() => endVal = Math.min(max, endVal + step)}>+</button>
        </div>
        {#if defaultEnd !== null}
          <span class="avg-hint">avg: {defaultEnd}</span>
        {/if}
      </div>
    </div>

    <div class="delta" class:negative={delta < 0} class:positive={delta > 0}>
      <span class="delta-label">Delta</span>
      <span class="delta-value">{delta > 0 ? '+' : ''}{delta}</span>
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
    gap: var(--space-6);
  }

  .metric-name {
    font-size: var(--text-2xl);
    font-weight: 700;
  }

  .why {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    font-style: italic;
  }

  .energy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .energy-field {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .field-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .stepper-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    font-size: var(--text-xl);
    color: var(--color-text);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stepper-btn:hover {
    background: var(--color-accent-dim);
  }

  .value {
    font-size: var(--text-2xl);
    font-weight: 700;
    font-family: var(--font-mono);
    min-width: 2ch;
    text-align: center;
  }

  .avg-hint {
    font-size: var(--text-xs);
    color: var(--color-accent);
  }

  .delta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .delta-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .delta-value {
    font-size: var(--text-xl);
    font-weight: 700;
    font-family: var(--font-mono);
  }

  .delta.positive .delta-value { color: var(--color-pass); }
  .delta.negative .delta-value { color: var(--color-breach); }

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
  }

  .btn-primary {
    flex: 1;
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: white;
    font-weight: 600;
    transition: background var(--transition-fast);
  }

  .btn-primary:hover { background: #5a52e0; }
</style>
