<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';

const props = defineProps<{
  /** 将组件状态（是否关闭过）存储在 localStorage 中的 key（非响应式） */
  stateKey: string
}>();

// 为了避免 show 变成 false 导致 <NAlert> 来不及播放关闭动画
const show = useLocalStorage(props.stateKey, true);
const showNow = ref(show.value);
</script>

<template>
  <NAlert
    v-if="showNow"
    type="warning"
    closable
    @after-leave="show = false"
  >
    <slot />
  </NAlert>
</template>
