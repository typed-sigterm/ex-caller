export const useConfigStore = defineStore('config', {
  state: () => {
    const ret = useLocalStorage<UserConfig>(
      'config',
      structuredClone(DEFAULT_USER_CONFIG), // 深拷贝，防止修改 DEFAULT_USER_CONFIG
    )
    getGroupOptions(ret.value.group) // 处理名单不存在的情况
    return ret
  },
})
