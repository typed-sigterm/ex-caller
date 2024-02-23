import type { RemovableRef } from '@vueuse/core'

const cache = new Map<string, RemovableRef<RollCallOption[]>>()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!

  if (!hasGroup(name))
    addGroup(name)
  const ret = useLocalStorage<RollCallOption[]>(
    getGroupKey(name),
    [],
    { flush: 'sync' },
  )
  cache.set(name, ret)

  return ret
}

export const clearGroupCache = () => cache.clear()
