import type { BaseDirectory } from '@tauri-apps/plugin-fs'
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

export default async <T = any>(initial: T, path: string, baseDir: BaseDirectory) => {
  const ret = ref(initial)
  const write = (content: any) => {
    return writeTextFile(path, JSON.stringify(content), { baseDir })
  }

  try {
    ret.value = JSON.parse(await readTextFile(path, { baseDir }))
  }
  catch (e) {
    await write(initial)
  }

  watchDeep(ret, v => write(v))

  return ret
}
