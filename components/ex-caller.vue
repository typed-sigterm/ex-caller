<script lang="ts" setup>
import type { Expose as ResultBoardExpose } from '~/components/result-board.vue'

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
const planned = computed(() => config.plan.enabled && config.plan.queue.length > 0)

const resultBoardExpose = ref<ResultBoardExpose | null>(null)

function handleStart() {
  result.value.start()
  unstarted.value = false
  if (shouldStartGuide('stopCalling'))
    startStopCallingGuide(resultBoardExpose.value!)
}
function handlePause() {
  if (!result.value?.isActive || showingResume.value)
    return
  showingResume.value = true
  result.value.pause()

  if (planned.value) { // 有计划则执行计划
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

onMounted(() => { // 教程
  if (!shouldStartGuide('welcome'))
    return
  startWelcomeGuide({
    ...resultBoardExpose.value!,
    settingsButton: document.querySelector('.settings-button'),
  })
})
</script>

<template>
  <ResultBoard
    ref="resultBoardExpose"
    v-bind="$attrs"
    v-model:showing-resume="showingResume"
    :value="result.currentValue"
    :show-resume="!result.isActive"
    :confetti="config.ui.confetti"
    @start="handleStart"
    @pause="handlePause"
  />
  <NaiveIcon
    class="settings-button absolute text-gray-200 hover:text-gray-600 cursor-pointer"
    :style="{ color: planned ? '#d03050' : undefined }"
    name="ep:setting"
    :size="24"
    @click="handleOpenSettings"
  />
  <LazySettings
    v-if="loadSettings"
    v-model:show="showSettings"
    @close="handleSettingsClose"
  />
</template>

<style lang="postcss" scoped>
.settings-button {
  top: calc(env(safe-area-inset-top) + 8px);
  right: calc(env(safe-area-inset-right) + 8px);
  transition: all .3s;
}
</style>
