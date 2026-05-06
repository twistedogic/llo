export type MetricType = 'count' | 'hours' | 'scale'

export type MetricGroup = 'social' | 'body' | 'mind' | 'life'

export interface MetricDefinition {
  id: string
  name: string
  group: MetricGroup
  type: MetricType
  unit: string
  invertDisplay: boolean
  whySentence: string
}

export interface MetricEntry {
  value: number
}

export interface EnergyEntry {
  start: number
  end: number
}

export interface DayLog {
  date: string
  committed: boolean
  committedAt: string | null
  entries: Record<string, MetricEntry>
  energy: EnergyEntry
  journal: string | null
}

export function resolveValue(entry: unknown): number {
  if (entry === null || entry === undefined) return 0
  if (typeof entry === 'number') return entry
  const e = entry as Record<string, unknown>
  if (typeof e.value === 'number') return e.value
  return 0
}
