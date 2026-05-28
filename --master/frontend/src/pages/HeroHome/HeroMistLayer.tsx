import styles from './HeroHome.module.css'

export function HeroMistLayer() {
  const base = import.meta.env.BASE_URL ?? '/'
  const mist = `${base}homepage/mist-band.svg`
  return (
    <>
      <img className={`${styles.mist} ${styles.mistFar}`} src={mist} alt="" />
      <img
        className={`${styles.mist} ${styles.mistNear}`}
        src={mist}
        alt=""
      />
      <img className={`${styles.mist} ${styles.mistMiddle}`} src={mist} alt="" />
    </>
  )
}
