<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core';
import { enUS, zhCN } from 'naive-ui';

const i18n = useI18n();

if (__APP__)
  await useThemeStore().init(); // 异步初始化主题

const loading = ref(true);
const show = ref(false);

const locale = computed(() => {
  return markRaw(i18n.locale.value === 'zh-CN' ? zhCN : enUS);
});

// 动画和事件
promiseTimeout(1500).then(() => loading.value = false);
promiseTimeout(1850).then(() => {
  bus.emit('login');
  bus.emit('check-update');
  show.value = true;
  triggerWelcomeGuide();
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

<style lang="postcss">
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}
</style>
