<script lang="ts" setup>
defineProps<{
  /** 弹窗标题 */
  title: string
}>()
defineSlots<{
  /** 触发弹窗的操作，发出 `click` 事件时打开弹窗 */
  default: () => any
  /** 弹窗内容 */
  modal: () => any
}>()

const show = defineModel<boolean>('show')
</script>

<template>
  <slot />

  <NModal
    v-model:show="show"
    class="w-[600px] h-[90vh]"
    preset="card"
    :title
  >
    <NScrollbar class="w-full h-full">
      <slot name="modal" />
    </NScrollbar>
  </NModal>
</template>
