/**
 * 创建名单。
 *
 * 对名单的更改会自动持久化。
 * @returns 名单名称；名单对象；删除名单时需调用的清理函数
 */
function createGroup(name: string, options?: RollCallOption[]) {
  const group = ref(options ?? structuredClone(DEFAULT_GROUP_OPTIONS));
  const stop = watchImmediate(group, (v) => { // 持久化，立即执行是为了初始化
    setStoredGroup(name, v);
  });
  const cleanup = () => {
    stop();
    group.value = [];
    removeStoredGroup(name);
  };
  return [name, group, cleanup] as const;
}

export const useGroupStore = defineStore('group', {
  state: () => {
    const data = [];
    for (const name of getStoredGroups())
      data.push(createGroup(name, getStoredGroup(name)));
    return { data };
  },
  getters: {
    /** 名单列表 */
    nameList(state) {
      return state.data.map(v => v[0]);
    },
  },
  actions: {
    /**
     * 添加名单。
     * @param name 名单名称，不填则自动生成
     * @returns 名单对象
     */
    add(name: string = generateNewGroupName(), options?: RollCallOption[]) {
      const group = createGroup(name, options);
      this.data.push(group);
      return group[1]; // .group
    },
    remove(name: string) {
      const index = this.data.findIndex(v => v[0] === name);
      if (index === -1)
        throw new Error(`Cannot find group "${name}"`);
      this.data[index][2](); // .cleanup
      this.data.splice(index, 1);
    },
    has(name: string) {
      return this.nameList.includes(name);
    },
    rename(from: string, to: string) {
      this.add(to, getStoredGroup(from));
      this.remove(from);
    },
  },
});
