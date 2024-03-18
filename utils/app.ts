import { reactive } from 'vue'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

// 在 `nuxt.config.ts` 中通过 `vite.define` 选项实现值替换与 tree-shake
// 不能直接用 `const enum`，因为有时候会用到 `Env[...]`
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
