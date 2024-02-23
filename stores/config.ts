import { UserConfigSchema } from '~/utils/config'
import { addGroup } from '~/utils/group'

export const useConfigStore = defineStore('config', {
  state: () => {
    const ret = useLocalStorage<UserConfig>('config', UserConfigSchema.parse({}))
    if (!hasGroup(ret.value.group)) // 处理名单不存在的情况
      addGroup(ret.value.group)
    ret.value = UserConfigSchema.parse(ret.value)
    return ret
  },
})
