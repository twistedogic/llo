import { describe, it, expect } from 'vitest'
import {
  computeRateSLO,
  computeAverageSLO,
  computeErrorBudget,
  computeRollingAverage,
} from './index'
import type { DayLog, MetricDefinition } from '../metrics/types'

function makeLog(date: string, metricId: string, value: number | null, skipped = false): DayLog {
  return {
    date,
    committed: true,
    committedAt: `${date}T20:00:00Z`,
    entries: {
      [metricId]: { skipped, value },
    },
    energy: { skipped: false, start: 7, end: 6 },
    journal: null,
  }
}

function makeAbsentLog(date: string): DayLog {
  return {
    date,
    committed: false,
    committedAt: null,
    entries: {},
    energy: { skipped: true, start: null, end: null },
    journal: null,
  }
}

const sleepMetric: MetricDefinition = {
  id: 'sleep',
  name: 'Hours of Sleep',
  group: 'body',
  type: 'hours',
  unit: 'hours',
  sloTarget: 7,
  sloCondition: 'gte',
  sloWindow: 30,
  sloRate: 0.8,
  invertDisplay: false,
  whySentence: 'test',
}

const cogloadMetric: MetricDefinition = {
  id: 'cogload',
  name: 'Cognitive Load',
  group: 'mind',
  type: 'scale',
  unit: '1-10',
  sloTarget: 6,
  sloCondition: 'lte',
  sloWindow: 30,
  sloRate: null,
  invertDisplay: true,
  whySentence: 'test',
}

function dateDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

describe('computeRateSLO', () => {
  it('passes when compliance meets rate target', () => {
    const logs = Array.from({ length: 10 }, (_, i) =>
      makeLog(dateDaysAgo(10 - i), 'sleep', i < 9 ? 7.5 : 6)
    )
    const result = computeRateSLO(sleepMetric, logs)
    expect(result.passing).toBe(true)
    expect(result.compliance).toBeCloseTo(0.9)
  })

  it('fails when compliance falls below rate target', () => {
    const logs = Array.from({ length: 10 }, (_, i) =>
      makeLog(dateDaysAgo(10 - i), 'sleep', i < 7 ? 6 : 7.5)
    )
    const result = computeRateSLO(sleepMetric, logs)
    expect(result.passing).toBe(false)
    expect(result.compliance).toBeCloseTo(0.3)
  })

  it('excludes absent days from denominator', () => {
    const logs = [
      makeLog(dateDaysAgo(3), 'sleep', 7.5),
      makeLog(dateDaysAgo(2), 'sleep', 7.5),
      makeAbsentLog(dateDaysAgo(1)),
    ]
    const result = computeRateSLO(sleepMetric, logs)
    expect(result.compliance).toBeCloseTo(1)
  })
})

describe('computeAverageSLO', () => {
  it('fails inverted metric when average exceeds target', () => {
    const logs = Array.from({ length: 5 }, (_, i) =>
      makeLog(dateDaysAgo(5 - i), 'cogload', 7)
    )
    const result = computeAverageSLO(cogloadMetric, logs)
    expect(result.passing).toBe(false)
    expect(result.value).toBeCloseTo(7)
  })

  it('passes inverted metric when average is at or below target', () => {
    const logs = Array.from({ length: 5 }, (_, i) =>
      makeLog(dateDaysAgo(5 - i), 'cogload', 5)
    )
    const result = computeAverageSLO(cogloadMetric, logs)
    expect(result.passing).toBe(true)
  })
})

describe('computeErrorBudget', () => {
  it('computes remaining budget correctly', () => {
    const logs = Array.from({ length: 20 }, (_, i) =>
      makeLog(dateDaysAgo(20 - i), 'sleep', i < 3 ? 6 : 7.5)
    )
    const result = computeErrorBudget(sleepMetric, logs)
    expect(result).not.toBeNull()
    expect(result!.used).toBe(3)
    expect(result!.remaining).toBe(result!.allowed - result!.used)
    expect(result!.exhausted).toBe(result!.remaining === 0)
  })

  it('marks exhausted when budget is zero', () => {
    const logs = Array.from({ length: 10 }, (_, i) =>
      makeLog(dateDaysAgo(10 - i), 'sleep', i < 3 ? 6 : 7.5)
    )
    const result = computeErrorBudget(sleepMetric, logs)
    expect(result).not.toBeNull()
    expect(result!.exhausted).toBe(true)
  })

  it('returns null for average SLO metrics', () => {
    const result = computeErrorBudget(cogloadMetric, [])
    expect(result).toBeNull()
  })
})

describe('computeRollingAverage', () => {
  it('computes correct average over last n logs', () => {
    const logs = [
      makeLog(dateDaysAgo(3), 'sleep', 6),
      makeLog(dateDaysAgo(2), 'sleep', 8),
      makeLog(dateDaysAgo(1), 'sleep', 7),
    ]
    const avg = computeRollingAverage('sleep', logs, 30)
    expect(avg).toBeCloseTo(7)
  })

  it('returns null when no data', () => {
    expect(computeRollingAverage('sleep', [], 30)).toBeNull()
  })
})
