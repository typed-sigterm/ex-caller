import type {
  DialogApiInjection,
} from 'naive-ui/es/dialog/src/DialogProvider';
import type {
  MessageApiInjection,
} from 'naive-ui/es/message/src/MessageProvider';
import { invoke, isTauri } from '@tauri-apps/api/core';
import { resolveResource } from '@tauri-apps/api/path';
import { BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { reactive } from 'vue';
import { version } from '~~/src-tauri/tauri.conf.json';

export const GITHUB_REPO_URL = 'https://github.com/typed-sigterm/ex-caller';
export const GITHUB_RELEASE_API_URL = 'https://api.github.com/repos/typed-sigterm/ex-caller/releases/latest';
export const WEB_APP_URL = 'https://ex-caller.by-ts.top';

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

let _isPortable: boolean | undefined;
export async function isPortable() {
  if (_isPortable !== undefined)
    return _isPortable;
  return _isPortable = !__DEV__ && !await exists('installed', {
    baseDir: BaseDirectory.Resource,
  });
}

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

export function createNotInAppError() {
  return createError('Please download the app to experience this feature.');
}

export const DEFAULT_LANG = 'en';

export function switchLanguage(i18n: ReturnType<typeof useI18n>, lang: string) {
  if (i18n.locale.value !== lang)
    i18n.setLocale(lang);
  useHead({
    htmlAttrs: { lang },
  });
}

export const DEFAULT_MIME_TYPE = 'application/octet-stream';

export async function readPortableData() {
  return JSON.parse(await invoke('read_file', {
    path: await resolveResource(PORTABLE_DATA_FILE),
  }) || '{}');
}
export async function writePortableData(data: unknown) {
  return invoke<void>('write_file', {
    path: await resolveResource(PORTABLE_DATA_FILE),
    content: JSON.stringify(data),
  });
}
