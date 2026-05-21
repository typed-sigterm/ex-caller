<script lang="ts" setup>
defineSlots<{
  /** 触发弹窗的操作，发出 `click` 事件时打开弹窗 */
  default: () => any
  modalTitle?: () => any
  modalContent: () => any
}>();

const showModal = defineModel<boolean>('showModal');
</script>

<template>
  <NButton v-bind="$attrs" text @click="showModal = true">
    <slot />
  </NButton>

  <NModal
    v-model:show="showModal"
    class="link-to-modal"
    preset="card"
    :title="$slots.modalTitle"
  >
    <NScrollbar class="scroll-view">
      <slot name="modalContent" />
    </NScrollbar>
  </NModal>
</template>

<style>
.link-to-modal {
  width: 600px;
  height: 90vh;

  .n-card-header__main {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .n-scrollbar-content {
    height: 0; /* 确保内容在弹窗内滑动 */
  }
}
</style>
