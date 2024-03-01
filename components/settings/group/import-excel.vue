<script lang="ts" setup>
import type { UploadCustomRequestOptions } from 'naive-ui'
import IconUpload from '~icons/ep/upload-filled'
import IconExcel from '~icons/vscode-icons/file-type-excel'

const emit = defineEmits<{
  /** 输入完成。 */
  (ev: 'done', names: string[]): void
}>()
/** 是否显示。 */
const show = defineModel<boolean>('show', { required: true })

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

function handleOk() {
  return emit(
    'done',
    input.value
      .flat()
      .filter((_, i) => i < MAX_GROUP_MEMBER_COUNT), // 保证名字数量不超过上限
  )
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="confirm"
    title="导入 Excel"
    :close-on-esc="false"
    positive-text="确定"
    :positive-button-props="{ disabled: !total }"
    negative-text="取消"
    @positive-click="handleOk"
  >
    <NUpload :show-remove-button="false" :custom-request="customRequest">
      <NUploadDragger>
        <div>
          <NIcon :size="48">
            <IconUpload />
          </NIcon>
        </div>
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
    <NP v-if="total > MAX_GROUP_MEMBER_COUNT">
      注意：已超过 {{ MAX_GROUP_MEMBER_COUNT }} 个名字，
      将只导入前 {{ MAX_GROUP_MEMBER_COUNT }} 个。
    </NP>
    <template #icon>
      <NIcon :size="28">
        <IconExcel />
      </NIcon>
    </template>
  </NModal>
</template>
