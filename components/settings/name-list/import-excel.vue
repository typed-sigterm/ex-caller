<script lang="ts" setup>
import type { UploadCustomRequestOptions } from 'naive-ui'

defineProps<{
  /** 是否显示。 */
  show?: boolean
}>()
const emit = defineEmits<{
  (ev: 'update:show', showing: boolean): void
  /** 输入完成。 */
  (ev: 'done', names: string[]): void
}>()

const input = ref<string[][]>([])
const total = computed(() => input.value.flat().length)

function customRequest(options: UploadCustomRequestOptions) {
  if (!options.file.file)
    return
  options.onProgress({ percent: Math.floor(Math.random() * 100) })
  importGroupFromExcel(options.file.file)
    .then((v) => {
      input.value.push(v)
      options.onFinish()
    })
    .catch((e) => {
      console.error(e)
      options.onError()
    })
}

const handleOk = () => emit('done', input.value.flat())
</script>

<template>
  <NModal
    :show="show"
    preset="confirm"
    title="从 Excel 导入"
    :close-on-esc="false"
    positive-text="确定"
    :positive-button-props="{ disabled: !total }"
    negative-text="取消"
    @positive-click="handleOk"
    @update:show="(v) => $emit('update:show', v)"
  >
    <NUpload :show-remove-button="false" :custom-request="customRequest">
      <NUploadDragger>
        <div><NaiveIcon name="ep:upload-filled" :size="48" /></div>
        <NText class="text-base">
          点击此处或拖动文件到此区域
        </NText>
        <NP depth="3" class="mt-2">
          支持 .xls .xlsx .csv 文件
        </NP>
      </NUploadDragger>
    </NUpload>
    <NP v-if="input.length">
      共检测到 {{ total }} 个名字，点击“确认”即可导入。
    </NP>
    <template #icon>
      <NaiveIcon name="vscode-icons:file-type-excel" :size="24" />
    </template>
  </NModal>
</template>
