<script lang="ts" setup>
import IconList from '~icons/ep/list'

const emit = defineEmits<{
  /** 输入完成 */
  (ev: 'done', names: string[]): void
}>()
/** 是否显示 */
const show = defineModel<boolean>('show', { required: true })

const input = ref('')

function handleOk() {
  const names = input.value
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean) // 去除空元素
  if (names.length >= MAX_GROUP_MEMBER_COUNT) {
    ui.message.error('名单数量已达上限')
    return
  }

  emit('done', names)
}
</script>

<template>
  <NModal
    v-model:show="show"
    preset="confirm"
    title="批量输入"
    :close-on-esc="false"
    positive-text="确定"
    negative-text="取消"
    @positive-click="handleOk"
  >
    <NP>每行一个名字，自动去除<strong>头尾的空格</strong>和<strong>空行</strong>。</NP>
    <NInput v-model:value="input" type="textarea" />

    <template #icon>
      <NIcon :size="28">
        <IconList />
      </NIcon>
    </template>
  </NModal>
</template>
