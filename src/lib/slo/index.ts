import type { DayLog } from '../metrics/types'
import { resolveValue } from '../metrics/types'
import { todayDate } from '../db/index'

function dateNDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function getWindowLogs(logs: DayLog[], windowDays: number): DayLog[] {
  const start = dateNDaysAgo(windowDays - 1)
  const today = todayDate()
  return logs.filter(l => l.committed && l.date >= start && l.date <= today)
}

function getMetricValue(log: DayLog, metricId: string): number | null {
  const entry = log.entries[metricId]
  if (!entry) return null
  return resolveValue(entry)
}

export interface DirectionResult {
  direction: 'up' | 'down' | 'flat' | null
  recentAvg: number | null
}

export function computeDirection(
  metricId: string,
  logs: DayLog[],
  invertDisplay = false,
): DirectionResult {
  const committed = logs.filter(l => l.committed).sort((a, b) => a.date.localeCompare(b.date))
  const values = committed
    .map(l => getMetricValue(l, metricId))
    .filter((v): v is number => v !== null)

  if (values.length < 7) return { direction: null, recentAvg: null }

  const recentSlice = values.slice(-14)
  const priorSlice = values.slice(-28, -14)

  const recentAvg = recentSlice.reduce((a, b) => a + b, 0) / recentSlice.length

  if (priorSlice.length === 0) return { direction: null, recentAvg }

  const priorAvg = priorSlice.reduce((a, b) => a + b, 0) / priorSlice.length

  const threshold = 0.05
  const ratio = priorAvg === 0 ? 1 : Math.abs(recentAvg - priorAvg) / priorAvg

  let direction: 'up' | 'down' | 'flat'
  if (ratio <= threshold) {
    direction = 'flat'
  } else if (recentAvg > priorAvg) {
    direction = invertDisplay ? 'down' : 'up'
  } else {
    direction = invertDisplay ? 'up' : 'down'
  }

  return { direction, recentAvg }
}

export function computeRollingAverage(
  metricId: string,
  logs: DayLog[],
  n = 30,
): number | null {
  const recent = logs
    .filter(l => l.committed)
    .slice(-n)
    .map(l => getMetricValue(l, metricId))
    .filter((v): v is number => v !== null)

  if (recent.length === 0) return null
  return recent.reduce((a, b) => a + b, 0) / recent.length
}

export function computeEnergyRollingAverage(
  logs: DayLog[],
  field: 'start' | 'end',
  n = 30,
): number | null {
  const recent = logs
    .filter(l => l.committed)
    .slice(-n)
    .map(l => (field === 'start' ? (l.energy?.start ?? 0) : (l.energy?.end ?? 0)))

  if (recent.length === 0) return null
  return recent.reduce((a, b) => a + b, 0) / recent.length
}

export function computePearsonCorrelation(
  metricIdA: string,
  metricIdB: string,
  logs: DayLog[],
  windowDays = 30,
): number | null {
  const window = getWindowLogs(logs, windowDays)

  const pairs: Array<[number, number]> = []
  for (const log of window) {
    const a = getMetricValue(log, metricIdA)
    const b = getMetricValue(log, metricIdB)
    if (a !== null && b !== null) pairs.push([a, b])
  }

  if (pairs.length < 3) return null

  const n = pairs.length
  const meanA = pairs.reduce((s, [a]) => s + a, 0) / n
  const meanB = pairs.reduce((s, [, b]) => s + b, 0) / n

  let num = 0, denomA = 0, denomB = 0
  for (const [a, b] of pairs) {
    const da = a - meanA
    const db = b - meanB
    num += da * db
    denomA += da * da
    denomB += db * db
  }

  const denom = Math.sqrt(denomA * denomB)
  if (denom === 0) return null
  return Math.min(1, Math.max(-1, num / denom))
}

export function computeSmoothedSeries(
  values: (number | null)[],
  windowSize = 7,
): (number | null)[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - windowSize + 1), i + 1)
    const valid = slice.filter((v): v is number => v !== null)
    if (valid.length === 0) return null
    return valid.reduce((a, b) => a + b, 0) / valid.length
  })
}

export function computeStdDev(
  values: (number | null)[],
  smoothed: (number | null)[],
): (number | null)[] {
  return smoothed.map((mean, i) => {
    if (mean === null) return null
    const slice = values.slice(Math.max(0, i - 6), i + 1)
    const valid = slice.filter((v): v is number => v !== null)
    if (valid.length < 2) return null
    const variance = valid.reduce((s, v) => s + (v - mean) ** 2, 0) / valid.length
    return Math.sqrt(variance)
  })
}
