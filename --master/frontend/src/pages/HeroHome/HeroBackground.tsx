import styles from './HeroHome.module.css'

export function HeroBackground() {
  const base = import.meta.env.BASE_URL ?? '/'
  return (
    <>
      <img
        className={styles.baseImage}
        src={`${base}homepage/hero-bg.png`}
        alt="徽州建筑与山水画卷"
      />
      <div className={styles.overlaySoftLight} />
      <div className={styles.paperTexture} />
    </>
  )
}
