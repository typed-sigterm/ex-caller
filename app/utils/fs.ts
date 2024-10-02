import type { DialogFilter } from '@tauri-apps/plugin-dialog';
import type { BaseDirectory } from '@tauri-apps/plugin-fs';
import { desktopDir, resolve } from '@tauri-apps/api/path';
import { save } from '@tauri-apps/plugin-dialog';
import {
  exists,
  mkdir,
  readFile,
  remove,
  writeFile,
} from '@tauri-apps/plugin-fs';
import { promiseTimeout } from '@vueuse/core';

export interface SaveFileOptions {
  defaultPath?: string
  filters?: DialogFilter[]
}
/**
 * 保存文件。
 * @returns 是否保存成功
 */
export async function saveFile(
  filename: string,
  content: string,
  options?: SaveFileOptions,
) {
  if (__APP__) { // 独立 app 环境，使用 Tauri API
    const {
      defaultPath = await resolve(await desktopDir(), filename), // 默认保存到桌面
      filters = [],
    } = options ?? {};
    const path = await save({
      defaultPath,
      filters: [
        ...filters,
        { name: '所有文件', extensions: ['*'] },
      ],
    });
    if (!path)
      return false;
    const encoder = new TextEncoder();
    await writeFile(path, encoder.encode(content));
  } else { // 浏览器环境，利用 a 标签
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url;
    el.download = filename;
    el.click();
    URL.revokeObjectURL(url);
    await promiseTimeout(1000); // 1s 等待开始下载
    return true;
  }
}

/** 递归创建目录 */
export async function tryMkdirRecursive(path: string, baseDir: BaseDirectory) {
  if (!__APP__)
    throw createNotInAppError();

  let current = '';
  let created = false;
  if (!await exists('./', { baseDir })) // 先保证根目录存在
    await mkdir('./', { baseDir });
  for (const part of path.split('/')) {
    current += part;
    if (created || !await exists(current, { baseDir })) {
      created = true;
      await mkdir(current, { baseDir });
    }
  }
}

interface LoadLocalFileOptions {
  /**
   * 文件 MIME Type
   * @default 'application/octet-stream'
   */
  type?: string
}

export interface LoadedLocalFile {
  blob: Blob
  /** {@link blob} url */
  url: string
  /** 销毁 {@link blob} 对象，释放内存 */
  revoke: () => void
  /** 删除本地文件 */
  rm: () => Promise<void>
}

/** 读取本地文件，生成 Blob 对象。 */
export async function loadLocalFile(
  path: string,
  baseDir: BaseDirectory,
  options?: LoadLocalFileOptions,
): Promise<LoadedLocalFile | undefined> {
  if (!__APP__)
    throw createNotInAppError();
  if (!await exists(path, { baseDir }))
    return;

  const blob = new Blob(
    [await readFile(path, { baseDir })],
    { type: options?.type ?? DEFAULT_MIME_TYPE },
  );
  const url = URL.createObjectURL(blob);
  const revoke = () => URL.revokeObjectURL(url);
  const rm = () => remove(path, { baseDir });

  return { blob, url, revoke, rm };
}
