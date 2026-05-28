export type KnowledgeEntry = {
  id: string
  questions: string[]
  keywords: string[]
  answer: string
}

export type GuideFanKey = 'tj' | 'fq' | 'mtq' | 'wd'
export type GuideCraftKey = 'wood' | 'stone' | 'brick'

export type GuideAction =
  | { type: 'setFan'; key: GuideFanKey }
  | { type: 'setCraft'; key: GuideCraftKey }

export type GuideStep = {
  id: string
  path: '/module1' | '/module2' | '/module3'
  target: string
  title: string
  body: string
  action?: GuideAction
}

export const HUI_GUIDE_MESSAGE = 'hui-guide' as const

export type HuiGuideMessage =
  | { type: typeof HUI_GUIDE_MESSAGE; action: 'setFan'; key: GuideFanKey }
  | { type: typeof HUI_GUIDE_MESSAGE; action: 'setCraft'; key: GuideCraftKey }
