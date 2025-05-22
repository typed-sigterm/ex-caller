import type { RollCallOption } from '@/utils/roll-call';
import type { Reactive, Ref } from 'vue';
import { DEFAULT_NAMELIST_OPTIONS } from '@/utils/config';
import { getGroup, listGroups, removeGroup, setGroup } from '@/utils/group';
import { genNewNamelistName, getNamelist, listNamelists, removeNamelist, setNamelist } from '@/utils/namelist';
import { rollCallOptionToString } from '@/utils/roll-call';
import { getGlobalI18n } from '@/utils/ui';
import { Sha256 } from '@aws-crypto/sha256-browser';
import { watchImmediate } from '@vueuse/core';
import { defineStore } from 'pinia';
import { reactive, ref, toRaw, toRef, watch } from 'vue';

function toHex(array: Uint8Array) {
  return Array.from(array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

type GroupData = Record<string, string[]>;

interface NamelistData {
  names: RollCallOption[]
  groups: {
    /** @returns 新分组名称 */
    add: (name?: string, options?: string[]) => string
    remove: (name: string) => void
    has: (name: string) => boolean
    rename: (from: string, to: string) => void
    genName: () => string
    list: () => string[]
    use: (name: string) => Ref<string[]>
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
  namelist: string,
  initialOptions: RollCallOption[],
  initialGroups: GroupData,
): Reactive<NamelistData> {
  const names = ref(initialOptions);
  const groups = ref(initialGroups);

  const use = (group: string) => toRef(groups.value, group);

  const genName = () => {
    const { t } = getGlobalI18n();
    const keys = listGroups(namelist);
    let ret = '';
    let index = keys.length;
    do { // 避免与现有分组冲突
      ++index;
      ret = t('group-n', [index]);
    } while (keys.includes(ret));
    return ret;
  };

  const add = (group?: string, options?: string[]) => {
    group ??= genName();
    options ??= [rollCallOptionToString(names.value[0])];
    groups.value[group] = options;
    return group;
  };

  const remove = (group: string) => {
    removeGroup(namelist, group);
    delete groups.value[group];
  };
  const has = (group: string) => group in groups.value;
  const list = () => Object.keys(groups.value);

  const rename = (from: string, to: string) => {
    add(to, getGroup(namelist, from));
    remove(from);
  };

  const stop1 = watchImmediate(names, (names) => { // 持久化，立即执行是为了初始化
    setNamelist(namelist, names);
  });

  // TODO: perf
  const stop2 = watch(groups, (groups) => {
    for (const name in groups) {
      // 如果导入了名单中没有的名字，一并加入名单
      for (const n of groups[name]) {
        if (!names.value.includes(n))
          names.value.push(n);
      }
      setGroup(namelist, name, groups[name]);
    }
  }, { deep: true, immediate: true });

  return reactive({
    names,
    groups: { add, remove, has, rename, genName, use, list },
    cleanup: () => {
      stop1();
      stop2();
      names.value = [];
      removeNamelist(namelist);
    },
  });
}

export const useNamelistStore = defineStore('namelist', {
  state: () => {
    const data = reactive<Record<string, Reactive<NamelistData>>>({});
    for (const name of listNamelists()) {
      const groups: GroupData = {};
      for (const g of listGroups(name))
        groups[name] = getGroup(name, g);
      data[name] = createNamelist(name, getNamelist(name), groups);
    }
    return { data };
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

    list() {
      return Object.keys(this.data);
    },

    rename(from: string, to: string) {
      this.add(to, getNamelist(from));
      this.remove(from);
    },

    genName() {
      const { t } = getGlobalI18n();
      const keys = listNamelists();
      let ret = '';
      let index = keys.length;
      do { // 避免与现有名单冲突
        ++index;
        ret = t('namelist-n', [index]);
      } while (keys.includes(ret));
      return ret;
    },

    async calcChecksum(name: string) {
      const s = new Sha256();
      s.update(JSON.stringify(toRaw(this.data[name].names)));
      return toHex(await s.digest());
    },
  },
});
