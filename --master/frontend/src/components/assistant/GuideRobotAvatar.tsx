import { useEffect, useRef, useState } from 'react'
import type { Application } from 'pixi.js'
import type { Live2DModel } from 'pixi-live2d-display/cubism4'
import { loadCubismCore } from './loadCubismCore'
import { setupPixiLive2d } from './setupPixi'
import styles from './GuideRobotAvatar.module.css'

const MODEL_URL = `${import.meta.env.BASE_URL}assistant/tianqing/tianqing.model3.json`
export const AVATAR_W = 180
export const AVATAR_H = 220

type LoadState = 'loading' | 'ready' | 'error'

type Live2dSession = {
  app: Application
  model: Live2DModel
  onTick: () => void
}

type CoreModelLike = {
  setParameterValueById?: (id: string, value: number) => void
}

function applyIdleMotion(model: Live2DModel, elapsedMs: number) {
  try {
    const core = model.internalModel.coreModel as CoreModelLike
    const setParameter = core.setParameterValueById?.bind(core)
    if (!setParameter) return

    const t = elapsedMs / 1000
    const sway = Math.sin(t * 0.9)
    const lift = Math.sin(t * 0.7 + 0.8)
    const roll = Math.sin(t * 0.55 - 0.35)

    setParameter('ParamAngleX', sway * 8)
    setParameter('ParamAngleY', lift * 4)
    setParameter('ParamAngleZ', roll * 3)
    setParameter('ParamAngleX2', sway * 6)
    setParameter('ParamAngleY2', lift * 3)
    setParameter('ParamAngleZ2', roll * 2)
    setParameter('ParamBodyAngleX', sway * 3)
    setParameter('ParamBodyAngleY', lift * 1.5)
    setParameter('ParamBodyAngleZ', roll * 2)
    setParameter('ParamBreath', 0.5 + Math.sin(t * 1.8) * 0.5)
    setParameter('ParamEyeBallX', sway * 0.35)
    setParameter('ParamEyeBallY', lift * 0.2)
  } catch {
    /* ignore */
  }
}

function disposeSession(session: Live2dSession | null) {
  if (!session) return
  session.app.ticker.remove(session.onTick)
  session.model.destroy()
  session.app.destroy(true, { children: true, texture: true, baseTexture: true })
}

async function createSession(host: HTMLElement): Promise<Live2dSession> {
  await loadCubismCore()
  setupPixiLive2d()

  if (typeof window.Live2DCubismCore === 'undefined') {
    throw new Error('Live2DCubismCore missing')
  }

  const [{ Application }, { Live2DModel: Live2DModelClass }] = await Promise.all([
    import('pixi.js'),
    import('pixi-live2d-display/cubism4'),
  ])

  host.replaceChildren()

  const app = new Application({
    width: AVATAR_W,
    height: AVATAR_H,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    sharedTicker: false,
  })

  const view = app.view as HTMLCanvasElement
  host.appendChild(view)

  view.addEventListener('webglcontextlost', (event) => {
    event.preventDefault()
  })

  const model = await Live2DModelClass.from(MODEL_URL, {
    autoInteract: false,
    autoUpdate: false,
  })

  const bounds = model.getLocalBounds()
  const scale = Math.min((AVATAR_W * 0.92) / bounds.width, (AVATAR_H * 0.95) / bounds.height)
  model.scale.set(scale)
  model.anchor.set(0.5, 1)
  model.position.set(AVATAR_W / 2, AVATAR_H - 6)

  app.stage.addChild(model)

  let elapsedMs = 0
  const onTick = () => {
    elapsedMs += app.ticker.deltaMS
    applyIdleMotion(model, elapsedMs)
    model.update(app.ticker.deltaMS)
  }
  app.ticker.add(onTick)

  return { app, model, onTick }
}

export function GuideRobotAvatar() {
  const hostRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<Live2dSession | null>(null)
  const mountIdRef = useRef(0)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const mountId = ++mountIdRef.current
    let cancelled = false

    setLoadState('loading')

    void createSession(host)
      .then((session) => {
        if (cancelled || mountId !== mountIdRef.current) {
          disposeSession(session)
          return
        }
        disposeSession(sessionRef.current)
        sessionRef.current = session
        setLoadState('ready')
      })
      .catch((err) => {
        console.error('[GuideRobotAvatar]', err)
        if (!cancelled && mountId === mountIdRef.current) {
          setLoadState('error')
        }
      })

    return () => {
      cancelled = true
      if (mountId === mountIdRef.current) {
        disposeSession(sessionRef.current)
        sessionRef.current = null
      }
    }
  }, [retryKey])

  return (
    <div className={styles.avatarRoot}>
      <div ref={hostRef} className={styles.live2dHost} aria-hidden />

      {loadState === 'loading' ? (
        <div className={styles.statusOverlay}>
          <span className={styles.spinner} />
          <span>天青加载中…</span>
        </div>
      ) : null}

      {loadState === 'error' ? (
        <button
          type="button"
          className={styles.statusOverlay}
          onClick={(event) => {
            event.stopPropagation()
            setRetryKey((k) => k + 1)
          }}
        >
          模型加载失败
          <span className={styles.retryHint}>点击重试</span>
        </button>
      ) : null}
    </div>
  )
}
