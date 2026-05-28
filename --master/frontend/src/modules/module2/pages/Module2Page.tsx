import { useEffect, useRef } from 'react'
import styles from './Module2Page.module.css'

export function Module2Page() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const chartsUrl = `${import.meta.env.BASE_URL}charts/module2.html`

  useEffect(() => {
    function fit() {
      if (!wrapRef.current) return
      const navEl = document.querySelector('header') as HTMLElement | null
      const navH = navEl ? navEl.getBoundingClientRect().height : 58
      wrapRef.current.style.height = `${window.innerHeight - navH}px`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <div ref={wrapRef} className={styles.fullBleed}>
      <iframe
        title="module2"
        className={styles.iframe}
        src={chartsUrl}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
