import type { LoadedLocalFile } from '@/utils/fs';
import type { ResourceName } from '@/utils/theme';
import { DEFAULT_MIME_TYPE } from '@/utils/app';
import { getDataDir, useJsonFile } from '@/utils/fs';
import { getThemeResource, RESOURCES } from '@/utils/theme';
import { BaseDirectory, mkdir, writeFile } from '@tauri-apps/plugin-fs';
import { watchDeep } from '@vueuse/core';
import { defineStore } from 'pinia';

export const THEME_DEFAULT_PROPERTIES = {
  backgroundRolling: {
    originalName: '',
    mimeType: DEFAULT_MIME_TYPE,
  },
};

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      properties: structuredClone(THEME_DEFAULT_PROPERTIES),
      background: undefined as LoadedLocalFile | undefined,
      backgroundRolling: undefined as LoadedLocalFile | undefined,
    };
  },

  actions: {
    /** 初始化。 */
    async init() {
      await mkdir('theme', {
        baseDir: BaseDirectory.Data,
        recursive: true,
      });

      // store 内修改同步到本地文件
      const localProps = await useJsonFile(
        this.properties,
        'theme/properties.json',
        await getDataDir(),
      );
      this.properties = localProps.value;
      watchDeep(() => this.properties, v => localProps.value = v);

      await this.refresh();
    },

    /**
     * 刷新资源信息。
     * @param names 资源名称列表，不传则刷新全部资源
     */
    async refresh(names?: ResourceName[]) {
      const resources: Array<[string, LoadedLocalFile | undefined]> = [];
      await Promise.all((names ?? RESOURCES).map(async (name) => {
        resources.push([name, await getThemeResource(name)]);
      }));
      this.$patch(Object.fromEntries(resources));
    },

    /**
     * 更新或删除资源。
     * @param name 资源名称
     * @param data 资源数据，不传则删除资源
     */
    async setResource(name: ResourceName, data?: Uint8Array | File) {
      if (data instanceof File)
        data = new Uint8Array(await data.arrayBuffer());

      // 如果有旧资源，先释放
      const old = this[name];
      if (old) {
        old.revoke();
        await old.rm().catch(() => {}); // 删除文件，忽略失败
      }

      // 加载新资源
      if (data) {
        await writeFile(
          `theme/${name}`,
          data,
          { baseDir: await getDataDir() },
        );
      }
      await this.refresh([name]);
    },
  },
});
