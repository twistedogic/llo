import type { DayLog } from '../metrics/types'
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
      if (!entry || entry.skipped) return ''
      return entry.value !== null ? String(entry.value) : ''
    })

    const energyStart = log.energy.skipped ? '' : (log.energy.start !== null ? String(log.energy.start) : '')
    const energyEnd = log.energy.skipped ? '' : (log.energy.end !== null ? String(log.energy.end) : '')
    const energyDelta =
      !log.energy.skipped && log.energy.start !== null && log.energy.end !== null
        ? String(log.energy.end - log.energy.start)
        : ''

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
