<script lang="ts" setup>
import type { SelectOption } from 'naive-ui'

const props = defineProps<SelectOption>()
defineEmits<{
  (ev: 'rename', to: string): void
  (ev: 'delete'): void
}>()

const renameTo = ref('')
function handleRenamingUpdate(show: boolean) {
  if (show)
    renameTo.value = props.value as string
}
</script>

<template>
  <div class="w-full">
    <div class="flex">
      {{ value }}
      <NPopconfirm
        :show-icon="false"
        positive-text="重命名"
        @update:show="handleRenamingUpdate"
        @positive-click="$emit('rename', renameTo)"
      >
        <NInput
          v-model:value="renameTo"
          type="text"
          size="small"
        />
        <template #trigger>
          <NButton
            class="operator ml-1"
            size="tiny"
            text
            @click.stop="$emit('rename', renameTo)"
          >
            <NaiveIcon name="ep:edit" :size="14" />
          </NButton>
        </template>
      </NPopconfirm>

      <NPopconfirm
        positive-text="确认删除"
        :positive-button-props="{ type: 'error' }"
        @positive-click="$emit('delete')"
      >
        确认删除名单“{{ value }}”？删除后无法找回。
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
