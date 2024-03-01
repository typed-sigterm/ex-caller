<script lang="tsx" setup>
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { SettingsGroupName } from '#components'

const config = useConfigStore()
const names = computed(() => useGroup(config.group)) // ref 包 ref
const groups = computed<SelectOption[]>(() => {
  return useGroupList().value.map(item => ({
    label: '',
    value: item,
    class: 'group-name-item',
  }))
})
const limited = computed(() => useGroupList().value.length >= MAX_GROUP_COUNT)

function renderGroupName(options: SelectOption): VNodeChild {
  const handleRename = (to: string) => {
    renameGroup(options.value as string, to)
    if (config.group === options.value) // 重命名当前名单
      config.$patch({ group: to })
  }
  const handleDelete = () => {
    removeGroup(options.value as string)
  }

  return (
    <SettingsGroupName
      {...options}
      onRename={handleRename}
      onDelete={handleDelete}
    />
  )
}

function handleAddGroup() {
  const name = generateNewGroupName()
  addGroup(name) // 创建名单
  config.$patch({ group: name }) // 切换到新名单
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
    <NButton class="ml-1" :disabled="limited" @click="handleAddGroup">
      新建名单
      <template #icon>
        <NaiveIcon name="ep:plus" :size="16" />
      </template>
    </NButton>
  </NFormItem>
  <DynamicInput
    v-model:value="names.value"
    class="mb-5"
    :min="2"
    :max="MAX_GROUP_MEMBER_COUNT"
    show-sort-button
  />
  <SettingsGroupOperations v-model:names="names.value" />
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
