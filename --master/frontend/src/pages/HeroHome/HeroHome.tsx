import { useRef } from 'react'
import { HeroBackground } from './HeroBackground'
import { HeroMistLayer } from './HeroMistLayer'
import { HeroTitle } from './HeroTitle'
import { HeroSeal } from './HeroSeal'
import { HeroActions } from './HeroActions'
import { ScrollHint } from './ScrollHint'
import { HeroGuide } from './HeroGuide'
import { HERO_COPY } from './constants'
import styles from './HeroHome.module.css'

export function HeroHome() {
  const guideRef = useRef<HTMLElement>(null)

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-label="徽州建筑文化可视化首页">
        <div className={styles.heroAtmosphere}>
          <HeroBackground />
          <HeroMistLayer />
          <img className={styles.ripple} src="/homepage/ripple-lines.svg" alt="" />
          <img className={styles.birds} src="/homepage/bird-duo.svg" alt="" />
          <HeroSeal />
        </div>

        <div className={styles.heroVisual}>
          <HeroTitle />
        </div>

        <div className={styles.heroBottom}>
          <HeroActions onGuideClick={scrollToGuide} />
          <ScrollHint onClick={scrollToGuide} />
        </div>

        <aside className={styles.heroMeta}>
          <p>{HERO_COPY.subtitleCn}</p>
          <p>{HERO_COPY.subtitleEn}</p>
        </aside>
      </section>

      <section ref={guideRef}>
        <HeroGuide />
      </section>
    </div>
  )
}
