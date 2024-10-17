<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';
import { enUS, zhCN } from 'naive-ui';

const i18n = useI18n();
useHead({
  htmlAttrs: {
    lang: i18n.locale.value === 'zh-CN' ? 'zh-CN' : 'en',
  },
});

if (__APP__)
  await useThemeStore().init(); // 异步初始化主题

const loading = ref(true);
const show = ref(false);

const locale = computed(() => {
  return markRaw(i18n.locale.value === 'zh-CN' ? zhCN : enUS);
});

// 动画和事件
promiseTimeout(1500).then(() => loading.value = false);
promiseTimeout(1850).then(async () => {
  bus.emit('login');
  show.value = true;
  await triggerWelcomeGuide();
  bus.emit('check-update');
});
</script>

<template>
  <NaiveConfig :style="{ opacity: show ? 1 : 0 }" :locale>
    <NMessageProvider>
      <NDialogProvider>
        <Updater v-if="__APP__" />
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

<style>
:root {
  user-select: none;
  -webkit-user-drag: none;
  -webkit-app-region: no-drag;
}

body::-webkit-scrollbar {
  display: none;
}
#__nuxt, #__nuxt > .n-config-provider {
  width: 100vw;
  height: 100vh;
}

a {
  color: #36ad6a;
}
code, kbd, pre, samp {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
               Liberation Mono, Courier New, monospace;
}
</style>
