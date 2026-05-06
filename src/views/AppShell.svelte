<script lang="ts">
  import DailyForm from '../components/DailyForm.svelte'
  import Dashboard from './Dashboard.svelte'
  import TrendsView from './TrendsView.svelte'
  import HistoryView from './HistoryView.svelte'
  import { buildCsv, downloadCsv } from '../lib/export/csv'
  import type { DayLog } from '../lib/metrics/types'

  let {
    logs = [],
  }: {
    logs?: DayLog[]
  } = $props()

  type Tab = 'home' | 'trends' | 'history'
  let activeTab = $state<Tab>('home')
  let showSettings = $state(false)
  let exportMsg = $state<string | null>(null)

  function handleExport() {
    const csv = buildCsv(logs)
    if (!csv) {
      exportMsg = 'No committed days to export yet.'
      setTimeout(() => exportMsg = null, 3000)
      return
    }
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`llo-export-${date}.csv`, csv)
    showSettings = false
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'history', label: 'History', icon: '🗓' },
  ]
</script>

<div class="app-shell">
  <div class="view-area">
    {#if activeTab === 'home'}
      <DailyForm />
    {:else if activeTab === 'trends'}
      <TrendsView {logs} />
    {:else}
      <HistoryView {logs} />
    {/if}
  </div>

  <nav class="bottom-nav">
    {#each tabs as tab}
      <button
        class="nav-btn"
        class:active={activeTab === tab.id}
        onclick={() => { activeTab = tab.id; showSettings = false }}
      >
        <span class="nav-icon">{tab.icon}</span>
        <span class="nav-label">{tab.label}</span>
      </button>
    {/each}
    <button
      class="nav-btn"
      class:active={showSettings}
      onclick={() => showSettings = !showSettings}
    >
      <span class="nav-icon">⚙️</span>
      <span class="nav-label">More</span>
    </button>
  </nav>

  {#if showSettings}
    <div class="settings-panel">
      <div class="settings-header">
        <span class="settings-title">Settings</span>
        <button class="close-btn" onclick={() => showSettings = false}>×</button>
      </div>

      <div class="settings-body">
        <button class="settings-action" onclick={handleExport}>
          ↓ Export CSV
        </button>
        {#if exportMsg}
          <p class="export-msg">{exportMsg}</p>
        {/if}
        <div class="app-info">
          <span class="app-name">LLO — Life Level Objectives</span>
          <span class="app-version text-xs text-muted">v0.1.0</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .view-area {
    flex: 1;
    overflow: hidden;
    padding-bottom: var(--nav-height);
  }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    display: flex;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    z-index: 100;
  }

  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    color: var(--color-text-muted);
    transition: color var(--transition-fast);
    padding: var(--space-2);
  }

  .nav-btn.active {
    color: var(--color-accent);
  }

  .nav-icon {
    font-size: var(--text-xl);
    line-height: 1;
  }

  .nav-label {
    font-size: var(--text-xs);
    letter-spacing: 0.02em;
  }

  .settings-panel {
    position: fixed;
    bottom: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    z-index: 99;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .settings-title {
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .close-btn {
    font-size: var(--text-xl);
    color: var(--color-text-muted);
    padding: var(--space-1) var(--space-2);
  }

  .settings-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .settings-action {
    padding: var(--space-3) var(--space-4);
    background: var(--color-accent-dim);
    color: var(--color-accent);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    font-weight: 600;
    text-align: left;
    border: 1px solid var(--color-accent);
  }

  .settings-action:hover {
    background: var(--color-accent);
    color: white;
  }

  .export-msg {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .app-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .app-name {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }
</style>
