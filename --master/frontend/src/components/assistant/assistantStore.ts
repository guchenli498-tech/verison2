import { create } from 'zustand'

export type AssistantMode = 'idle' | 'menu' | 'guide' | 'chat'

type AssistantState = {
  mode: AssistantMode
  anchor: DOMRect | null
  setMode: (mode: AssistantMode) => void
  setAnchorElement: (el: HTMLElement | null) => void
  refreshAnchor: () => void
  toggleMenu: () => void
  closePanel: () => void
}

let anchorElement: HTMLElement | null = null

export const useAssistantStore = create<AssistantState>((set, get) => ({
  mode: 'idle',
  anchor: null,

  setMode: (mode) => set({ mode }),

  setAnchorElement: (el) => {
    anchorElement = el
    set({ anchor: el ? el.getBoundingClientRect() : null })
  },

  refreshAnchor: () => {
    if (anchorElement) {
      set({ anchor: anchorElement.getBoundingClientRect() })
    }
  },

  toggleMenu: () => {
    const { mode } = get()
    if (mode === 'guide' || mode === 'chat') {
      set({ mode: 'idle' })
      return
    }
    set({ mode: mode === 'menu' ? 'idle' : 'menu' })
  },

  closePanel: () => set({ mode: 'idle' }),
}))
