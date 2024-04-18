import { BaseDirectory, writeFile } from '@tauri-apps/plugin-fs'
import type { LoadLocalFileResult } from '~/utils/fs'

const RESOURCE = ['background'] as const
export type ResourceName = typeof RESOURCE extends readonly (infer T)[] ? T : never

function getThemeResource(name: ResourceName) {
  return loadLocalFile(`theme/${name}`, BaseDirectory.AppData)
}

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      background: undefined as LoadLocalFileResult,
    }
  },

  actions: {
    /**
     * 刷新资源信息。
     * @param names 资源名称列表，不传则刷新全部资源
     */
    async refresh(names?: ResourceName[]) {
      await Promise.all((names ?? RESOURCE).map(async (name) => {
        this.$patch({
          [name]: await getThemeResource(name),
        })
      }))
    },

    /**
     * 更新或删除资源。
     * @param name 资源名称
     * @param data 资源数据，不传则删除资源
     */
    async setResource(name: ResourceName, data?: Uint8Array | File) {
      if (data instanceof File)
        data = new Uint8Array(await data.arrayBuffer())

      // 如果有旧资源，先释放
      const old = this[name]
      if (old) {
        old.revoke()
        await old.rm().catch(() => 0) // 删除文件，忽略失败
      }

      // 加载新资源
      if (data)
        await writeFile('theme/background', data, { baseDir: BaseDirectory.AppData })
      this.refresh([name])
    },
  },
})
