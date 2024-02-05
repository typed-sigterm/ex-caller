<script lang="ts" setup>
const config = useContextConfig()

const inputInterval = ref(config.value.interval)
watch(config, (v) => {
  inputInterval.value = v.interval
})
function handleInputIntervalDone() {
  config.value.interval = inputInterval.value
}
</script>

<template>
  <NForm :model="config.ui" label-placement="left">
    <NFormItem label="过号时间">
      <NSlider
        v-model:value="inputInterval"
        :format-tooltip="(ms) => `${ms / 1000} 秒`"
        :max="1000"
        :min="20"
        :step="10"
        @dragend="handleInputIntervalDone"
      />
    </NFormItem>

    <NFormItem label="彩带效果">
      <NSwitch v-model:value="config.ui.confetti" />
    </NFormItem>
  </NForm>
</template>
