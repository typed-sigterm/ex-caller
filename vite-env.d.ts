/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 当前 commit SHA */
  readonly COMMIT_REF?: string
  /** 是否发布到先遣环境 */
  readonly EXC_CANARY?: string
  /** 是否移除独立 App 环境相关代码 */
  readonly EXC_NO_APP: string
  /** Mixpanel 项目 token */
  readonly EXC_MIXPANEL_TOKEN: string
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue';

  const Component: ComponentOptions;
  export default Component;
}
