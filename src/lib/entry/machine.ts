import type { MetricDefinition } from '../metrics/types'

export type EntryPhase =
  | { type: 'IDLE' }
  | { type: 'IN_CARD'; cardIndex: number }
  | { type: 'IN_JOURNAL' }
  | { type: 'IN_COMMIT' }
  | { type: 'COMMITTED' }

export type CardType = 'metric' | 'energy' | 'journal' | 'commit'

export interface CardDescriptor {
  type: CardType
  metric?: MetricDefinition
}

export function buildCardSequence(metrics: MetricDefinition[]): CardDescriptor[] {
  return [
    ...metrics.map(m => ({ type: 'metric' as const, metric: m })),
    { type: 'energy' as const },
    { type: 'journal' as const },
    { type: 'commit' as const },
  ]
}
