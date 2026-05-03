<script lang="ts">
  import { onMount } from 'svelte'
  import MetricCard from './MetricCard.svelte'
  import EnergyCard from './EnergyCard.svelte'
  import JournalCard from './JournalCard.svelte'
  import CommitCard from './CommitCard.svelte'
  import { METRICS } from '../lib/metrics/definitions'
  import {
    startEntry,
    advance,
    back,
    setMetricValue,
    skipMetric,
    setEnergyValues,
    skipEnergy,
    setJournal,
    buildDayLog,
    markCommitted,
    getCards,
    getCardIndex,
    getEntry,
    getEnergy,
    getJournal,
    getLoggedCount,
    getSkippedCount,
  } from '../lib/entry/session.svelte'
  import {
    computeRollingAverage,
    computeEnergyRollingAverage,
  } from '../lib/slo/index'
  import { commitDay } from '../lib/db/index'
  import type { DayLog } from '../lib/metrics/types'

  let {
    recentLogs = [],
    onCommitted,
  }: {
    recentLogs?: DayLog[]
    onCommitted?: () => void
  } = $props()

  const cards = getCards()

  let touchStartX = 0
  let touchStartY = 0
  let dragging = $state(false)
  let dragOffset = $state(0)
  let animating = $state(false)
  let direction = $state<'forward' | 'backward'>('forward')

  onMount(() => {
    startEntry()
  })

  function getRollingAvg(metricId: string): number | null {
    return computeRollingAverage(metricId, recentLogs, 30)
  }

  function getEnergyAvg(field: 'start' | 'end'): number | null {
    return computeEnergyRollingAverage(recentLogs, field, 30)
  }

  function animateForward() {
    direction = 'forward'
    animating = true
    setTimeout(() => { animating = false; dragOffset = 0 }, 350)
  }

  function animateBackward() {
    direction = 'backward'
    animating = true
    setTimeout(() => { animating = false; dragOffset = 0 }, 350)
  }

  function handleMetricDone(metricId: string, value: number) {
    setMetricValue(metricId, value)
    animateForward()
    advance()
  }

  function handleMetricSkip(metricId: string) {
    skipMetric(metricId)
    animateForward()
    advance()
  }

  function handleEnergyDone(start: number, end: number) {
    setEnergyValues(start, end)
    animateForward()
    advance()
  }

  function handleEnergySkip() {
    skipEnergy()
    animateForward()
    advance()
  }

  function handleJournalDone(text: string) {
    setJournal(text)
    animateForward()
    advance()
  }

  function handleBack() {
    animateBackward()
    back()
  }

  async function handleCommit() {
    const log = buildDayLog()
    try {
      await commitDay(log.date, log)
      markCommitted()
      onCommitted?.()
    } catch (e) {
      console.error('Commit failed:', e)
    }
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
    dragging = true
  }

  function onTouchMove(e: TouchEvent) {
    if (!dragging) return
    const dx = e.touches[0].clientX - touchStartX
    const dy = Math.abs(e.touches[0].clientY - touchStartY)
    if (dy > 20) { dragging = false; return }
    dragOffset = dx
  }

  function onTouchEnd() {
    if (!dragging) return
    dragging = false
    const threshold = 80
    if (dragOffset < -threshold) {
      const ci = getCardIndex()
      if (ci < cards.length - 1) {
        dragOffset = 0
        advance()
      }
    } else if (dragOffset > threshold) {
      dragOffset = 0
      back()
    } else {
      dragOffset = 0
    }
  }

  let cardIndex = $derived(getCardIndex())
  let loggedCount = $derived(getLoggedCount())
  let skippedCount = $derived(getSkippedCount())
</script>

<div
  class="entry-flow"
  ontouchstart={onTouchStart}
  ontouchmove={onTouchMove}
  ontouchend={onTouchEnd}
>
  <div
    class="card-container"
    class:animating
    class:forward={direction === 'forward'}
    class:backward={direction === 'backward'}
    style:transform={dragging ? `translateX(${dragOffset}px)` : undefined}
  >
    {#if cardIndex < METRICS.length}
      {@const metric = METRICS[cardIndex]}
      <MetricCard
        {metric}
        defaultValue={getRollingAvg(metric.id)}
        onDone={(v) => handleMetricDone(metric.id, v)}
        onSkip={() => handleMetricSkip(metric.id)}
        onBack={handleBack}
      />
    {:else if cards[cardIndex]?.type === 'energy'}
      <EnergyCard
        defaultStart={getEnergyAvg('start')}
        defaultEnd={getEnergyAvg('end')}
        onDone={handleEnergyDone}
        onSkip={handleEnergySkip}
        onBack={handleBack}
      />
    {:else if cards[cardIndex]?.type === 'journal'}
      <JournalCard
        initialText={getJournal()}
        onDone={handleJournalDone}
        onBack={handleBack}
      />
    {:else if cards[cardIndex]?.type === 'commit'}
      <CommitCard
        {loggedCount}
        {skippedCount}
        totalCount={METRICS.length}
        onCommit={handleCommit}
        onBack={handleBack}
      />
    {/if}
  </div>

  <div class="progress-dots">
    {#each cards as _, i}
      <div class="dot" class:active={i === cardIndex} class:done={i < cardIndex}></div>
    {/each}
  </div>
</div>

<style>
  .entry-flow {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .card-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    transition: none;
  }

  .card-container.animating.forward {
    animation: slideInForward var(--transition-slow) ease both;
  }

  .card-container.animating.backward {
    animation: slideInBackward var(--transition-slow) ease both;
  }

  @keyframes slideInForward {
    from { transform: translateX(60px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  @keyframes slideInBackward {
    from { transform: translateX(-60px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }

  .progress-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: var(--space-3) 0;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full);
    background: var(--color-border);
    transition: all var(--transition-base);
  }

  .dot.done {
    background: var(--color-accent-dim);
  }

  .dot.active {
    background: var(--color-accent);
    width: 18px;
  }
</style>
