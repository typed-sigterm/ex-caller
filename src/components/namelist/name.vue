<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import PopoverRename from '@/components/popover-rename.vue';
import { MAX_NAMELIST_NAME_LENGTH } from '@/utils/config';
import { hasNamelist } from '@/utils/namelist';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps<SelectOption>();
const emit = defineEmits<{
  rename: [to: string]
  delete: []
}>();

const { t } = useI18n({ useScope: 'local' });
const message = useMessage();

function rename(to: string) {
  if (hasNamelist(to))
    message.error(t('name-duplicated'));
  else
    emit('rename', to);
}
</script>

<template>
  <div class="w-full">
    <div class="flex">
      {{ props.value }}

      <PopoverRename
        :default="(props.value as string)"
        :maxlength="MAX_NAMELIST_NAME_LENGTH"
        @rename="rename"
      />

      <NPopconfirm
        :positive-text="t('confirm-deletion-title')"
        :positive-button-props="{ type: 'error' }"
        @positive-click="$emit('delete')"
      >
        <I18nT keypath="confirm-deletion">
          {{ props.value }}
        </I18nT>

        <template #trigger>
          <NButton
            class="operator operator-delete ml-0.5"
            size="tiny"
            text
            @click.stop
          >
            <ILucideTrash2 :size="14" />
          </NButton>
        </template>
      </NPopconfirm>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  rename: Rename
  confirm-deletion-title: Delete
  confirm-deletion:
    Confirm deleting namelist {0}? This action cannot be undone!
  name-duplicated: Duplicated with existing name
  namelist-renamed: Namelist {0} is renamed to {1}

zh-CN:
  rename: 重命名
  confirm-deletion-title: 确认删除
  confirm-deletion: 确认删除名单 {0}？删除后无法找回！
  name-duplicated: 与现有名单重名了哦
  namelist-renamed: 名单 {0} 已重命名为 {1}
</i18n>
