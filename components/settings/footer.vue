<script lang="ts" setup>
const loadLicenses = ref(false)
const showLicenses = ref(false)
</script>

<template>
  <div class="flex items-center" style="color: #86909c;">
    ExCaller {{ VERSION }}
    <img class="inline w-4 mx-2" src="/logo.webp">
    <NButton text @click="loadLicenses = showLicenses = true">
      开放源代码许可
    </NButton>
  </div>

  <NModal
    v-model:show="showLicenses"
    class="w-fit h-[90vh]"
    preset="card"
    title="ExCaller 开放源代码许可"
  >
    <NScrollbar class="w-[600px] h-full">
      <LazyLicenses v-if="loadLicenses" class="h-0" />
    </NScrollbar>
  </NModal>
</template>
