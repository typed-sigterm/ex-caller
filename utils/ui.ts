import { type DialogFilter, save } from '@tauri-apps/api/dialog'
import { writeFile } from '@tauri-apps/api/fs'
import { desktopDir } from '@tauri-apps/api/path'
import { promiseTimeout } from '@vueuse/core'
import JSConfetti from 'js-confetti'

export const confetti = new JSConfetti()

export function nextFrame() {
  return new Promise(
    resolve => requestAnimationFrame(resolve),
  )
}

export interface SaveFileOptions {
  defaultPath?: string
  filters?: DialogFilter[]
}
/**
 * 保存文件。
 * @returns 是否保存成功
 */
export async function saveFile(filename: string, content: string, options: SaveFileOptions) {
  if (__ENV__ === Env.App) { // 独立 app 环境，使用 Tauri API
    const {
      defaultPath = await desktopDir() + filename, // 默认保存到桌面
      filters = [],
    } = options ?? {}
    const path = await save({
      defaultPath,
      filters: [
        ...filters,
        { name: '所有文件', extensions: ['*'] },
      ],
    })
    if (!path)
      return false
    await writeFile(path, content)
  }
  else { // 浏览器环境，利用 a 标签
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const el = document.createElement('a')
    el.href = url
    el.download = filename
    el.click()
    URL.revokeObjectURL(url)
    await promiseTimeout(1000) /// 1s 等待开始下载
    return true
  }
}
