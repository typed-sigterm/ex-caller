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
});

const emit = defineEmits<{
  import: [items: string[]]
}>();

defineSlots<{
  selectTarget: (props: { count: number, type: 'import'/* | 'export' */ }) => any
}>();

const { t } = useI18n();

const handleImport = (items: string[]) => emit('import', items);

const exporting = ref(false);
function wrapExport() {
  exporting.value = true;
  props.handleExport!().finally(() => exporting.value = false);
}
</script>

<template>
  <NSpace>
    <ImportFromText :disabled :max @submit="handleImport">
      <template #selectTarget="p">
        <slot name="selectTarget" v-bind="p" type="import" />
      </template>
    </ImportFromText>

    <ImportFromExcel :disabled :max @submit="handleImport">
      <template #selectTarget="p">
        <slot name="selectTarget" v-bind="p" type="import" />
      </template>
    </ImportFromExcel>

    <NButton v-if="handleExport" :loading="exporting" @click="wrapExport">
      {{ t('data-operations.export') }}
      <template #icon>
        <ILucideDownload :size="20" />
      </template>
    </NButton>
  </NSpace>
</template>
