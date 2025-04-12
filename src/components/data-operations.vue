<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(defineProps<{
  disabled?: boolean
  max?: number
  handleExport?: () => Promise<void>
}>(), {
  disabled: false,
  max: Infinity,
  handleExport: () => Promise.resolve(),
});

const emit = defineEmits<{
  import: [items: string[]]
}>();

defineSlots<{
  selectTarget: (props: { count: number }) => any
}>();

const { t } = useI18n();

const handleImport = (items: string[]) => emit('import', items);

const exporting = ref(false);
function handleExport() {
  exporting.value = true;
  props.handleExport().finally(() => exporting.value = false);
}
</script>

<template>
  <NSpace>
    <ImportFromText :disabled :max @submit="handleImport">
      <template #selectTarget="p">
        <slot name="selectTarget" v-bind="p" />
      </template>
    </ImportFromText>

    <ImportFromExcel :disabled :max @submit="handleImport">
      <template #selectTarget="p">
        <slot name="selectTarget" v-bind="p" />
      </template>
    </ImportFromExcel>

    <NButton :loading="exporting" @click="handleExport">
      {{ t('export') }}
      <template #icon>
        <ILucideDownload :size="20" />
      </template>
    </NButton>
  </NSpace>
</template>

<i18n lang="yaml">
en:
  export: Export

zh-CN:
  export: 导出
</i18n>
