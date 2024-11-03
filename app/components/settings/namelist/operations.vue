<script lang="ts" setup>
import IconExcel from '~icons/vscode-icons/file-type-excel';

const names = defineModel<RollCallOption[]>('names', { required: true });
const currentNamelist = computed(() => useConfigStore().namelist);
const { t } = useI18n({ useScope: 'local' });

const limited = computed(
  () => useNamelistStore().namelist.length >= MAX_NAMELIST_COUNT,
);

const showBatchInput = ref(false);
const showImportExcel = ref(false);

function handleImportDone(items: string[]) {
  names.value.push(...items);
}

const exporting = ref(false);
async function handleExport() {
  exporting.value = true;
  await exportNamelistToText(currentNamelist.value).catch((e) => {
    console.error(e);
    alertError(e);
  });
  exporting.value = false;
}
</script>

<template>
  <NSpace data-guide-id="namelist-operations">
    <NButton :disabled="limited" @click="showBatchInput = true">
      {{ t('batch-input') }}
      <template #icon>
        <LucideNotebookTabs :size="20" />
      </template>
    </NButton>

    <NButton :disabled="limited" @click="showImportExcel = true">
      {{ t('import-excel') }}
      <template #icon>
        <NIcon :size="20">
          <IconExcel />
        </NIcon>
      </template>
    </NButton>

    <NButton :loading="exporting" @click="handleExport">
      {{ t('export') }}
      <template #icon>
        <LucideDownload :size="20" />
      </template>
    </NButton>
  </NSpace>

  <NP v-if="limited">
    {{ t('reached-limit') }}
  </NP>

  <SettingsNamelistBatchInput
    v-model:show="showBatchInput"
    @done="handleImportDone"
  />
  <SettingsNamelistImportExcel
    v-model:show="showImportExcel"
    @done="handleImportDone"
  />
</template>

<i18n lang="yaml">
en:
  batch-input: Batch Input
  import-excel: Import .xlsx
  export: Export
  batch-input-desc:
    One name per line,
    automatically remove leading and trailing spaces and empty lines.
  reached-limit:
    The number of names has reached the limit and new names cannot be imported

zh-CN:
  batch-input: 批量输入
  import-excel: 导入 Excel
  export: 导出
  reached-limit: 名单数量已达上限，无法导入新名单
</i18n>
