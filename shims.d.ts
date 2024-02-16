import type { Env } from '~/utils/app'

declare global {
  /** 当前运行环境。 */
  declare const __ENV__: Env
}
