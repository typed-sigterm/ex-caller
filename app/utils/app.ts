import { reactive } from 'vue';
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { isTauri } from '@tauri-apps/api/core';
import { version } from '~~/package.json';

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
  const { t } = useI18n();
  ui.dialog.error({
    title: t('error'),
    content: String(content),
    positiveText: t('confirm'),
    positiveButtonProps: {
      type: 'primary',
    },
  });
}

export const createNotInAppError = () => createError('Please download the app to experience this feature.');

export const DEFAULT_LANG = 'en';

export function switchLanguage(i18n: ReturnType<typeof useI18n>, lang: string) {
  if (i18n.locale.value !== lang)
    i18n.setLocale(lang);
  useHead({
    htmlAttrs: { lang },
  });
}

export const DEFAULT_MIME_TYPE = 'application/octet-stream';
