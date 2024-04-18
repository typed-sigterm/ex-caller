<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import { zhCN } from 'naive-ui'
import { gc } from '~/utils/gc'

setupTheme() // 异步初始化主题

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

watchImmediate(show, (v) => {
  if (v)
    bus.emit('login')
})
</script>

<template>
  <NaiveConfig
    class="transition-opacity"
    :style="{ opacity: show ? 1 : 0 }"
    :locale="zhCN"
  >
    <NMessageProvider>
      <NDialogProvider>
        <ExCaller />
      </NDialogProvider>
    </NMessageProvider>
  </NaiveConfig>
  <Loading
    v-if="!show"
    :style="{ opacity: loading ? 1 : 0, transition: 'all .4s' }"
    :show="loading"
  />
</template>

<style lang="postcss">
#__nuxt, #__nuxt > .n-config-provider {
  width: 100vw;
  height: 100vh;
}

.markdown-body {
  a {
    color: #36ad6a;
  }
  code, kbd, pre, samp {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  }
}
</style>
