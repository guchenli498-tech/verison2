import ReactECharts from 'echarts-for-react'
import type { BuildingCategoryDatum } from '../types'
import { HEAT_MAP_GRADIENT } from '../theme/module1VisualPalette'

const CATEGORY_COLORS: Record<string, string> = {
  民居: HEAT_MAP_GRADIENT[3],
  桥梁: HEAT_MAP_GRADIENT[2],
  '综合用途/建筑群': HEAT_MAP_GRADIENT[1],
  其他: HEAT_MAP_GRADIENT[0],
}
const FALLBACK_COLORS = [
  HEAT_MAP_GRADIENT[3],
  HEAT_MAP_GRADIENT[2],
  HEAT_MAP_GRADIENT[1],
  HEAT_MAP_GRADIENT[0],
  '#b67857',
]

export function BuildingCategoryDonut(props: {
  data: BuildingCategoryDatum[]
}) {
  const { data } = props

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(251, 248, 242, 0.97)',
      borderColor: 'rgba(170, 91, 70, 0.24)',
      borderWidth: 1,
      padding: [10, 14],
      extraCssText:
        'border-radius:10px; box-shadow:0 8px 28px rgba(170,91,70,0.12),0 2px 6px rgba(111,75,63,0.06);',
      textStyle: {
        color: '#6f4b3f',
        fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
        fontSize: 13,
      },
      formatter: (p: any) =>
        `<div style="font-weight:700;margin-bottom:3px;color:#6f4b3f">${p.name}</div>` +
        `<span style="opacity:.75">数量：</span><b style="color:${HEAT_MAP_GRADIENT[3]}">${p.value}</b>` +
        `<span style="opacity:.6;margin-left:8px">(${p.percent?.toFixed(1)}%)</span>`,
    },
    // 标题由外层 ChartPanel 统一渲染
    legend: { show: false },
    series: [
      {
        type: 'pie',
        roseType: 'radius',
        radius: ['18%', '78%'],
        center: ['50%', '54%'],
        avoidLabelOverlap: true,
        startAngle: 60,
        labelLine: {
          length: 10,
          length2: 8,
          smooth: true,
          lineStyle: { color: 'rgba(170,91,70,0.35)', width: 1 },
        },
        label: {
          show: true,
          formatter: (p: any) => {
            const pct = p.percent?.toFixed(0) ?? ''
            return `{name|${p.name}}\n{pct|${pct}%}`
          },
          rich: {
            name: {
              color: '#6f4b3f',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 17,
              fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
            },
            pct: {
              color: 'rgba(170,91,70,0.75)',
              fontSize: 10,
              lineHeight: 14,
              fontFamily: "'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif",
            },
          },
          overflow: 'break',
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: 'rgba(252,250,244,0.98)',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(170,91,70,0.12)',
          shadowOffsetY: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 22,
            shadowColor: 'rgba(170,91,70,0.24)',
            borderWidth: 3,
            borderColor: 'rgba(255,255,255,0.98)',
          },
          label: { show: true },
        },
        data: data.map((d, i) => ({
          name: d.category,
          value: d.value,
          itemStyle: {
            color: CATEGORY_COLORS[d.category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          },
        })),
      },
    ],
  }

  return (
    <div style={{ height: '100%' }}>
      <ReactECharts option={option} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
