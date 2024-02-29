import type { RemovableRef } from '@vueuse/core'
import { fixGroup } from '~/utils/group'

const cache = new Map<string, RemovableRef<RollCallOption[]>>()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!

  const ret = useLocalStorage<RollCallOption[]>(
    getGroupKey(name),
    [],
    { flush: 'sync' },
  )
  fixGroup(name)
  cache.set(name, ret)

  return ret
}

export const clearGroupCache = () => cache.clear()
