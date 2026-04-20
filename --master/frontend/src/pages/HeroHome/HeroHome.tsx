import { useNavigate } from 'react-router-dom'
import styles from './HeroLanding.module.css'

export function HeroHome() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="徽州建筑文化可视化首页">
        <img
          className={styles.sceneImage}
          src="/homepage/hero-scene.png"
          alt="徽州山水村落长卷"
        />

        <div className={styles.stripesOverlay} aria-hidden />
        <div className={styles.mistLayer} aria-hidden />
        <div className={styles.waterRipple} aria-hidden />
        <div className={styles.centerFog} aria-hidden />

        <div className={styles.titleStage}>
          <img
            className={styles.titleImage}
            src="/homepage/hero-title-overlay.png"
            alt="数览徽境，艺叙千年"
          />
        </div>

        <button
          type="button"
          className={styles.enterBtn}
          onClick={() => navigate('/module1')}
          aria-label="点击进入模块"
        >
          <img src="/homepage/hero-enter-button.png" alt="点击进入" />
        </button>
      </section>
    </div>
  )
}
