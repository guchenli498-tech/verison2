import { useMemo, useState } from 'react'
import { HERO_COPY, HERO_TITLE_ASSETS } from './constants'
import styles from './HeroHome.module.css'

type HeroTitleProps = {
  className?: string
  showInkWash?: boolean
}

export function HeroTitle({ className, showInkWash = true }: HeroTitleProps) {
  const [assetIndex, setAssetIndex] = useState(0)
  const titleSrc = HERO_TITLE_ASSETS[assetIndex]

  const titleClassName = useMemo(
    () => `${styles.titleWrap} ${className ?? ''}`.trim(),
    [className],
  )

  const handleError = () => {
    setAssetIndex((prev) =>
      prev < HERO_TITLE_ASSETS.length - 1 ? prev + 1 : prev,
    )
  }

  return (
    <div className={titleClassName} aria-label={HERO_COPY.titleAlt}>
      {showInkWash && (
        <img className={styles.inkWash} src="/homepage/ink-wash.svg" alt="" />
      )}
      <img
        className={styles.calligraphyTitle}
        src={titleSrc}
        alt={HERO_COPY.titleAlt}
        onError={handleError}
      />
    </div>
  )
}
