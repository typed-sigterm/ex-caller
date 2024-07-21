<script lang="ts" setup>
import type { Status as ResultStatus } from './result-board.vue';
import type { Status as BackgroundStatus } from './background.vue';
import IconSettings from '~icons/ep/setting';

setupUiHooks();
const config = useConfigStore();

function getRollCall(options?: Partial<RollCallConfig>) {
  return useRollCall({ // 点名结果
    options: useGroup(config.group).value,
    duration: config.interval,
    ...options,
  });
}
const result = getRollCall();

const status = ref<ResultStatus>('paused');

const backgroundStatus = ref<BackgroundStatus>('normal');

function handleStart() {
  backgroundStatus.value = 'ready-rolling';
  const stopWatch = whenever( // 背景准备好后开始抽取
    () => backgroundStatus.value === 'rolling',
    () => {
      stopWatch();
      status.value = 'rolling';
      result.value.start();
      triggerStopCallingGuide();
    },
  );
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

const loadSettings = ref(false); // 是否需要加载设置组件
const loadedSettings = ref(false); // 设置组件是否已经加载完成
const showSettings = ref(false);
const showLoadingSettings = computed(() => showSettings.value && !loadedSettings.value);

function handleOpenSettings() {
  if (showSettings.value)
    return;
  loadSettings.value = showSettings.value = true;
  // 正在点名时打开设置，停止点名，不显示点名结果
  if (result.value.isActive)
    result.value.reset();
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
        :loading="showLoadingSettings"
        data-guide-id="settings-button"
        @click="handleOpenSettings"
      >
        <template #icon>
          <NIcon :size="32">
            <IconSettings />
          </NIcon>
        </template>
      </LargeButton>
    </template>

    <template #resumeExtraOperators>
      <NButton circle @click="handleOpenSettings">
        <template #icon>
          <NIcon :size="18">
            <IconSettings />
          </NIcon>
        </template>
      </NButton>
    </template>
  </ResultBoard>

  <LazySettings
    v-if="loadSettings"
    v-model:show="showSettings"
    @open="loadedSettings = true"
    @close="handleSettingsClose"
  />
</template>
