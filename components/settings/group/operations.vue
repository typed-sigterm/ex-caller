<script lang="ts" setup>
const group = useConfigStore().group
const names = defineModel<RollCallOption[]>('names', { required: true })

const limited = computed(() => useGroupList().value.length >= MAX_GROUP_COUNT)

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
    <NButton :disabled="limited" @click="showBatchInput = true">
      批量输入
      <template #icon>
        <NaiveIcon name="ep:list" />
      </template>
    </NButton>
    <NButton :disabled="limited" @click="showImportExcel = true">
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
  <NP v-if="limited">
    名单数量已达上限，无法导入新名单。
  </NP>

  <SettingsGroupBatchInput
    v-model:show="showBatchInput"
    @done="handleImportDone"
  />
  <SettingsGroupImportExcel
    v-model:show="showImportExcel"
    @done="handleImportDone"
  />
</template>
