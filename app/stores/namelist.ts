/**
 * 创建名单。
 *
 * 对名单的更改会自动持久化。
 * @returns 名单名称；名单对象；删除名单时需调用的清理函数
 */
function createNamelist(name: string, options: RollCallOption[]) {
  const namelist = ref(options);
  const stop = watchImmediate(namelist, (v) => { // 持久化，立即执行是为了初始化
    setStoredNamelist(name, v);
  });
  const cleanup = () => {
    stop();
    namelist.value = [];
    removeStoredNamelist(name);
  };
  return [name, namelist, cleanup] as const;
}

export const useNamelistStore = defineStore('namelist', {
  state: () => {
    const data = [];
    for (const name of getStoredNamelists())
      data.push(createNamelist(name, getStoredNamelist(name)));
    return { data };
  },
  getters: {
    /** 名单列表 */
    namelist(state) {
      return state.data.map(v => v[0]);
    },
  },
  actions: {
    /**
     * 添加名单。
     * @param name 名单名称，不填则自动生成
     * @param options 名单内容，不填则使用默认值
     * @returns 名单对象
     */
    add(
      name: string = generateNewNamelistName(),
      options: RollCallOption[] = structuredClone(DEFAULT_NAMELIST_OPTIONS),
    ) {
      const namelist = createNamelist(name, options);
      this.data.push(namelist);
      return namelist[1]; // .namelist
    },
    remove(name: string) {
      const index = this.data.findIndex(v => v[0] === name);
      if (index === -1)
        throw new Error(`Cannot find namelist "${name}"`);
      this.data[index]![2](); // .cleanup
      this.data.splice(index, 1);
    },
    has(name: string) {
      return this.namelist.includes(name);
    },
    rename(from: string, to: string) {
      this.add(to, getStoredNamelist(from));
      this.remove(from);
    },
  },
});
