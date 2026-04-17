import styles from './HeroHome.module.css'

export function HeroBackground() {
  return (
    <>
      <img
        className={styles.baseImage}
        src="/homepage/hero-bg.png"
        alt="徽州建筑与山水画卷"
      />
      <div className={styles.overlaySoftLight} />
      <div className={styles.paperTexture} />
    </>
  )
}
