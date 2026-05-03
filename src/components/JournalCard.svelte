<script lang="ts">
  let {
    initialText = '',
    onDone,
    onBack,
  }: {
    initialText?: string
    onDone: (text: string) => void
    onBack: () => void
  } = $props()

  let text = $state(initialText)
</script>

<div class="card">
  <div class="card-header">
    <button class="btn-ghost back-btn" onclick={onBack} aria-label="Back">←</button>
    <span class="group-label">JOURNAL</span>
  </div>

  <div class="card-body">
    <h2 class="metric-name">How was today?</h2>
    <p class="why">A single note across everything — optional, no pressure.</p>

    <textarea
      class="journal-input"
      placeholder="Anything on your mind about today..."
      bind:value={text}
      rows={6}
    ></textarea>
  </div>

  <div class="card-actions">
    <button class="btn-primary" onclick={() => onDone(text)}>Done →</button>
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
    gap: var(--space-4);
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

  .journal-input {
    flex: 1;
    resize: none;
    padding: var(--space-4);
    line-height: 1.6;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    font-size: var(--text-base);
  }

  .journal-input:focus {
    border-color: var(--color-accent);
    outline: none;
  }

  .journal-input::placeholder {
    color: var(--color-text-muted);
  }

  .card-actions {
    padding-top: var(--space-6);
  }

  .btn-primary {
    width: 100%;
    padding: var(--space-4);
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: white;
    font-weight: 600;
    font-size: var(--text-base);
    transition: background var(--transition-fast);
  }

  .btn-primary:hover { background: #5a52e0; }
</style>
