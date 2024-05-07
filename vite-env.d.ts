/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 当前 commit SHA */
  readonly COMMIT_REF?: string
  /** 是否发布到先遣环境 */
  readonly EXC_CANARY?: string
  /** 是否移除独立 App 环境相关代码 */
  readonly EXC_NO_APP: string
}
