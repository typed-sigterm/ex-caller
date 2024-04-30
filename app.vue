<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import { zhCN } from 'naive-ui'

if (__APP__)
  setupTheme() // 异步初始化主题

const loading = ref(true)
const show = ref(false)

// 动画和事件
promiseTimeout(1500).then(() => loading.value = false)
promiseTimeout(1850).then(() => {
  show.value = true
  bus.emit('login')
})
</script>

<template>
  <NaiveConfig
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
    class="loading"
    :style="{ opacity: loading ? 1 : 0 }"
    :animation="loading"
  />
</template>

<style scoped>
.loading {
  position: fixed;
  transition: opacity 0.3s;
}
</style>

<style lang="postcss">
body::-webkit-scrollbar {
  display: none;
}
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
