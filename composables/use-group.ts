const cache = new Map<string, Ref<RollCallOption[]>>()
export const resetGroupCache = () => cache.clear()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!
  const ret = ref(hasGroup(name) ? getGroup(name) : [])
  watchImmediate(ret, v => setGroup(name, v))
  cache.set(name, ret)
  return ret
}

bus.on('group:remove', (name) => {
  if (cache.has(name))
    cache.get(name)!.value = []
  cache.delete(name)
})
