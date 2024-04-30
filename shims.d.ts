declare global {
  /** 当前版本号 */
  declare const __VERSION__: string
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'

  const Component: ComponentOptions
  export default Component
}

export {}
