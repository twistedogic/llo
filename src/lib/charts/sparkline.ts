import type { Options } from 'uplot'

export function sparklineConfig(
  data: uPlot.AlignedData,
  color: string,
  width: number,
  height: number,
): Options {
  return {
    width,
    height,
    cursor: { show: false },
    select: { show: false },
    legend: { show: false },
    axes: [{ show: false }, { show: false }],
    scales: { x: { time: false } },
    series: [
      {},
      {
        stroke: color,
        width: 2,
        spanGaps: false,
        fill: color + '22',
      },
    ],
    data,
  }
}
