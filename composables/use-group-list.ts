const groupList = ref(getGroups())
export default () => groupList

export function refreshGroupList() {
  groupList.value = getGroups()
}

bus.on('group:add', (name) => {
  groupList.value.push(name)
  groupList.value.sort()
})
bus.on('group:remove', (name) => {
  groupList.value = groupList.value.filter(item => item !== name)
})
