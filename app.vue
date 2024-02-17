<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import { zhCN } from 'naive-ui'
import { gc } from '~/utils/gc'

const loading = ref(true)
const show = ref(false)

function playAnimation() {
  promiseTimeout(1600).then(() => {
    loading.value = false
    gc()
  })
  promiseTimeout(2000).then(() => show.value = true)
}

if (useConfigStore().ui.firstScreenAnimation) {
  playAnimation()
}
else { // 关闭了首屏动画，直接显示
  loading.value = false
  show.value = true
}
</script>

<template>
  <NaiveConfig
    class="transition-opacity"
    :style="{ opacity: show ? 1 : 0 }"
    :locale="zhCN"
  >
    <NDialogProvider>
      <ExCaller />
    </NDialogProvider>
  </NaiveConfig>
  <Loading
    v-if="!show"
    :style="{ opacity: loading ? 1 : 0, transition: 'all .4s' }"
    :show="loading"
  />
</template>

<style lang="postcss">
#__nuxt,
#__nuxt > .n-config-provider {
  @apply w-screen h-screen;
}
</style>
