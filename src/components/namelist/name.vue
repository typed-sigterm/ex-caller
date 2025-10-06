<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import PopoverRename from '@/components/popover-rename.vue';
import { MAX_NAMELIST_NAME_LENGTH } from '@/utils/config';
import { hasNamelist } from '@/utils/namelist';

const props = defineProps<SelectOption>();
const emit = defineEmits<{
  rename: [to: string]
  delete: []
}>();

const { t } = useI18n();
const message = useMessage();

function rename(to: string) {
  if (hasNamelist(to))
    message.error(t('namelist.name.name-duplicated'));
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
        :positive-text="t('namelist.name.confirm-deletion-title')"
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
