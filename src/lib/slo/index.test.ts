import { describe, it, expect } from 'vitest'
import {
  computeDirection,
  computeRollingAverage,
} from './index'
import type { DayLog } from '../metrics/types'

function makeLog(date: string, metricId: string, value: number): DayLog {
  return {
    date,
    committed: true,
    committedAt: `${date}T20:00:00Z`,
    entries: {
      [metricId]: { value },
    },
    energy: { start: 7, end: 6 },
    journal: null,
  }
}

function dateDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

describe('computeDirection', () => {
  it('returns null when fewer than 7 entries exist', () => {
    const logs = Array.from({ length: 5 }, (_, i) =>
      makeLog(dateDaysAgo(5 - i), 'sleep', 7)
    )
    const result = computeDirection('sleep', logs)
    expect(result.direction).toBeNull()
  })

  it('returns recentAvg even when direction is null', () => {
    const logs = Array.from({ length: 5 }, (_, i) =>
      makeLog(dateDaysAgo(5 - i), 'sleep', 7)
    )
    const result = computeDirection('sleep', logs)
    expect(result.recentAvg).toBeNull()
  })

  it('returns flat when recent and prior averages are within 5%', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'sleep', 7)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'sleep', 7.1)
    )
    const result = computeDirection('sleep', [...prior, ...recent])
    expect(result.direction).toBe('flat')
  })

  it('returns up when recent average is significantly higher', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'sleep', 6)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'sleep', 8)
    )
    const result = computeDirection('sleep', [...prior, ...recent])
    expect(result.direction).toBe('up')
  })

  it('returns down when recent average is significantly lower', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'sleep', 8)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'sleep', 6)
    )
    const result = computeDirection('sleep', [...prior, ...recent])
    expect(result.direction).toBe('down')
  })

  it('inverts direction for invertDisplay metrics (up becomes down)', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'cogload', 4)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'cogload', 7)
    )
    const result = computeDirection('cogload', [...prior, ...recent], true)
    expect(result.direction).toBe('down')
  })

  it('inverts direction for invertDisplay metrics (down becomes up)', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'cogload', 7)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'cogload', 4)
    )
    const result = computeDirection('cogload', [...prior, ...recent], true)
    expect(result.direction).toBe('up')
  })

  it('includes recentAvg in result', () => {
    const prior = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(28 - i), 'sleep', 6)
    )
    const recent = Array.from({ length: 14 }, (_, i) =>
      makeLog(dateDaysAgo(14 - i), 'sleep', 8)
    )
    const result = computeDirection('sleep', [...prior, ...recent])
    expect(result.recentAvg).toBeCloseTo(8)
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
