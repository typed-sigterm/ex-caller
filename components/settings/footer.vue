<script lang="ts" setup>
const showLicenses = ref(false)

const version = __VERSION__
</script>

<template>
  <div class="flex items-center" style="color: #86909c;">
    ExCaller {{ version }}
    <img class="inline w-4 mx-2" src="/logo.webp">
    <NButton text @click="showLicenses = true">
      开放源代码许可
    </NButton>
  </div>

  <NModal
    v-model:show="showLicenses"
    class="w-fit h-[90vh]"
    preset="card"
    title="ExCaller 开放源代码许可"
  >
    <iframe class="w-[600px] h-full" src="/licenses.html" />
  </NModal>
</template>
