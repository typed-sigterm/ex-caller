<script lang="ts" setup>
import { useConfigStore } from '@/stores/config';
import { useNamelistStore } from '@/stores/namelist';
import { MAX_NAMELIST_COUNT } from '@/utils/config';
import { exportNamelistToText, genNewNamelistName, useNamelist } from '@/utils/namelist';
import { alertError } from '@/utils/ui';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconExcel from '~icons/vscode-icons/file-type-excel';

const emit = defineEmits<{
  switchNamelist: [namelist: string]
}>();

const config = useConfigStore();
const namelist = useNamelistStore();
const { t } = useI18n({ useScope: 'local' });

const limited = computed(() => namelist.namelist.length >= MAX_NAMELIST_COUNT);

const showBatchInput = ref(false);
const showImportExcel = ref(false);

function handleImportDone(addTo: string, items: string[]) {
  if (addTo === '\0') {
    const name = genNewNamelistName();
    namelist.add(name, items);
    emit('switchNamelist', name);
  } else {
    useNamelist(addTo).value.push(...items);
    emit('switchNamelist', addTo);
  }
}

const exporting = ref(false);
async function handleExport() {
  exporting.value = true;
  await exportNamelistToText(config.namelist).catch((e) => {
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
        <ILucideNotebookTabs :size="20" />
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
        <ILucideDownload :size="20" />
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
