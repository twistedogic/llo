<script lang="ts">
  import { onMount } from 'svelte'
  import AppShell from './views/AppShell.svelte'
  import { getAllCommittedLogs, isTodayCommitted } from './lib/db/index'
  import type { DayLog } from './lib/metrics/types'

  let logs = $state<DayLog[]>([])
  let todayCommitted = $state(false)
  let loading = $state(true)

  async function refresh() {
    logs = await getAllCommittedLogs()
    todayCommitted = await isTodayCommitted()
  }

  onMount(async () => {
    await refresh()
    loading = false
  })
</script>

{#if loading}
  <div class="splash">
    <div class="splash-logo">LLO</div>
  </div>
{:else}
  <AppShell
    {logs}
    {todayCommitted}
    onCommitted={refresh}
  />
{/if}

<style>
  .splash {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .splash-logo {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--color-accent);
  }
</style>
