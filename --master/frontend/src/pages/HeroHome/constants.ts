export const HERO_COPY = {
  titleAlt: '「数」览徽筑，「艺」承千年',
  subtitleCn: '徽州建筑文化可视化',
  subtitleEn: 'Digital Narrative of Huizhou Architecture',
  primaryAction: '展开长卷',
  secondaryAction: '进入模块',
  scrollHint: 'SCROLL TO EXPLORE',
} as const

export const HERO_TIMINGS = {
  baseFadeMs: 1000,
  inkDelayMs: 1050,
  titleStartDelayMs: 1450,
  buttonDelayMs: 2800,
} as const

export const HERO_TITLE_ASSETS = [
  '/homepage/huizhou-calligraphy-solid.svg',
] as const

export const GUIDE_CHAPTERS = [
  {
    id: 'settlement',
    title: '聚落格局',
    cue: '章一',
    summary: '从区域地图与时序变化切入，理解徽州村落如何顺应山水、生长成形。',
    focuses: [{ label: '聚落格局', to: '/module1' }],
    to: '/module1',
  },
  {
    id: 'module2-buildings',
    title: '构筑万象',
    cue: '章二',
    summary: '围绕建筑构件展开观察，拆解屋顶、墙体与空间采光之间的结构关系。',
    focuses: [
      { label: '屋顶', to: '/module2' },
      { label: '马头墙', to: '/module2' },
      { label: '粉墙肌理', to: '/module2' },
      { label: '天井与光影', to: '/module2' },
    ],
    to: '/module2',
  },
  {
    id: 'module3-craft',
    title: '匠艺与叙事',
    cue: '章三',
    summary: '将木雕石雕装饰与文化叙事并置阅读，感受技艺背后的礼序与地方记忆。',
    focuses: [
      { label: '木雕石雕装饰', to: '/module3' },
      { label: '文化叙事', to: '/module3' },
    ],
    to: '/module3',
  },
] as const
