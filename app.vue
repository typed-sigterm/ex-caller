<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import { zhCN } from 'naive-ui'
import { gc } from '~/utils/gc'

const loading = ref(true)
const show = ref(false)

promiseTimeout(1600).then(() => {
  loading.value = false
  gc()
})
promiseTimeout(2000).then(() => show.value = true)
</script>

<template>
  <NaiveConfig
    class="transition-opacity"
    :style="{ opacity: show ? 1 : 0 }"
    :locale="zhCN"
  >
    <ExCaller />
  </NaiveConfig>
  <Loading
    v-if="!show"
    class="loading"
    :style="{ opacity: loading ? 1 : 0 }"
    :show="loading"
  />
</template>

<style lang="postcss">
#__nuxt,
#__nuxt > .n-config-provider {
  @apply w-screen h-screen;
}
.loading {
  transition: all .4s;
  background: center / auto no-repeat url("/loading.png");
}
</style>
