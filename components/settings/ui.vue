<script lang="ts" setup>
const config = useConfigStore()

const inputInterval = ref(config.interval)
config.$subscribe(() => {
  inputInterval.value = config.interval
})
function handleInputIntervalDone() {
  config.interval = inputInterval.value
}
</script>

<template>
  <NForm label-placement="left">
    <NFormItem label="过号时间">
      <NSlider
        v-model:value="inputInterval"
        :format-tooltip="ms => `${ms / 1000} 秒`"
        :max="MAX_INTERVAL"
        :min="MIN_INTERVAL"
        :step="10"
        @dragend="handleInputIntervalDone"
      />
    </NFormItem>

    <NFormItem label="彩带效果">
      <NSwitch v-model:value="config.confetti" />
    </NFormItem>
  </NForm>
</template>
