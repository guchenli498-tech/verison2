import { NavLink } from 'react-router-dom'
import { appTheme } from '../../../theme/tokens'
import styles from './TopNav.module.css'

type TopNavItem = {
  to: string
  label: string
}

const items: TopNavItem[] = [
  { to: '/module1', label: '徽韵千年' },
  { to: '/module2', label: '构筑万象' },
  { to: '/module3', label: '匠艺流芳' },
]

export function TopNav() {
  return (
    <header className={styles.header} style={{ background: appTheme.navBg }}>
      <div className={styles.inner}>
        <nav className={styles.nav} aria-label="模块导航">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.home} ${isActive ? styles.homeActive : ''}`
            }
            aria-label="返回首页"
            title="主页"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </NavLink>
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.rightSpacer} />
      </div>
    </header>
  )
}

