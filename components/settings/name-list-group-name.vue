<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const props = defineProps<SelectOption>()
const emit = defineEmits<{
  (ev: 'rename', to: string): void
  (ev: 'delete'): void
}>()

const config = useContextConfig()
const group = toRef(props, 'value') as Ref<string>

const renaming = ref('')
const handleRename = () => renaming.value = group.value
function handleRenameOk() {
  const to = renaming.value
  if (group.value === to) // 没改
    return
  renameGroup(group.value, to)
  if (config.value.group === group.value) // 修改的是当前名单，要同步更改
    config.value.group = to
  emit('rename', to)
}

function handleDelete() {
  deleteGroup(group.value)
  emit('delete')
}
</script>

<template>
  <div class="w-full">
    <div class="flex">
      {{ group }}
      <NPopconfirm
        :show-icon="false"
        positive-text="重命名"
        @positive-click="handleRenameOk"
      >
        <NInput
          v-model:value="renaming"
          type="text"
          size="small"
        />
        <template #trigger>
          <NButton class="operator ml-1" size="tiny" text @click.stop="handleRename">
            <NaiveIcon name="ep:edit" :size="14" />
          </NButton>
        </template>
      </NPopconfirm>

      <NPopconfirm
        positive-text="确认删除"
        :positive-button-props="{ type: 'error' }"
        @positive-click="handleDelete"
      >
        确认删除名单“{{ group }}”？删除后无法找回。
        <template #trigger>
          <NButton
            class="operator operator-delete ml-0.5"
            size="tiny"
            text
            @click.stop
          >
            <NaiveIcon name="ep:delete" :size="14" />
          </NButton>
        </template>
      </NPopconfirm>
    </div>
  </div>
</template>
