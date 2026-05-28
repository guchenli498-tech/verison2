import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

/** 避免 Live2D 初始化失败导致整页白屏 */
export class AssistantErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AssistantErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
