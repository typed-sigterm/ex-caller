<script lang="ts" setup>
const group = useConfigStore().group
const names = defineModel<RollCallOption[]>('names', { required: true })

const showBatchInput = ref(false)

const showImportExcel = ref(false)
function handleImportDone(items: string[]) {
  names.value.push(...items)
}

const exporting = ref(false)
async function handleExport() {
  exporting.value = true
  await exportGroupToText(group).catch((e) => {
    console.error(e)
    alertError(e)
  })
  exporting.value = false
}
</script>

<template>
  <NSpace>
    <NButton @click="showBatchInput = true">
      批量输入
      <template #icon>
        <NaiveIcon name="ep:list" />
      </template>
    </NButton>
    <NButton @click="showImportExcel = true">
      导入 Excel
      <template #icon>
        <NaiveIcon name="vscode-icons:file-type-excel" />
      </template>
    </NButton>
    <NButton :loading="exporting" @click="handleExport">
      导出
      <template #icon>
        <NaiveIcon name="ep:download" />
      </template>
    </NButton>
  </NSpace>

  <SettingsGroupBatchInput
    v-model:show="showBatchInput"
    @done="handleImportDone"
  />
  <SettingsGroupImportExcel
    v-model:show="showImportExcel"
    @done="handleImportDone"
  />
</template>
