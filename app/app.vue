<script lang="tsx" setup>
import { promiseTimeout } from '@vueuse/core';
import { enUS, zhCN } from 'naive-ui';
import { initPortable } from '~/utils/fs';

const i18n = useI18n();
const { t } = useI18n({ useScope: 'local' });
useHead({
  htmlAttrs: {
    lang: i18n.locale.value === 'zh-CN' ? 'zh-CN' : 'en',
  },
});

if (__APP__)
  useThemeStore().init(); // 异步初始化主题

const loading = ref(true);
const show = ref(false);

const locale = computed(() => {
  return markRaw(i18n.locale.value === 'zh-CN' ? zhCN : enUS);
});

const { orientation } = useScreenOrientation();
const incorrectOrientation = computed(() => orientation.value?.startsWith('portrait'));

// 动画和事件
promiseTimeout(1500).then(() => loading.value = false);
promiseTimeout(1850).then(async () => {
  bus.emit('login');
  show.value = true;
  await alertOrientation();
  await triggerWelcomeGuide();
  bus.emit('check-update');
});

let closedOrientation = false;
function alertOrientation() {
  if (!incorrectOrientation.value || closedOrientation)
    return Promise.resolve();
  return new Promise<void>((resolve) => {
    const modal = ui.dialog.info({
      title: t('orientation.title'),
      content: () => (
        <>
          <p class="m-0">{t('orientation.content-1')}</p>
          <p class="mt-1">{t('orientation.content-2')}</p>
        </>
      ),
      positiveText: i18n.t('confirm'),
      closable: false,
      onPositiveClick: () => closedOrientation = true, // 手动关闭，下次不再弹窗
      onAfterLeave: resolve,
    });
    const orientationListener = () => {
      if (incorrectOrientation.value) // 已变为横屏才自动关闭弹窗
        return;
      modal.destroy();
      screen.orientation.removeEventListener('change', orientationListener);
    };
    screen.orientation.addEventListener('change', orientationListener);
  });
}

watch(orientation, () => {
  if (!closedOrientation && incorrectOrientation.value)
    alertOrientation();
});

// portable 下 localStorage 与文件同步
onMounted(async () => {
  if (__APP__ && await isPortable()) // tree-shake
    await initPortable();
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}

.n-modal-container {
  z-index: 1000000001 !important; /* for driver.js */
}

.driver-active .n-modal-container * {
  pointer-events: initial; /* for driver.js */
}
</style>

<i18n lang="yaml">
en:
  orientation:
    title: Prefer Landscape Mode
    content-1: ExCaller is designed to be used in landscape mode, and may have UI issues in portrait mode.
    content-2: You can open the notification bar and enable "Auto-rotate", then rotate your device to landscape mode.

zh-CN:
  orientation:
    title: 推荐横屏使用
    content-1: ExCaller 被设计为横屏使用，竖屏使用可能出现问题。
    content-2: 您可以下拉通知栏打开“自动旋转”，并将设备旋转至横屏模式。
</i18n>
