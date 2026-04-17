import { Link } from 'react-router-dom'
import { GUIDE_CHAPTERS } from './constants'
import styles from './HeroHome.module.css'

export function HeroGuide() {
  return (
    <section className={styles.guideSection} aria-label="项目导览">
      <div className={styles.guideInner}>
        <header className={styles.guideHeader}>
          <p>展卷目录</p>
          <h2>三章总览：读懂徽州建筑</h2>
          <p className={styles.guideLead}>
            以聚落为起笔，以构筑为展开，以匠艺与叙事收束，形成完整的数字展卷路径。
          </p>
        </header>

        <ol className={styles.guideTimeline}>
          {GUIDE_CHAPTERS.map((chapter) => (
            <li key={chapter.id} className={styles.guideChapter}>
              <div className={styles.guideCue}>{chapter.cue}</div>
              <div className={styles.guideBody}>
                <h3>{chapter.title}</h3>
                <p>{chapter.summary}</p>
                <ul className={styles.guideFocus}>
                  {chapter.focuses.map((focus) => (
                    <li key={focus.label}>
                      <Link to={focus.to} className={styles.guideFocusItem}>
                        {focus.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={chapter.to} className={styles.guideEntry}>
                进入{chapter.cue}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
