import { version as v } from '../package.json'

export const isDev = import.meta.env.DEV
export const isCanary = !!import.meta.env.EXC_CANARY
const commit: string | undefined = import.meta.env.COMMIT_REF

/** 当前版本号。 */
export const version = isDev
  ? 'Dev'
  : isCanary
    ? (commit ? commit.slice(0, 7) : 'Canary')
    : `v${v}`

/** 运行环境。 */
export enum Env {
  Browser,
  App,
}

/** 弹窗显示非致命错误。 */
export function alertError(message: unknown) {
  console.error(String(message))
}
