import { useEffect, useRef, useState } from 'react'
import { AVATAR_H, AVATAR_W, GuideRobotAvatar } from './GuideRobotAvatar'
import { useAssistantStore } from './assistantStore'
import styles from './GuideRobotTrigger.module.css'

const EDGE_PEEK = 18
const NAV_OFFSET = 8

type Point = { x: number; y: number }
type EdgeSnap = 'none' | 'left' | 'right' | 'top' | 'bottom'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDefaultPosition(): Point {
  if (typeof window === 'undefined') return { x: 900, y: NAV_OFFSET }
  return {
    x: Math.max(16, window.innerWidth - AVATAR_W - 24),
    y: NAV_OFFSET,
  }
}

function snapToEdge(current: Point): { pos: Point; edge: EdgeSnap } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const nearLeft = current.x < -AVATAR_W * 0.55
  const nearRight = current.x > vw - AVATAR_W * 0.45
  const nearTop = current.y < -AVATAR_H * 0.55
  const nearBottom = current.y > vh - AVATAR_H * 0.45

  if (nearLeft) {
    return { pos: { x: -AVATAR_W + EDGE_PEEK, y: current.y }, edge: 'left' }
  }
  if (nearRight) {
    return { pos: { x: vw - EDGE_PEEK, y: current.y }, edge: 'right' }
  }
  if (nearTop) {
    return { pos: { x: current.x, y: -AVATAR_H + EDGE_PEEK }, edge: 'top' }
  }
  if (nearBottom) {
    return { pos: { x: current.x, y: vh - EDGE_PEEK }, edge: 'bottom' }
  }
  return { pos: current, edge: 'none' }
}

export function GuideRobotTrigger() {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<Point>(() => getDefaultPosition())
  const [edgeSnap, setEdgeSnap] = useState<EdgeSnap>('none')

  const mode = useAssistantStore((s) => s.mode)
  const toggleMenu = useAssistantStore((s) => s.toggleMenu)
  const closePanel = useAssistantStore((s) => s.closePanel)
  const setAnchorElement = useAssistantStore((s) => s.setAnchorElement)
  const refreshAnchor = useAssistantStore((s) => s.refreshAnchor)

  const dragRef = useRef<{
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    const el = triggerRef.current
    setAnchorElement(el)
    const onLayout = () => refreshAnchor()
    window.addEventListener('resize', onLayout)
    window.addEventListener('scroll', onLayout, true)
    return () => {
      setAnchorElement(null)
      window.removeEventListener('resize', onLayout)
      window.removeEventListener('scroll', onLayout, true)
    }
  }, [refreshAnchor, setAnchorElement])

  useEffect(() => {
    refreshAnchor()
  }, [position, refreshAnchor])

  useEffect(() => {
    function onResize() {
      setPosition((current) => ({
        x: clamp(current.x, 0, Math.max(0, window.innerWidth - AVATAR_W)),
        y: clamp(current.y, 0, Math.max(0, window.innerHeight - AVATAR_H)),
      }))
      setEdgeSnap('none')
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true
    setPosition({
      x: clamp(drag.originX + dx, -AVATAR_W + EDGE_PEEK, window.innerWidth - EDGE_PEEK),
      y: clamp(drag.originY + dy, -AVATAR_H + EDGE_PEEK, window.innerHeight - EDGE_PEEK),
    })
    setEdgeSnap('none')
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    dragRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)

    if (!drag?.moved) {
      if (edgeSnap !== 'none') {
        setEdgeSnap('none')
        setPosition(getDefaultPosition())
        return
      }
      if (mode === 'guide' || mode === 'chat') {
        closePanel()
        return
      }
      toggleMenu()
      return
    }

    setPosition((current) => {
      const { pos, edge } = snapToEdge(current)
      setEdgeSnap(edge)
      return pos
    })
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      className={`${styles.trigger} ${edgeSnap !== 'none' ? styles.edgeHidden : ''} ${
        mode !== 'idle' ? styles.triggerActive : ''
      }`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      aria-label="徽派建筑智能助手"
      title="拖动天青 · 点击打开菜单"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragRef.current = null
      }}
    >
      <GuideRobotAvatar />
    </button>
  )
}
