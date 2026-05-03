import { METRICS } from '../metrics/definitions'
import { buildCardSequence, type CardDescriptor, type EntryPhase } from './machine'
import type { MetricEntry, EnergyEntry, DayLog } from '../metrics/types'
import { todayDate } from '../db/index'

const cards: CardDescriptor[] = buildCardSequence(METRICS)

function makeDefaultEntry(): MetricEntry {
  return { skipped: false, value: null }
}

function makeDefaultEnergy(): EnergyEntry {
  return { skipped: false, start: null, end: null }
}

let phase = $state<EntryPhase>({ type: 'IDLE' })
let cardIndex = $state(0)
let entries = $state<Record<string, MetricEntry>>(
  Object.fromEntries(METRICS.map(m => [m.id, makeDefaultEntry()]))
)
let energy = $state<EnergyEntry>(makeDefaultEnergy())
let journal = $state<string>('')

export function getPhase(): EntryPhase { return phase }
export function getCardIndex(): number { return cardIndex }
export function getCards(): CardDescriptor[] { return cards }
export function getCurrentCard(): CardDescriptor { return cards[cardIndex] }
export function getEntry(id: string): MetricEntry { return entries[id] }
export function getEnergy(): EnergyEntry { return energy }
export function getJournal(): string { return journal }

export function startEntry() {
  phase = { type: 'IN_CARD', cardIndex: 0 }
  cardIndex = 0
  entries = Object.fromEntries(METRICS.map(m => [m.id, makeDefaultEntry()]))
  energy = makeDefaultEnergy()
  journal = ''
}

export function setMetricValue(id: string, value: number | null) {
  entries[id] = { skipped: false, value }
}

export function skipMetric(id: string) {
  entries[id] = { skipped: true, value: null }
}

export function setEnergyValues(start: number | null, end: number | null) {
  energy = { skipped: false, start, end }
}

export function skipEnergy() {
  energy = { skipped: true, start: null, end: null }
}

export function setJournal(text: string) {
  journal = text
}

export function advance() {
  if (cardIndex < cards.length - 1) {
    cardIndex++
    const card = cards[cardIndex]
    if (card.type === 'journal') {
      phase = { type: 'IN_JOURNAL' }
    } else if (card.type === 'commit') {
      phase = { type: 'IN_COMMIT' }
    } else {
      phase = { type: 'IN_CARD', cardIndex }
    }
  }
}

export function back() {
  if (cardIndex > 0) {
    cardIndex--
    const card = cards[cardIndex]
    if (card.type === 'metric' || card.type === 'energy') {
      phase = { type: 'IN_CARD', cardIndex }
    } else if (card.type === 'journal') {
      phase = { type: 'IN_JOURNAL' }
    }
  }
}

export function buildDayLog(): DayLog {
  return {
    date: todayDate(),
    committed: false,
    committedAt: null,
    entries: { ...entries },
    energy: { ...energy },
    journal: journal.trim() || null,
  }
}

export function markCommitted() {
  phase = { type: 'COMMITTED' }
}

export function getLoggedCount(): number {
  return Object.values(entries).filter(e => !e.skipped && e.value !== null).length
}

export function getSkippedCount(): number {
  return Object.values(entries).filter(e => e.skipped).length
}
