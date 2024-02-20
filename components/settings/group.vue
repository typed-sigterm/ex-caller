<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { SettingsGroupName } from '#components'

const config = useConfigStore()
const names = computed({
  get: () => useGroup(config.group).value,
  set: v => useGroup(config.group).value = v,
})
/**
 * @member label 名单在列表中的索引
 * @member value 名单名称
 */
const groups = computed<SelectOption[]>(() => {
  return useGroupList().value.map((item, index) => ({
    label: index.toString(),
    value: item,
    class: 'group-name-item',
  }))
})

function renderGroupName(options: SelectOption): VNodeChild {
  // 处理事件，需要下一帧才会真正操作 localStorage
  const handleRename = (to: string) => {
    renameGroup(options.value as string, to)
  }
  const handleDelete = () => {
    useGroup(options.value as string).value = null
  }

  return (
    <SettingsGroupName
      {...options}
      onRename={handleRename}
      onDelete={handleDelete}
    />
  )
}

function handleNewGroup() {
  useGroup(generateNewGroupName())
}
</script>

<template>
  <NFormItem label="名单" label-placement="left">
    <NSelect
      v-model:value="config.group"
      class="group-selector"
      :options="groups"
      :render-label="renderGroupName"
    />
    <NButton class="ml-1" @click="handleNewGroup">
      新建名单
      <template #icon>
        <NaiveIcon name="ep:plus" :size="16" />
      </template>
    </NButton>
  </NFormItem>
  <DynamicInput
    v-model:value="names"
    class="mb-5"
    :min="2"
    show-sort-button
  />
  <SettingsGroupOperations v-model:names="names" />
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
