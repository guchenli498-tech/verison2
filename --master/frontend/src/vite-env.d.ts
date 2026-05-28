/// <reference types="vite/client" />

interface Window {
  Live2DCubismCore?: unknown
}

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

