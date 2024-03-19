<script lang="ts" setup>
defineProps<{
  /** 是否显示。 */
  show: boolean
}>()
</script>

<template>
  <div class="loading fixed top-0 w-screen h-screen" />
</template>

<style scoped>
.loading {
  background: center / 100px auto no-repeat url("~/public/loading.webp");
}
</style>
