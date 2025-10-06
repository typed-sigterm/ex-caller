<script lang="ts" setup>
import { syncRef } from '@vueuse/core';
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ inheritAttrs: false });
const props = defineProps<{
  default: string
}>();
const emit = defineEmits<{
  rename: [to: string]
}>();

const { t } = useI18n();
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
    :positive-text="t('popover-rename.rename')"
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

