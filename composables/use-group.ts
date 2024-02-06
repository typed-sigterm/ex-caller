import type { RemovableRef } from '@vueuse/core'

const cache = new Map<string, RemovableRef<RollCallOption[]>>()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!
  const options = useLocalStorage<RollCallOption[]>(getGroupKey(name), DEFAULT_GROUP_OPTIONS)
  cache.set(name, options)
  watch(options, (v) => { // 删除也要同步到缓存
    if (v == null)
      cache.delete(name)
  })
  return options
}
