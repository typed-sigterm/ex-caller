<script lang="ts" setup>
import IconSettings from '~icons/ep/setting'

setupUiHooks()
const config = useConfigStore()

function getRollCall(options?: Partial<RollCallConfig>) {
  return useRollCall({ // 点名结果
    options: useGroup(config.group).value,
    duration: config.interval,
    ...options,
  })
}
const result = getRollCall()

const unstarted = ref(true) // 是否未开始过
const showingResume = ref(false) // 是否正在播放动画

function handleStart() {
  result.value.start()
  unstarted.value = false
  triggerStopCallingGuide({
    resultBoard: document.querySelector('[data-guide-id="result-board"]'),
  })
}
function handlePause() {
  if (!result.value?.isActive || showingResume.value)
    return
  showingResume.value = true
  result.value.pause()

  if (config.plan.enabled && config.plan.queue.length > 0) { // 有计划则执行计划
    result.value.currentValue = config.plan.queue[0]
    config.plan.queue.shift()
  }
}

const loadSettings = ref(false) // 是否需要加载设置组件
const showSettings = ref(false)
function handleOpenSettings() {
  loadSettings.value = showSettings.value = true
  // 正在点名时打开设置，停止点名，不显示点名结果
  if (result.value.isActive)
    result.value.reset()
}
function handleSettingsClose() {
  // 设置更改时需要同步到实例，但需让当前显示的值不变，让用户无感
  result.value = getRollCall({
    defaultIndex: result.value.currentIndex,
    defaultValue: result.value.currentValue,
  }).value
}

bus.on('login', () => { // 教程
  triggerWelcomeGuide({
    startButton: document.querySelector('[data-guide-id="start-button"]'),
    settingsButton: document.querySelector('[data-guide-id="settings-button"]'),
  })
})

prefetchComponents('LazySettings')
</script>

<template>
  <ResultBoard
    v-bind="$attrs"
    v-model:showing-resume="showingResume"
    :style="{ userSelect: result.isActive ? 'none' : 'auto' }"
    :value="result.currentValue"
    :show-resume="!result.isActive"
    :confetti="config.ui.confetti"
    data-guide-id="result-board"
    @start="handleStart"
    @pause="handlePause"
  >
    <template v-if="config.ui.settingsButton === 'center'" #startOperators>
      <LargeButton
        :type="config.plan.enabled ? 'error' : 'info'"
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

    <template v-if="config.ui.settingsButton === 'center'" #resumeOperators>
      <NButton circle @click="handleOpenSettings">
        <template #icon>
          <NIcon :size="18">
            <IconSettings />
          </NIcon>
        </template>
      </NButton>
    </template>
  </ResultBoard>

  <NIcon
    v-if="config.ui.settingsButton === 'top-right'"
    class="settings-button"
    :size="24"
    :class="[config.plan.enabled && 'plan-enabled']"
    data-guide-id="settings-button"
    @click="handleOpenSettings"
  >
    <IconSettings />
  </NIcon>

  <LazySettings
    v-if="loadSettings"
    v-model:show="showSettings"
    @close="handleSettingsClose"
  />
</template>

<style lang="postcss" scoped>
.settings-button {
  &:hover {
    animation-play-state: running;
  }
  &.plan-enabled {
    color: #d03050;
    opacity: 1;
  }

  position: absolute;
  top: calc(env(safe-area-inset-top) + 8px);
  right: calc(env(safe-area-inset-right) + 8px);
  transition: all .3s;
  animation: rotating 5s linear infinite forwards;
  animation-play-state: paused;
  cursor: pointer;
  opacity: 0.2;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
