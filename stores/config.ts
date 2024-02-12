import { UserConfigSchema } from '~/utils/config'

export const useConfigStore = defineStore('config', {
  state: () => {
    const ret = useLocalStorage<UserConfig>('config', UserConfigSchema.parse({}))
    useGroup(ret.value.group) // 处理名单不存在的情况
    ret.value = UserConfigSchema.parse(ret.value)
    return ret
  },
})
