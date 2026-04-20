import type { HeritageRiverActionId, HeritageTypeCategory } from '../types'

/**
 * 用户提供的蓝系 + 灰蓝/桃点缀（与地图、生命之河共用，避免两处漂移）
 */
export const BLUE = {
  navy: '#254e7a',
  steel: '#517fab',
  sky: '#7ebce7',
  pale: '#c5e1ef',
  cream: '#f4f2eb',
  midBlue: '#76a1d1',
  blueGrey: '#adbfdd',
  lavenderGrey: '#c8cedf',
  peach: '#f5d8c8',
  grey: '#e1e1e1',
} as const

/**
 * 地图热力：截止 1911 各地徽派建筑总数量，越多越深（浅→深）
 * 用户新配色（浅→深）：#e8d3ae → #dfc399 → #c3865a → #aa5b46
 */
export const HEAT_MAP_GRADIENT = [
  '#e8d3ae',
  '#dfc399',
  '#c3865a',
  '#aa5b46',
] as const

/** ECharts 地图：底图、标注、图钉（与热力同系暖棕） */
export const MAP_GEO_THEME = {
  land: HEAT_MAP_GRADIENT[0],
  ink: '#6f4b3f',
  border: 'rgba(170, 91, 70, 0.22)',
  focus: '#aa5b46',
  hoverLine: 'rgba(195, 134, 90, 0.9)',
  pinDefault: '#c3865a',
  pinHover: '#dfc399',
  pinSel: '#aa5b46',
  pinBorder: '#ffffff',
  pinAccent: '#e8d3ae',
} as const

/** 遗存类型（六类） */
export const TYPE_COLOR: Record<HeritageTypeCategory, string> = {
  民居: '#9a5c4a',
  祠堂: '#b7825f',
  牌坊: '#d6b77a',
  桥梁: '#7c6a45',
  '综合用途/建筑群': '#c5ab86',
  其他: '#938577',
}

/** 沿革节点图例（九类，色值互不重复） */
export const ACTION_LEGEND_COLORS: Record<HeritageRiverActionId, string> = {
  // 颜色尽量收敛：颜色只做“大类主次”，精细区分由形状完成
  settle: '#6F928C',
  waterworks: '#6F928C',
  'clan-public': '#B7925D',
  edict: '#B7925D',
  layout: '#A86F4D',
  boom: '#B7925D',
  repair: '#A86F4D',
  warfare: '#A86F4D',
  other: '#6F928C',
}
