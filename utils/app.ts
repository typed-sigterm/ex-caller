import { reactive } from 'vue'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import { isTauri } from '@tauri-apps/api/core'
import { version } from '~/package.json'

const commit: string | undefined = import.meta.env.COMMIT_REF
export const VERSION = import.meta.env.DEV
  ? 'Dev'
  : import.meta.env.EXC_CANARY
    ? (commit ? commit.slice(0, 7) : 'Canary')
    : `v${version}`

/** 是否独立 App 环境 */
export const IN_APP = !import.meta.env.EXC_NO_APP && isTauri()

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

export const createNotInAppError = () => createError('浏览器端暂不支持此功能，请下载 App 体验')

export const DEFAULT_MIME_TYPE = 'application/octet-stream'
