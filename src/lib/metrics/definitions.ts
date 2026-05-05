import type { MetricDefinition } from './types'

export const METRICS: MetricDefinition[] = [
  {
    id: 'interactions',
    name: 'People I Interacted With',
    group: 'social',
    type: 'count',
    unit: 'people',
    invertDisplay: false,
    whySentence: 'So that I stay engaged with the people around me and show up fully in the world each day.',
  },
  {
    id: 'smile',
    name: 'People I Made Smile',
    group: 'social',
    type: 'count',
    unit: 'people',
    invertDisplay: false,
    whySentence: 'So that I build belonging and leave joy wherever I go.',
  },
  {
    id: 'helped',
    name: 'People I Helped',
    group: 'social',
    type: 'count',
    unit: 'people',
    invertDisplay: false,
    whySentence: 'So that daily service compounds into a legacy of contribution.',
  },
  {
    id: 'thanked',
    name: 'People I Thanked',
    group: 'social',
    type: 'count',
    unit: 'people',
    invertDisplay: false,
    whySentence: 'So that gratitude becomes a practiced habit, not an afterthought.',
  },
  {
    id: 'sleep',
    name: 'Hours of Sleep',
    group: 'body',
    type: 'hours',
    unit: 'hours',
    invertDisplay: false,
    whySentence: 'So that I can think clearly and make good decisions into old age.',
  },
  {
    id: 'exercise',
    name: 'Hours of Exercise',
    group: 'body',
    type: 'hours',
    unit: 'hours',
    invertDisplay: false,
    whySentence: 'So that my body remains capable and energised for decades.',
  },
  {
    id: 'concepts',
    name: 'Concepts Learnt',
    group: 'mind',
    type: 'count',
    unit: 'concepts',
    invertDisplay: false,
    whySentence: 'So that daily learning compounds into wisdom over a lifetime.',
  },
  {
    id: 'cogload',
    name: 'Cognitive Load',
    group: 'mind',
    type: 'scale',
    unit: '1–10',
    invertDisplay: true,
    whySentence: 'So that I protect my mental clarity and trust in myself.',
  },
  {
    id: 'family',
    name: 'Family Active Time',
    group: 'life',
    type: 'hours',
    unit: 'hours',
    invertDisplay: false,
    whySentence: 'So that I am fully present and have no regret about the time I gave.',
  },
]

export const METRIC_IDS = METRICS.map(m => m.id)

export function getMetric(id: string): MetricDefinition | undefined {
  return METRICS.find(m => m.id === id)
}
