import styles from './HeroHome.module.css'

export function HeroSeal() {
  const base = import.meta.env.BASE_URL ?? '/'
  return <img className={styles.seal} src={`${base}homepage/seal-frame.svg`} alt="印章装饰" />
}
