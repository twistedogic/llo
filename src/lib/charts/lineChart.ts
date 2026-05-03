import type { Options } from 'uplot'

export function lineChartConfig(
  data: uPlot.AlignedData,
  color: string,
  goalValue: number | null,
  width: number,
  height: number,
): Options {
  const series: Options['series'] = [
    {},
    {
      label: 'Value',
      stroke: color,
      width: 2,
      spanGaps: false,
      fill: color + '18',
    },
  ]

  if (goalValue !== null) {
    series.push({
      label: 'Goal',
      stroke: '#facc1588',
      width: 1,
      dash: [4, 4],
      spanGaps: true,
    })
  }

  return {
    width,
    height,
    cursor: { show: true, drag: { x: false, y: false } },
    select: { show: false },
    legend: { show: false },
    axes: [
      {
        stroke: '#8888aa',
        ticks: { stroke: '#2a2a4a' },
        grid: { stroke: '#2a2a4a', width: 1 },
      },
      {
        stroke: '#8888aa',
        ticks: { stroke: '#2a2a4a' },
        grid: { stroke: '#2a2a4a', width: 1 },
      },
    ],
    series,
    data,
  }
}
