const groupList = ref<string[]>([])

export function refreshGroupList() {
  groupList.value = getGroups()
}
// 在 App.vue 中初始化

export default () => groupList
