import type { DialogFilter } from '@tauri-apps/plugin-dialog';
import { __APP__, createNotInAppError, DEFAULT_MIME_TYPE, isPortable, readPortableData, writePortableData } from '@/utils/app';
import { desktopDir, resolve } from '@tauri-apps/api/path';
import { save } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, exists, mkdir, readFile, readTextFile, remove, writeFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { promiseTimeout, watchDeep } from '@vueuse/core';
import { ref } from 'vue';

export async function getDataDir() {
  return await isPortable()
    ? BaseDirectory.Resource
    : BaseDirectory.AppData;
}

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

/** Portable 模式下，读取数据文件，更新到 localStorage */
export async function initPortable() {
  const fileData = await readPortableData();
  const localData = Object.fromEntries(Object.entries(localStorage));
  const keys = new Set<string>();

  for (const k of Object.keys(fileData))
    keys.add(k);
  for (const k of Object.keys(localData))
    keys.add(k);

  for (const key of keys) {
    if (key in fileData) // 同步添加/修改字段
      localStorage.setItem(key, fileData[key]);
    else // 同步删除字段
      localStorage.removeItem(key);
  }

  window.addEventListener('storage', (ev) => {
    if (ev.storageArea !== localStorage)
      return;
    writePortableData(Object.fromEntries(Object.entries(localStorage)));
  });
}

export async function useJsonFile<T = any>(
  initial: T,
  path: string,
  baseDir: BaseDirectory,
) {
  const ret = ref(initial);
  const write = (content: any) => {
    return writeTextFile(path, JSON.stringify(content), { baseDir });
  };

  if (await exists(path, { baseDir })) {
    ret.value = JSON.parse(await readTextFile(path, { baseDir }));
  } else {
    await write(initial);
  }

  watchDeep(ret, v => write(v));

  return ret;
};
