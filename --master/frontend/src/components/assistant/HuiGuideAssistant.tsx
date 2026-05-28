import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAssistantStore } from './assistantStore'
import { guideSteps } from './guideSteps'
import knowledgeBaseJson from './knowledgeBase.json'
import type { GuideStep, HuiGuideMessage, KnowledgeEntry } from './types'
import { HUI_GUIDE_MESSAGE } from './types'
import styles from './HuiGuideAssistant.module.css'

type ChatMessage = { role: 'assistant' | 'user'; text: string }
type HighlightRect = { top: number; left: number; width: number; height: number }

const PANEL_WIDTH = 360
const PANEL_GAP = 12
const knowledgeBase = knowledgeBaseJson as KnowledgeEntry[]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '')
}

function scoreEntry(input: string, entry: KnowledgeEntry) {
  const text = normalize(input)
  let score = 0

  entry.questions.forEach((question) => {
    const q = normalize(question)
    if (text === q) score += 12
    if (text.includes(q) || q.includes(text)) score += 7
  })

  entry.keywords.forEach((keyword) => {
    const k = normalize(keyword)
    if (text.includes(k)) score += Math.max(2, k.length)
  })

  return score
}

function findAnswer(input: string) {
  const ranked = knowledgeBase
    .map((entry) => ({ entry, score: scoreEntry(input, entry) }))
    .sort((a, b) => b.score - a.score)

  if (ranked[0]?.score > 0) return ranked[0].entry.answer
  return '这个问题我暂时没有在知识库里找到准确答案。你可以换个问法，比如问「马头墙有什么作用」「模块二怎么看」或者「三雕是什么」。'
}

function findElementInDocument(doc: Document, target: string) {
  return doc.querySelector(`[data-guide-id="${target}"]`) as HTMLElement | null
}

function getElementRect(step: GuideStep): HighlightRect | null {
  const element = findElementInDocument(document, step.target)
  if (element) {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  }

  const frames = Array.from(document.querySelectorAll('iframe'))
  for (const frame of frames) {
    try {
      const doc = frame.contentDocument
      if (!doc) continue
      const inner = findElementInDocument(doc, step.target)
      if (!inner) continue
      const frameRect = frame.getBoundingClientRect()
      const innerRect = inner.getBoundingClientRect()
      return {
        top: frameRect.top + innerRect.top,
        left: frameRect.left + innerRect.left,
        width: innerRect.width,
        height: innerRect.height,
      }
    } catch {
      return null
    }
  }

  return null
}

function runStepAction(step: GuideStep) {
  if (!step.action) return
  const payload: HuiGuideMessage =
    step.action.type === 'setFan'
      ? { type: HUI_GUIDE_MESSAGE, action: 'setFan', key: step.action.key }
      : { type: HUI_GUIDE_MESSAGE, action: 'setCraft', key: step.action.key }
  const frames = Array.from(document.querySelectorAll('iframe'))
  for (const frame of frames) {
    frame.contentWindow?.postMessage(payload, '*')
  }
}

function resolvePanelPosition(anchor: DOMRect | null) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(PANEL_WIDTH, vw - 24)

  if (!anchor) {
    return {
      left: clamp(vw - width - 16, 12, vw - width - 12),
      top: 72,
      width,
    }
  }

  const preferLeft = anchor.left - width - PANEL_GAP
  const left =
    preferLeft >= 12
      ? preferLeft
      : clamp(anchor.right + PANEL_GAP, 12, Math.max(12, vw - width - 12))

  const top = clamp(anchor.bottom + PANEL_GAP, 12, Math.max(12, vh - 430))

  return { left, top, width }
}

