<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { SettingsGroupName } from '#components'

defineEmits<{
  /** 切换名单。 */
  (ev: 'switchGroup'): void
}>()

const config = useConfigStore()
const groups = ref<SelectOption[]>([])
function refreshGroups() {
  groups.value = getGroups().sort().map(v => ({
    label: v,
    value: v,
    class: 'group-name-item',
  }))
}
refreshGroups()

const names = computed(() => useGroup(config.group).value)
const shownNames = ref<RollCallOption[]>([])
watchImmediate(names, async () => {
  const legacy = shownNames.value
  const origin = names.value
  const len = origin.length
  for (let i = 0; i < len; ++i) {
    if (origin[i] !== legacy[i]) // 增量更新
      await processNamesChunk(i)
  }
})
function processNamesChunk(offset: number) {
  return new Promise((resolve) => {
    shownNames.value[offset] = names.value[offset]
    requestAnimationFrame(resolve)
  })
}

function renderGroupName(options: SelectOption): VNodeChild {
  return h(SettingsGroupName, {
    ...options,
    // 处理事件，需要下一帧才会真正操作 localStorage
    onRename: () => nextTick(refreshGroups),
    onDelete: () => nextTick(refreshGroups),
  })
}

function handleNewGroup() {
  useGroup(generateNewGroupName())
  refreshGroups()
}

function handleUpdate() {
  useGroup(config.group).value = shownNames.value
}
</script>

<template>
  <NFormItem label="名单" label-placement="left">
    <NSelect
      v-model:value="config.group"
      class="group-selector"
      :options="groups"
      :render-label="renderGroupName"
      @update:value="$emit('switchGroup')"
    />
    <NButton class="ml-1" @click="handleNewGroup">
      新建名单
      <template #icon>
        <NaiveIcon name="ep:plus" :size="16" />
      </template>
    </NButton>
  </NFormItem>
  <NDynamicInput
    v-model:value="shownNames"
    class="mb-5"
    :min="2"
    show-sort-button
    @update:value="handleUpdate"
  />
  <SettingsGroupOperations v-model:names="names" :group="config.group" />
</template>

<style lang="postcss" scoped>
.group-selector :deep(.operator) {
  @apply hidden;
}
</style>

<style lang="postcss">
.group-name-item {
  &.n-base-select-option--selected .operator-delete {
    @apply hidden;
  }
  .n-base-select-option__content {
    @apply w-full !important;
  }
}
</style>
