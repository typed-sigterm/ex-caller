import { BaseDirectory } from '@tauri-apps/plugin-fs'

export const RESOURCES = ['background', 'backgroundRolling'] as const
export type ResourceName = typeof RESOURCES extends readonly (infer T)[] ? T : never

export function getThemeResource(name: ResourceName) {
  return loadLocalFile(`theme/${name}`, BaseDirectory.AppData, {
    type: useThemeStore().properties.backgroundRolling.mimeType,
  })
}
