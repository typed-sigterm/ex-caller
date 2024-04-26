import { BaseDirectory } from '@tauri-apps/plugin-fs'

export const RESOURCES = ['background'] as const
export type ResourceName = typeof RESOURCES extends readonly (infer T)[] ? T : never

export function getThemeResource(name: ResourceName) {
  return loadLocalFile(`theme/${name}`, BaseDirectory.AppData)
}
