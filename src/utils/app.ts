import type { BuildMeta } from '../../meta';
import { invoke, isTauri } from '@tauri-apps/api/core';
import { resolveResource } from '@tauri-apps/api/path';
import { BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { version } from '../../src-tauri/tauri.conf.json';
import { PORTABLE_DATA_FILE } from '@/utils/config';
import { getGlobalI18n } from './ui';

export const GITHUB_REPO_URL = 'https://github.com/typed-sigterm/ex-caller';
export const GITHUB_RELEASE_API_URL = 'https://api.github.com/repos/typed-sigterm/ex-caller/releases/latest';
export const WEB_APP_URL = 'https://ex-caller.by-ts.top';
export const GITEE_REPO_URL = 'https://gitee.com/typed-sigterm/ex-caller';

/** 是否正式生产环境 */
export const __GA__ = import.meta.env.PROD && !import.meta.env.EXC_CANARY;
/** 是否 Canary 生产环境 */
export const __CANARY__ = import.meta.env.EXC_CANARY;
/** 是否开发环境 */
export const __DEV__ = !import.meta.env.PROD;

export function getBuildMeta(): BuildMeta {
  return JSON.parse(document.getElementById('ex-caller')!.innerHTML);
}

export const VERSION = __GA__
  ? `v${version}` // 正式版本显示版本号
  : __CANARY__
    ? getBuildMeta().commit ?? 'Canary'
    : 'DEV'; // 开发版本显示 DEV

/** 是否独立 App 环境 */
export const __APP__ = !import.meta.env.EXC_NO_APP && isTauri();

let _isPortable: boolean | undefined;
export async function isPortable() {
  if (!__APP__) // tree-shake
    return false;
  if (_isPortable !== undefined)
    return _isPortable;
  return _isPortable = !__DEV__ && !await exists('./installed', {
    baseDir: BaseDirectory.Resource,
  });
}

export const createNotInAppError = () => new Error('Please download the app to experience this feature.');

export const DEFAULT_LANG = 'en';

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
