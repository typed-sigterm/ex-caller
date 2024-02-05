<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { SettingsNameListGroupName } from '#components'

defineEmits<{
  /** 切换名单。 */
  (ev: 'switchGroup'): void
}>()

const config = useContextConfig()
const groups = ref<SelectOption[]>([])
function refreshGroups() {
  groups.value = getGroups().sort().map(v => ({
    label: v,
    value: v,
    class: 'name-list-group-name-item',
  }))
}
refreshGroups()

const unmounted = ref(false)
onUnmounted(() => unmounted.value = true)

const names = computed(() => getGroupOptions(config.value.group))
const shownNames = ref<RollCallOption[]>([])
onUnmounted(() => shownNames.value = [])

watchImmediate(names, async () => {
  shownNames.value = []
  const len = names.value.length
  for (let i = 0; i < len; ++i)
    await processNamesChunk(i)
})
function processNamesChunk(offset: number) {
  return new Promise((resolve) => {
    shownNames.value.push(names.value[offset])
    requestAnimationFrame(resolve)
  })
}

function renderGroupName(options: SelectOption): VNodeChild {
  return h(SettingsNameListGroupName, {
    ...options,
    onRename: refreshGroups,
    onDelete: refreshGroups,
  })
}

function handleNewNameList() {
  setGroupOptions(generateNewGroupName(), DEFAULT_GROUP_OPTIONS)
  refreshGroups()
}

function handleUpdate() {
  setGroupOptions(config.value.group, shownNames.value)
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
    <NButton class="ml-1" @click="handleNewNameList">
      新建名单
      <template #icon>
        <NaiveIcon name="ep:plus" :size="16" />
      </template>
    </NButton>
  </NFormItem>

  <NDynamicInput
    v-model:value="shownNames"
    :min="2"
    show-sort-button
    @update:value="handleUpdate"
  />
</template>

<style lang="postcss" scoped>
.group-selector :deep(.operator) {
  @apply hidden;
}
</style>

<style lang="postcss">
.name-list-group-name-item {
  &.n-base-select-option--selected .operator-delete {
    @apply hidden;
  }
  .n-base-select-option__content {
    @apply w-full !important;
  }
}
</style>
