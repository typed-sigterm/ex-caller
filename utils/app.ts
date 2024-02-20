import { reactive } from 'vue'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

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
export const ui = reactive({} as {
  dialog: DialogApiInjection
  message: MessageApiInjection
})
export function setupUiHooks() {
  ui.dialog = useDialog()
  ui.message = useMessage()
}

/** 弹窗显示非致命错误。 */
export function alertError(content: unknown) {
  ui.dialog.error({
    title: '错误',
    content: String(content),
    positiveText: '确定',
    positiveButtonProps: {
      type: 'primary',
    },
  })
}
