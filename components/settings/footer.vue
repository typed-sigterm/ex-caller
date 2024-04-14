<script lang="ts" setup>
import Licenses from '~/3rd-party-licenses.md'

const version = __VERSION__
const showLicenses = ref(false)
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
    <NScrollbar class="w-[600px] h-full">
      <Licenses class="h-0" />
    </NScrollbar>
  </NModal>
</template>

<style lang="postcss" scoped>
:deep() {
  h1 {
    display: none;
  }
  h1 + p {
    margin-block-start: 0;
  }
}
</style>
