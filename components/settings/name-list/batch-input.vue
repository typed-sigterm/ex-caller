<script lang="ts" setup>
defineProps<{
  /** 是否显示。 */
  show?: boolean
}>()
const emit = defineEmits<{
  (ev: 'update:show', showing: boolean): void
  /** 输入完成。 */
  (ev: 'done', names: string[]): void
}>()

const input = ref('')

function handleOk() {
  // 向上传递，并去除空元素
  const names = input.value
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean)
  emit('done', names)
}
</script>

<template>
  <NModal
    :show="show"
    preset="confirm"
    title="批量输入"
    :close-on-esc="false"
    positive-text="确定"
    negative-text="取消"
    @positive-click="handleOk"
    @update:show="(v) => $emit('update:show', v)"
  >
    <NP>每行一个名字，自动去除<strong>头尾的空格</strong>和<strong>空行</strong>。</NP>
    <NInput v-model:value="input" type="textarea" />
  </NModal>
</template>
