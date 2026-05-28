import { Outlet } from 'react-router-dom'
import { AssistantErrorBoundary } from '../../components/assistant/AssistantErrorBoundary'
import { GuideRobotTrigger } from '../../components/assistant/GuideRobotTrigger'
import { HuiGuideAssistant } from '../../components/assistant/HuiGuideAssistant'
import { TopNav } from '../../components/common/TopNav/TopNav'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.page}>
      <TopNav />
      <AssistantErrorBoundary>
        <GuideRobotTrigger />
      </AssistantErrorBoundary>
      <HuiGuideAssistant />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
