/** Cubism Core 静态资源 URL（与 vite base 一致，避免 /verison2 重复或缺失） */
export function getCubismCoreUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return new URL('lib/live2dcubismcore.min.js', `${origin}${base}`).href
}

export function loadCubismCore(): Promise<void> {
  if (typeof window !== 'undefined' && window.Live2DCubismCore) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const url = getCubismCoreUrl()

    const broken = document.querySelector('script[data-cubism-core]')
    if (broken && !window.Live2DCubismCore) {
      broken.remove()
    }

    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) {
      if (window.Live2DCubismCore) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Cubism Core 加载失败: ${url}`)), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.async = false
    script.dataset.cubismCore = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Cubism Core 加载失败: ${url}`))
    document.head.appendChild(script)
  })
}
