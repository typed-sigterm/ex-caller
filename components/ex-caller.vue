<script lang="ts" setup>
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
}
function handlePause() {
  if (!result.value?.isActive || showingResume.value)
    return
  showingResume.value = true
  result.value.pause()
}

const showSettings = ref(false)
function handleOpenSettings() {
  showSettings.value = true
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
</script>

<template>
  <ResultBoard
    v-bind="$attrs"
    v-model:showing-resume="showingResume"
    :value="result?.currentValue"
    :show-resume="!result?.isActive"
    :confetti="config.ui.confetti"
    @start="handleStart"
    @pause="handlePause"
  />
  <NaiveIcon
    class="settings-button absolute text-gray-200 hover:text-gray-600 cursor-pointer"
    name="ep:setting"
    :size="24"
    @click="handleOpenSettings"
  />
  <Settings v-model:show="showSettings" @close="handleSettingsClose" />
</template>

<style lang="postcss" scoped>
.settings-button {
  top: calc(env(safe-area-inset-top) + 8px);
  right: calc(env(safe-area-inset-right) + 8px);
  transition: all .3s;
}
</style>
