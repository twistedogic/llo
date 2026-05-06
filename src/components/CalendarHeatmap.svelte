<script lang="ts">
  import { resolveValue, type DayLog } from '../lib/metrics/types'
  import { METRICS } from '../lib/metrics/definitions'

  let {
    logs = [],
    onSelectDay,
  }: {
    logs?: DayLog[]
    onSelectDay?: (date: string) => void
  } = $props()

  let viewYear = $state(new Date().getFullYear())
  let viewMonth = $state(new Date().getMonth())

  let monthLabel = $derived(
    new Date(viewYear, viewMonth, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' })
  )

  function prevMonth() {
    if (viewMonth === 0) { viewYear--; viewMonth = 11 }
    else viewMonth--
  }

  function nextMonth() {
    if (viewMonth === 11) { viewYear++; viewMonth = 0 }
    else viewMonth++
  }

  let calendarDays = $derived(buildCalendarDays(viewYear, viewMonth))

  function buildCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDow = (firstDay.getDay() + 6) % 7

    const days: Array<{ date: string; dayNum: number } | null> = []
    for (let i = 0; i < startDow; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d).toISOString().slice(0, 10)
      days.push({ date, dayNum: d })
    }
    return days
  }

  function getLogForDate(date: string): DayLog | null {
    return logs.find(l => l.date === date) ?? null
  }

  function dayHealth(log: DayLog): 'full' | 'partial' | 'absent' {
    if (!log.committed) return 'absent'
    const logged = METRICS.filter(m => resolveValue(log.entries[m.id]) > 0).length
    if (logged === METRICS.length) return 'full'
    if (logged > 0) return 'partial'
    return 'partial'
  }

  function dayClass(date: string): string {
    const log = getLogForDate(date)
    if (!log || !log.committed) return 'absent'
    return dayHealth(log)
  }

  function handleDayClick(date: string) {
    const log = getLogForDate(date)
    if (!log?.committed) return
    onSelectDay?.(date)
  }

  const today = new Date().toISOString().slice(0, 10)
</script>

<div class="calendar-heatmap">
  <div class="month-nav">
    <button class="nav-btn" onclick={prevMonth}>‹</button>
    <span class="month-label">{monthLabel}</span>
    <button class="nav-btn" onclick={nextMonth}>›</button>
  </div>

  <div class="day-headers">
    {#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as dow}
      <span class="dow-label">{dow}</span>
    {/each}
  </div>

  <div class="calendar-grid">
    {#each calendarDays as day}
      {#if day === null}
        <div class="day-cell empty"></div>
      {:else}
        {@const cls = dayClass(day.date)}
        <button
          class="day-cell {cls}"
          class:today={day.date === today}
          class:clickable={cls !== 'absent'}
          onclick={() => handleDayClick(day.date)}
          disabled={cls === 'absent'}
        >
          {day.dayNum}
        </button>
      {/if}
    {/each}
  </div>

  <div class="legend">
    <span class="legend-item"><span class="swatch full"></span>All logged</span>
    <span class="legend-item"><span class="swatch partial"></span>Partial</span>
    <span class="legend-item"><span class="swatch absent"></span>No entry</span>
  </div>
</div>

<style>
  .calendar-heatmap {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .month-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-btn {
    font-size: var(--text-xl);
    color: var(--color-text-muted);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .nav-btn:hover { background: var(--color-accent-dim); }

  .month-label {
    font-size: var(--text-base);
    font-weight: 600;
  }

  .day-headers {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .dow-label {
    text-align: center;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    padding: var(--space-1) 0;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .day-cell {
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    border: 1px solid transparent;
    cursor: default;
    transition: opacity var(--transition-fast);
  }

  .day-cell.empty {
    background: transparent;
  }

  .day-cell.absent {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
  }

  .day-cell.full {
    background: var(--color-pass);
    color: #0a1f0a;
    font-weight: 600;
  }

  .day-cell.partial {
    background: var(--color-warn);
    color: #1a150a;
    font-weight: 600;
  }

  .day-cell.clickable {
    cursor: pointer;
  }

  .day-cell.clickable:hover {
    opacity: 0.85;
  }

  .day-cell.today {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }

  .legend {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .swatch {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .swatch.full    { background: var(--color-pass); }
  .swatch.partial { background: var(--color-warn); }
  .swatch.absent  { background: transparent; border: 1px solid var(--color-border); }
</style>
