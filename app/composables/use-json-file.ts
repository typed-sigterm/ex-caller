import type { BaseDirectory } from '@tauri-apps/plugin-fs';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export default async <T = any>(
  initial: T,
  path: string,
  baseDir: BaseDirectory,
) => {
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
