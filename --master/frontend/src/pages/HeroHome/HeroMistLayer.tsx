import styles from './HeroHome.module.css'

export function HeroMistLayer() {
  return (
    <>
      <img className={`${styles.mist} ${styles.mistFar}`} src="/homepage/mist-band.svg" alt="" />
      <img
        className={`${styles.mist} ${styles.mistNear}`}
        src="/homepage/mist-band.svg"
        alt=""
      />
      <img className={`${styles.mist} ${styles.mistMiddle}`} src="/homepage/mist-band.svg" alt="" />
    </>
  )
}
