<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import IconEdit from '~icons/ep/edit';
import IconDelete from '~icons/ep/delete';

const props = defineProps<SelectOption>();
const emit = defineEmits<{
  (ev: 'rename', to: string): void
  (ev: 'delete'): void
}>();

const { t } = useI18n({ useScope: 'local' })

const renameTo = ref('');
function handleRenamingUpdate(show: boolean) {
  if (show)
    renameTo.value = props.value as string;
}
function handleRename() {
  if (renameTo.value === props.value)
    return;
  if (useGroupStore().has(renameTo.value)) {
    ui.message.error(t('names-duplicated'));
    return;
  }
  emit('rename', renameTo.value);
}
</script>

<template>
  <div class="w-full">
    <div class="flex">
      {{ value }}
      <NPopconfirm
        :show-icon="false"
        :positive-text="t('rename')"
        @update:show="handleRenamingUpdate"
        @positive-click="handleRename"
      >
        <NInput
          v-model:value="renameTo"
          type="text"
          size="small"
          :maxlength="MAX_GROUP_NAME_LENGTH"
        />

        <template #trigger>
          <NButton class="operator ml-1" size="tiny" text>
            <NIcon :size="14">
              <IconEdit />
            </NIcon>
          </NButton>
        </template>
      </NPopconfirm>

      <NPopconfirm
        :positive-text="t('confirm-deletion-title')"
        :positive-button-props="{ type: 'error' }"
        @positive-click="$emit('delete')"
      >
        <I18nT keypath="confirm-deletion">
          {{ value }}
        </I18nT>

        <template #trigger>
          <NButton
            class="operator operator-delete ml-0.5"
            size="tiny"
            text
            @click.stop
          >
            <NIcon :size="14">
              <IconDelete />
            </NIcon>
          </NButton>
        </template>
      </NPopconfirm>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  rename: Rename
  confirm-deletion-title: Confirm Deletion
  confirm-deletion: Confirm deletion {0}"? This action cannot be undone!
  names-duplicated: Duplicated with existing name

zh-CN:
  rename: 重命名
  confirm-deletion-title: 确认删除
  confirm-deletion: 确认删除名单“{0}”？删除后无法找回！
  names-duplicated: 与现有名单重名了哦
</i18n>