export function HuiGuideAssistant() {
  const location = useLocation()
  const mode = useAssistantStore((s) => s.mode)
  const anchor = useAssistantStore((s) => s.anchor)
  const setMode = useAssistantStore((s) => s.setMode)
  const closePanel = useAssistantStore((s) => s.closePanel)
  const refreshAnchor = useAssistantStore((s) => s.refreshAnchor)

  const [stepOnPage, setStepOnPage] = useState(0)
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: '我在。可以问我徽派建筑、三雕、马头墙、天井，或者问「这个页面怎么看」。',
    },
  ])
  const guidePathRef = useRef<string | null>(null)

  const visibleSteps = useMemo(
    () => guideSteps.filter((step) => step.path === location.pathname),
    [location.pathname],
  )
  const currentStep = visibleSteps[stepOnPage]
  const panelPosition = useMemo(() => resolvePanelPosition(anchor), [anchor])

  const refreshHighlight = useCallback(() => {
    if (mode !== 'guide' || !currentStep) return
    setHighlightRect(getElementRect(currentStep))
    refreshAnchor()
  }, [currentStep, mode, refreshAnchor])

  useEffect(() => {
    function onResize() {
      refreshHighlight()
      refreshAnchor()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', refreshHighlight, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', refreshHighlight, true)
    }
  }, [refreshAnchor, refreshHighlight])

  useEffect(() => {
    if (mode !== 'guide') return
    if (guidePathRef.current && location.pathname !== guidePathRef.current) {
      closePanel()
      guidePathRef.current = null
      setHighlightRect(null)
    }
  }, [closePanel, location.pathname, mode])

  useEffect(() => {
    if (mode !== 'guide' || !currentStep) return

    runStepAction(currentStep)
    const timers = [80, 420, 900, 1400].map((delay) =>
      window.setTimeout(refreshHighlight, delay),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [currentStep, mode, refreshHighlight, stepOnPage])

  useEffect(() => {
    if (mode !== 'guide') setHighlightRect(null)
  }, [mode])

  useEffect(() => {
    if (mode === 'guide' && stepOnPage >= visibleSteps.length) {
      setStepOnPage(Math.max(0, visibleSteps.length - 1))
    }
  }, [mode, stepOnPage, visibleSteps.length])

  function beginGuide() {
    if (visibleSteps.length === 0) return
    guidePathRef.current = location.pathname
    setStepOnPage(0)
    setMode('guide')
  }

  function openChat() {
    guidePathRef.current = null
    setHighlightRect(null)
    setMode('chat')
  }

  function moveGuide(delta: 1 | -1) {
    setStepOnPage((current) =>
      clamp(current + delta, 0, Math.max(0, visibleSteps.length - 1)),
    )
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    const answer = findAnswer(text)
    setMessages((current) => [
      ...current,
      { role: 'user', text },
      { role: 'assistant', text: answer },
    ])
    setInput('')
  }

  const isLastGuideStep =
    visibleSteps.length > 0 && stepOnPage >= visibleSteps.length - 1

  return (
    <>
      {mode === 'guide' ? (
        <div className={styles.guideLayer} aria-live="polite">
          <button
            className={styles.guideDim}
            type="button"
            aria-label="关闭界面引导"
            onClick={closePanel}
          />
          {highlightRect ? (
            <div
              className={styles.highlight}
              style={{
                top: highlightRect.top - 8,
                left: highlightRect.left - 8,
                width: highlightRect.width + 16,
                height: highlightRect.height + 16,
              }}
            />
          ) : null}
        </div>
      ) : null}

      {mode === 'menu' ? (
        <section
          className={styles.popover}
          style={{
            left: panelPosition.left,
            top: panelPosition.top,
            width: panelPosition.width,
          }}
        >
          <div className={styles.panelHead}>
            <div>
              <strong>小徽在这儿</strong>
              <span>想先逛一圈，还是直接问我？</span>
            </div>
            <button type="button" onClick={closePanel} aria-label="关闭">
              ×
            </button>
          </div>
          <div className={styles.actionGrid}>
            <button type="button" onClick={beginGuide} disabled={visibleSteps.length === 0}>
              <strong>界面引导</strong>
              <span>
                {visibleSteps.length > 0
                  ? `本页 ${visibleSteps.length} 步，高亮讲解图表`
                  : '请进入模块页面后再使用'}
              </span>
            </button>
            <button type="button" onClick={openChat}>
              <strong>智能问答</strong>
              <span>用知识库回答徽派建筑问题</span>
            </button>
          </div>
        </section>
      ) : null}

      {mode === 'guide' && currentStep ? (
        <section
          className={`${styles.popover} ${styles.guideCard}`}
          style={{
            left: panelPosition.left,
            top: panelPosition.top,
            width: panelPosition.width,
          }}
        >
          <div className={styles.panelHead}>
            <div>
              <strong>{currentStep.title}</strong>
              <span>
                {stepOnPage + 1} / {visibleSteps.length}
              </span>
            </div>
            <button type="button" onClick={closePanel} aria-label="关闭">
              ×
            </button>
          </div>
          <p>{currentStep.body}</p>
          {!highlightRect ? (
            <div className={styles.guideHint}>正在等待图表加载，稍等一下就能对准。</div>
          ) : null}
          <div className={styles.guideActions}>
            <button type="button" onClick={() => moveGuide(-1)} disabled={stepOnPage === 0}>
              上一步
            </button>
            <button type="button" onClick={closePanel}>
              跳过
            </button>
            <button
              type="button"
              onClick={() => (isLastGuideStep ? closePanel() : moveGuide(1))}
            >
              {isLastGuideStep ? '完成' : '下一步'}
            </button>
          </div>
        </section>
      ) : null}

      {mode === 'chat' ? (
        <section
          className={`${styles.popover} ${styles.chatPanel}`}
          style={{
            left: panelPosition.left,
            top: panelPosition.top,
            width: panelPosition.width,
          }}
        >
          <div className={styles.panelHead}>
            <div>
              <strong>徽派建筑问答</strong>
              <span>当前是知识库版伪 Agent</span>
            </div>
            <button type="button" onClick={closePanel} aria-label="关闭">
              ×
            </button>
          </div>
          <div className={styles.messages}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form className={styles.chatForm} onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="问问马头墙、三雕、模块怎么看..."
            />
            <button type="submit">发送</button>
          </form>
        </section>
      ) : null}
    </>
  )
}
