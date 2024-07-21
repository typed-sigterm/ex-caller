import { reactive } from 'vue';
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { isTauri } from '@tauri-apps/api/core';
import { version } from '~/package.json';

export const GITHUB_REPO_URL = 'https://github.com/typed-sigterm/ex-caller';

/** 是否正式生产环境 */
export const __GA__ = import.meta.env.PROD && !import.meta.env.EXC_CANARY;
/** 是否 Canary 生产环境 */
export const __CANARY__ = import.meta.env.EXC_CANARY;
/** 是否开发环境 */
export const __DEV__ = !import.meta.env.PROD;

const commit = import.meta.env.COMMIT_REF ?? '0000000';
export const VERSION = __GA__
  ? `v${version}` // 正式版本显示版本号
  : __CANARY__
    ? commit.slice(0, 7) // Canary 版本显示 commit id
    : 'DEV'; // 开发版本显示 DEV

/** 是否独立 App 环境 */
export const __APP__ = !import.meta.env.EXC_NO_APP && isTauri();

export const ui = reactive({} as {
  dialog: DialogApiInjection
  message: MessageApiInjection
});
export function setupUiHooks() {
  ui.dialog = useDialog();
  ui.message = useMessage();
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
  });
}

export const createNotInAppError = () => createError('浏览器端暂不支持此功能，请下载 App 体验');

export const DEFAULT_MIME_TYPE = 'application/octet-stream';
