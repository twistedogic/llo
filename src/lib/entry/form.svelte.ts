import { METRICS } from '../metrics/definitions'
import { getDayLog, saveDayLog, autoCommitPreviousDay, todayDate } from '../db/index'
import { resolveValue } from '../metrics/types'
import type { DayLog } from '../metrics/types'

let metricValues = $state<Record<string, number>>(
  Object.fromEntries(METRICS.map(m => [m.id, 0]))
)
let energy = $state<{ start: number; end: number }>({ start: 0, end: 0 })
let journal = $state<string>('')

let saveTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSave() {
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { saveTimer = null; persistNow() }, 800)
}

function persistNow() {
  if (saveTimer !== null) { clearTimeout(saveTimer); saveTimer = null }
  const log: DayLog = {
    date: todayDate(),
    committed: false,
    committedAt: null,
    entries: Object.fromEntries(
      Object.entries(metricValues).map(([id, value]) => [id, { value }])
    ),
    energy: { start: energy.start, end: energy.end },
    journal: journal.trim() || null,
  }
  saveDayLog(log.date, log).catch(console.error)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && saveTimer !== null) {
      persistNow()
    }
  })
}

export async function loadToday(): Promise<void> {
  await autoCommitPreviousDay()
  const log = await getDayLog(todayDate())
  if (log) {
    for (const m of METRICS) {
      metricValues[m.id] = resolveValue(log.entries[m.id])
    }
    energy = {
      start: typeof log.energy?.start === 'number' ? log.energy.start : 0,
      end: typeof log.energy?.end === 'number' ? log.energy.end : 0,
    }
    journal = log.journal ?? ''
  } else {
    metricValues = Object.fromEntries(METRICS.map(m => [m.id, 0]))
    energy = { start: 0, end: 0 }
    journal = ''
  }
}

export function getMetricValues(): Record<string, number> { return metricValues }
export function getEnergy(): { start: number; end: number } { return energy }
export function getJournal(): string { return journal }

export function setMetric(id: string, value: number) {
  metricValues[id] = Math.max(0, value)
  scheduleSave()
}

export function setEnergy(field: 'start' | 'end', value: number) {
  energy = { ...energy, [field]: Math.max(0, value) }
  scheduleSave()
}

export function setJournal(text: string) {
  journal = text
  scheduleSave()
}
