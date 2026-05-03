import type { DayLog, MetricDefinition } from '../metrics/types'
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
  if (!entry || entry.skipped) return null
  return entry.value
}

export interface SloResult {
  passing: boolean
  compliance: number
  value: number | null
}

export function computeRateSLO(
  metric: MetricDefinition,
  logs: DayLog[],
): SloResult {
  const window = getWindowLogs(logs, metric.sloWindow)
  if (window.length === 0) return { passing: true, compliance: 1, value: null }

  let meeting = 0
  for (const log of window) {
    const val = getMetricValue(log, metric.id)
    if (val === null) continue
    if (metric.sloCondition === 'gte' && val >= metric.sloTarget) meeting++
    if (metric.sloCondition === 'lte' && val <= metric.sloTarget) meeting++
  }

  const days = window.filter(l => {
    const entry = l.entries[metric.id]
    return entry !== undefined
  }).length

  if (days === 0) return { passing: true, compliance: 1, value: null }

  const compliance = meeting / days
  const rate = metric.sloRate ?? 0.8
  return {
    passing: compliance >= rate,
    compliance,
    value: compliance,
  }
}

export function computeAverageSLO(
  metric: MetricDefinition,
  logs: DayLog[],
): SloResult {
  const window = getWindowLogs(logs, metric.sloWindow)
  const values = window
    .map(l => getMetricValue(l, metric.id))
    .filter((v): v is number => v !== null)

  if (values.length === 0) return { passing: true, compliance: 1, value: null }

  const avg = values.reduce((a, b) => a + b, 0) / values.length

  const passing =
    metric.sloCondition === 'gte' ? avg >= metric.sloTarget : avg <= metric.sloTarget

  const range = metric.type === 'scale' ? 10 : metric.sloTarget * 2
  const compliance = metric.invertDisplay
    ? 1 - avg / range
    : avg / range

  return { passing, compliance: Math.min(1, Math.max(0, compliance)), value: avg }
}

export function computeSLO(metric: MetricDefinition, logs: DayLog[]): SloResult {
  if (metric.sloRate !== null) {
    return computeRateSLO(metric, logs)
  }
  return computeAverageSLO(metric, logs)
}

export interface BudgetResult {
  allowed: number
  used: number
  remaining: number
  exhausted: boolean
}

export function computeErrorBudget(
  metric: MetricDefinition,
  logs: DayLog[],
): BudgetResult | null {
  if (metric.sloRate === null) return null

  const window = getWindowLogs(logs, metric.sloWindow)
  const entries = window.filter(l => l.entries[metric.id] !== undefined)
  const total = entries.length
  const rate = metric.sloRate

  const allowed = Math.floor(total * (1 - rate))

  let misses = 0
  for (const log of entries) {
    const val = getMetricValue(log, metric.id)
    if (val === null) {
      misses++
    } else if (metric.sloCondition === 'gte' && val < metric.sloTarget) {
      misses++
    } else if (metric.sloCondition === 'lte' && val > metric.sloTarget) {
      misses++
    }
  }

  const remaining = Math.max(0, allowed - misses)
  return { allowed, used: misses, remaining, exhausted: remaining === 0 }
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
    .filter(l => l.committed && !l.energy.skipped)
    .slice(-n)
    .map(l => (field === 'start' ? l.energy.start : l.energy.end))
    .filter((v): v is number => v !== null)

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
