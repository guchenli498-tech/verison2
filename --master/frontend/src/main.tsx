import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loadCubismCore } from './components/assistant/loadCubismCore'
import { setupPixiLive2d } from './components/assistant/setupPixi'
import './index.css'
import App from './App.tsx'

async function bootstrap() {
  try {
    await loadCubismCore()
    setupPixiLive2d()
    console.info('[bootstrap] Cubism Core 已就绪:', window.Live2DCubismCore ? 'yes' : 'no')
  } catch (error) {
    console.error('[bootstrap] Cubism Core 加载失败，请确认访问地址含 /verison2/', error)
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
