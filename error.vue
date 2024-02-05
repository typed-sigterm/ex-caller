<script lang="ts" setup>
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const handleRefresh = () => location.reload()
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <NResult status="500" title="貌似出了点问题">
      <pre>{{ error }}</pre>
      <template #footer>
        <NButton type="primary" @click="handleRefresh">
          刷新一下
        </NButton>
      </template>
    </NResult>
  </div>
</template>

<style lang="postcss" scoped>
:deep() .n-result-content {
  @apply w-full text-center mx-auto my-0 mt-4;
}
</style>
