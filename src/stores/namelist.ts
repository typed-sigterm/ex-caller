import { rollCallOptionToString, type RollCallOption } from '@/utils/roll-call';
import type { Reactive, Ref } from 'vue';
import { DEFAULT_NAMELIST_OPTIONS } from '@/utils/config';
import { genNewNamelistName, getNamelist, listNamelists, removeNamelist, setNamelist } from '@/utils/namelist';
import { toReactive, watchImmediate } from '@vueuse/core';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getGroup, listGroups } from '@/utils/group';

type GroupData = Record<string, string[]>;

interface NamelistData {
  names: RollCallOption[]
  groups: {
    add: (name: string, options?: string[]) => void
    remove: (name: string) => void
    has: (name: string) => boolean
    rename: (from: string, to: string) => void
  }
  cleanup: () => void
}

/**
 * 创建名单。
 *
 * 对名单的更改会自动持久化。
 * @returns 名单名称；名单对象；删除名单时需调用的清理函数
 */
function createNamelist(
  name: string,
  initialOptions: RollCallOption[],
  initialGroups: GroupData,
): Reactive<NamelistData> {
  const names = ref(initialOptions);
  const groups = ref(initialGroups);

  const add = (name: string, options?: string[]) => {
    options ??= [rollCallOptionToString(names.value[0])];
    groups.value[name] = options;
  }

  const remove = (name: string) => delete groups.value[name];
  const has = (name: string) => name in groups;

  const rename = (from: string, to: string) => {
    add(to, getGroup(name, from));
    remove(from);
  };

  const stop = watchImmediate(names, (v) => { // 持久化，立即执行是为了初始化
    setNamelist(name, v);
  });

  return reactive({
    names,
    groups: { add, remove, has, rename },
    cleanup: () => {
      stop();
      names.value = [];
      removeNamelist(name);
    },
  });
}

export const useNamelistStore = defineStore('namelist', {
  state: () => {
    const data = reactive<Record<string, Reactive<NamelistData>>>({});
    for (const name of listNamelists()) {
      const groups: GroupData  = {};
      for (const g of listGroups(name))
        groups[name] = getGroup(name, g);
      data[name] = createNamelist(name, getNamelist(name), groups);
    }
    return { data };
  },

  getters: {
    /** 名单列表 */
    list: state => Object.keys(state.data),
  },

  actions: {
    use(name: string) {
      return this.data[name];
    },

    /**
     * 添加名单。
     * @param name 名单名称，不填则自动生成
     * @param options 名单内容，不填则使用默认值
     * @returns 名单对象
     */
    add(
      name: string = genNewNamelistName(),
      options: RollCallOption[] = structuredClone(DEFAULT_NAMELIST_OPTIONS),
    ) {
      return this.data[name] = createNamelist(name, options, {});
    },

    remove(name: string) {
      if (!this.has(name))
        throw new Error(`Namelist "${name}" does not exist.`);
      this.data[name].cleanup();
      delete this.data[name];
    },

    has(name: string) {
      return name in this.data;
    },

    rename(from: string, to: string) {
      this.add(to, getNamelist(from));
      this.remove(from);
    },
  },
});
