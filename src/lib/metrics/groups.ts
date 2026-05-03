import { METRICS } from './definitions'
import type { MetricDefinition, MetricGroup } from './types'

export interface GroupDefinition {
  id: MetricGroup
  label: string
  metrics: MetricDefinition[]
}

export const GROUP_ORDER: MetricGroup[] = ['social', 'body', 'mind', 'life']

export const GROUP_LABELS: Record<MetricGroup, string> = {
  social: 'Social',
  body: 'Body',
  mind: 'Mind',
  life: 'Life',
}

export function getGroups(): GroupDefinition[] {
  return GROUP_ORDER.map(id => ({
    id,
    label: GROUP_LABELS[id],
    metrics: METRICS.filter(m => m.group === id),
  }))
}

export function getGroupMetrics(group: MetricGroup): MetricDefinition[] {
  return METRICS.filter(m => m.group === group)
}
