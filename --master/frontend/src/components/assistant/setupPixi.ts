import * as PIXI from 'pixi.js'

let ready = false

/** pixi-live2d-display 依赖全局 PIXI */
export function setupPixiLive2d() {
  if (ready) return
  // @ts-expect-error pixi-live2d-display 需要
  window.PIXI = PIXI
  ready = true
}
