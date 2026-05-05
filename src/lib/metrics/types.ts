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
  skipped: boolean
  value: number | null
}

export interface EnergyEntry {
  skipped: boolean
  start: number | null
  end: number | null
}

export interface DayLog {
  date: string
  committed: boolean
  committedAt: string | null
  entries: Record<string, MetricEntry>
  energy: EnergyEntry
  journal: string | null
}
