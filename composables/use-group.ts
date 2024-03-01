import { fixGroup } from '~/utils/group'

const cache = new Map<string, Ref<RollCallOption[]>>()

export default (name: string) => {
  if (cache.has(name))
    return cache.get(name)!
  fixGroup(name)
  const ret = ref(getGroup(name))
  cache.set(name, ret)
  return ret
}

bus.on('group:remove', (name) => {
  if (cache.has(name))
    cache.get(name)!.value = []
  cache.delete(name)
})
