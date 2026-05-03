<script lang="ts">
  let {
    loggedCount,
    skippedCount,
    totalCount,
    onCommit,
    onBack,
  }: {
    loggedCount: number
    skippedCount: number
    totalCount: number
    onCommit: () => void
    onBack: () => void
  } = $props()
</script>

<div class="card">
  <div class="card-header">
    <button class="btn-ghost back-btn" onclick={onBack} aria-label="Back">←</button>
    <span class="group-label">COMMIT</span>
  </div>

  <div class="card-body">
    <h2 class="title">That's today.</h2>

    <div class="summary">
      <div class="summary-item">
        <span class="summary-value">{loggedCount}</span>
        <span class="summary-label">logged</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <span class="summary-value muted">{skippedCount + (totalCount - loggedCount - skippedCount)}</span>
        <span class="summary-label">skipped</span>
      </div>
    </div>

    <p class="note">
      This seals the day. It can't be changed.
    </p>
  </div>

  <div class="card-actions">
    <button class="btn-commit" onclick={onCommit}>Commit Day</button>
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
    align-items: center;
    gap: var(--space-8);
    text-align: center;
  }

  .title {
    font-size: var(--text-3xl);
    font-weight: 700;
  }

  .summary {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    padding: var(--space-6);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }

  .summary-value {
    font-size: var(--text-2xl);
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--color-pass);
  }

  .summary-value.muted {
    color: var(--color-text-muted);
  }

  .summary-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .summary-divider {
    width: 1px;
    height: 40px;
    background: var(--color-border);
  }

  .note {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .card-actions {
    padding-top: var(--space-6);
  }

  .btn-commit {
    width: 100%;
    padding: var(--space-4);
    border-radius: var(--radius-md);
    background: var(--color-accent);
    color: white;
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: 0.02em;
    transition: background var(--transition-fast), transform var(--transition-fast);
  }

  .btn-commit:hover {
    background: #5a52e0;
    transform: scale(1.01);
  }

  .btn-commit:active {
    transform: scale(0.99);
  }
</style>
