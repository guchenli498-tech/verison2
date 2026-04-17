import { HERO_COPY } from './constants'
import styles from './HeroHome.module.css'

type ScrollHintProps = {
  onClick: () => void
}

export function ScrollHint({ onClick }: ScrollHintProps) {
  return (
    <button type="button" className={styles.scrollHint} onClick={onClick} aria-label="向下探索">
      <img src="/homepage/scroll-hint.svg" alt="" aria-hidden="true" />
      <span>{HERO_COPY.scrollHint}</span>
    </button>
  )
}
