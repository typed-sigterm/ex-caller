<script lang="tsx" setup>
import { promiseTimeout, useScreenOrientation, watchImmediate } from '@vueuse/core';
import { enUS, zhCN } from 'naive-ui';
import { computed, markRaw, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/stores/theme';
import { __APP__, isPortable } from '@/utils/app';
import { bus } from '@/utils/event';
import { initPortable } from '@/utils/fs';
import { triggerWelcomeGuide } from '@/utils/guide';
import { setupI18nHooks, ui } from '@/utils/ui';
import { initAnalytics } from './utils/analytics';

setupI18nHooks();

const i18n = useI18n();
const { t } = i18n;
watchImmediate(i18n.locale, (v) => {
  document.documentElement.lang = v;
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
      title: t('app.orientation.title'),
      content: () => (
        <>
          <p class="m-0">{t('app.orientation.content-1')}</p>
          <p class="mt-1">{t('app.orientation.content-2')}</p>
        </>
      ),
      positiveText: t('confirm'),
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

function hideSpin() {
  document.getElementById('app')!.removeAttribute('data-loading');
}

onMounted(initAnalytics);
</script>

<template>
  <NConfigProvider :style="{ opacity: show ? 1 : 0 }" :locale inline-theme-disabled>
    <NMessageProvider>
      <NDialogProvider>
        <Updater v-if="__APP__" />
        <ExCaller @vue:mounted="hideSpin" />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>

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
