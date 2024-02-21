const cache = new Map<string, Ref<RollCallOption[] | null>>()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!

  const ret: Ref<RollCallOption[] | null> = useLocalStorage<RollCallOption[]>(
    getGroupKey(name),
    DEFAULT_GROUP_OPTIONS,
    { flush: 'sync' },
  )
  cache.set(name, ret)

  const list = useGroupList()
  watchImmediate(ret, (v) => { // 同步到列表
    if (v == null) {
      list.value = list.value.filter(v => v !== name)
    }
    else {
      if (!list.value.includes(name))
        list.value.push(name)
    }
  })

  return ret
}

export const clearGroupCache = () => cache.clear()
