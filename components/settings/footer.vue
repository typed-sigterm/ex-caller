<script lang="ts" setup>
const env = __ENV__
const showLicenses = ref(false)
</script>

<template>
  <div class="flex items-center" :style="{ color: '#86909c' }">
    ExCaller {{ version }}
    <img class="inline w-4 mx-2" src="/logo.webp">
    <NButton text @click="showLicenses = true">
      开放源代码许可
    </NButton>
  </div>

  <NModal
    v-model:show="showLicenses"
    class="w-fit h-[90vh]"
    title="开放源代码许可"
    preset="card"
  >
    <iframe class="w-[600px] h-full" src="/licenses.txt" />
    <template v-if="env === Env.Browser" #header-extra>
      <NA href="/licenses.txt" target="_blank">
        在新窗口中打开
      </NA>
    </template>
  </NModal>
</template>
