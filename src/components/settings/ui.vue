<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';
import { MAX_INTERVAL, MIN_INTERVAL } from '@/utils/config';

const { t } = useI18n({ useScope: 'local' });

const config = useConfigStore();

const inputInterval = ref(config.interval);
config.$subscribe(() => {
  inputInterval.value = config.interval;
});
function handleInputIntervalDone() {
  config.interval = inputInterval.value;
}
</script>

<template>
  <NForm label-placement="left">
    <NFormItem :label="t('interval')">
      <NSlider
        v-model:value="inputInterval"
        :format-tooltip="ms => `${ms / 1000}${t('second')}`"
        :max="MAX_INTERVAL"
        :min="MIN_INTERVAL"
        :step="10"
        @dragend="handleInputIntervalDone"
      />
    </NFormItem>

    <NFormItem :label="t('confetti')">
      <NSwitch v-model:value="config.confetti" />
    </NFormItem>
  </NForm>
</template>

<i18n lang="yaml">
en:
  interval: Interval
  confetti: Confetti Effect
  second: s

zh-CN:
  interval: 过号时间
  confetti: 彩带效果
  second: ' 秒'
</i18n>
