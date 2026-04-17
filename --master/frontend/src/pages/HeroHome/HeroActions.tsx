import { Link } from 'react-router-dom'
import { HERO_COPY } from './constants'
import styles from './HeroHome.module.css'

type HeroActionsProps = {
  onGuideClick: () => void
}

export function HeroActions({ onGuideClick }: HeroActionsProps) {
  return (
    <div className={styles.actionsGroup}>
      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={onGuideClick}>
          {HERO_COPY.primaryAction}
        </button>
        <Link to="/module1" className={styles.secondaryBtn}>
          {HERO_COPY.secondaryAction}
        </Link>
      </div>
    </div>
  )
}
