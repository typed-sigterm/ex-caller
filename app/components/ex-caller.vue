<script lang="ts" setup>
import type { Status as BackgroundStatus } from './background.vue';
import type { Status as ResultStatus } from './result-board.vue';

setupUiHooks();
const config = useConfigStore();

function getRollCall(options?: Partial<RollCallConfig>) {
  return useRollCall({ // 点名结果
    options: useNamelist(config.namelist).value,
    duration: config.interval,
    ...options,
  });
}
const result = getRollCall();

const status = ref<ResultStatus>('paused');

const backgroundStatus = ref<BackgroundStatus>('normal');

function handleStart() {
  backgroundStatus.value = 'ready-rolling';
  whenever( // 背景准备好后开始抽取
    () => backgroundStatus.value === 'rolling',
    () => {
      status.value = 'rolling';
      result.value.start();
      triggerStopRollingGuide();
    },
    { once: true },
  );
  track('Roll Call');
}

function handlePausing() {
  result.value.pause();
  status.value = 'pausing';
  backgroundStatus.value = 'pausing';

  if (config.plan.enabled && config.plan.queue.length > 0) { // 有计划则执行计划
    result.value.currentValue = config.plan.queue[0];
    config.plan.queue.shift();
  }
}

function handlePaused() {
  status.value = 'paused';
  backgroundStatus.value = 'normal';
}

const showSettings = ref(false);
const loadSettings = ref(false); // 是否需要加载设置组件
const loadedSettings = ref(false); // 设置组件是否已经加载完成
// 首次打开设置会加载设置组件，不立即显示弹窗
// 这里等到加载完成后再显示弹窗，否则弹窗动画会消失
whenever(loadedSettings, () => {
  showSettings.value = true;
});
const settingsButtonLoading = computed(() => loadSettings.value && !loadedSettings.value);

async function handleOpenSettings() {
  if (showSettings.value)
    return;
  // 正在点名时打开设置，停止点名，不显示点名结果
  if (result.value.isActive)
    result.value.reset();
  // 首次打开设置时，先加载设置组件，不立即显示弹窗
  if (loadSettings.value)
    showSettings.value = true;
  else
    loadSettings.value = true;
}

function handleSettingsClose() {
  // 设置更改时需要同步到实例，但需让当前显示的值不变，让用户无感
  result.value = getRollCall({
    defaultIndex: result.value.currentIndex,
    defaultValue: result.value.currentValue,
  }).value;
}

prefetchComponents('LazySettings');
</script>

<template>
  <Background v-model:status="backgroundStatus" />

  <ResultBoard
    v-bind="$attrs"
    v-model:status="status"
    class="bg-no-repeat bg-center bg-cover"
    :value="result.currentValue"
    :confetti="config.confetti"
    data-guide-id="result-board"
    @start="handleStart"
    @pausing="handlePausing"
    @paused="handlePaused"
  >
    <template #startExtraOperators>
      <LargeButton
        :type="config.plan.enabled ? 'error' : 'info'"
        :loading="settingsButtonLoading"
        data-guide-id="settings-button"
        @click="handleOpenSettings"
      >
        <template #icon>
          <NIcon :size="32">
            <LucideSettings :stroke-width="1.8" />
          </NIcon>
        </template>
      </LargeButton>
    </template>

    <template #resumeExtraOperators>
      <NButton
        :type="config.plan.enabled ? 'error' : 'default'"
        :loading="settingsButtonLoading"
        circle
        @click="handleOpenSettings"
      >
        <template #icon>
          <NIcon :size="18">
            <LucideSettings :stroke-width="1.8" />
          </NIcon>
        </template>
      </NButton>
    </template>
  </ResultBoard>

  <LazySettings
    v-if="loadSettings"
    v-model:show="showSettings"
    @close="handleSettingsClose"
    @vue:mounted="loadedSettings = true"
  />
</template>
