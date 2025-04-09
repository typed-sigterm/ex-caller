<script lang="ts" setup>
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { syncRef } from '@vueuse/core';

const props = defineProps<{
  default: string
}>();
const emit = defineEmits<{
  rename: [to: string]
}>();

defineOptions({ inheritAttrs: false })

const { t } = useI18n({ useScope: 'local' });
const to = ref('');
syncRef(toRef(props, 'default'), to, { direction: 'ltr' });

function handleRenamingUpdate(show: boolean) {
  if (show)
    to.value = props.default;
}

function handleRename() {
  if (to.value && to.value !== props.default)
    emit('rename', to.value);
}
</script>

<template>
  <NPopconfirm
    :show-icon="false"
    :positive-text="t('rename')"
    @update:show="handleRenamingUpdate"
    @positive-click="handleRename"
  >
    <NInput
      v-bind="$attrs"
      v-model:value="to"
      type="text"
      size="small"
    />

    <template #trigger>
      <NButton class="operator ml-1" size="tiny" text>
        <ILucidePencil :size="14" />
      </NButton>
    </template>
  </NPopconfirm>
</template>

<i18n lang="yaml">
en:
  rename: Rename

zh-CN:
  rename: 重命名
</i18n>
  