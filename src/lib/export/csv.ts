import type { DayLog } from '../metrics/types'
import { resolveValue } from '../metrics/types'
import { METRICS } from '../metrics/definitions'

function escape(val: string | null | undefined): string {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function buildCsv(logs: DayLog[]): string {
  const committed = logs.filter(l => l.committed)
  if (committed.length === 0) return ''

  const metricCols = METRICS.map(m => m.id)
  const headers = [
    'date',
    'committed_at',
    ...metricCols,
    'energy_start',
    'energy_end',
    'energy_delta',
    'journal',
  ]

  const rows = committed.map(log => {
    const metricValues = metricCols.map(id => {
      const entry = log.entries[id]
      if (!entry) return '0'
      return String(resolveValue(entry))
    })

    const energyStart = String(log.energy?.start ?? 0)
    const energyEnd = String(log.energy?.end ?? 0)
    const energyDelta = String((log.energy?.end ?? 0) - (log.energy?.start ?? 0))

    return [
      log.date,
      log.committedAt ?? '',
      ...metricValues,
      energyStart,
      energyEnd,
      energyDelta,
      escape(log.journal),
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
