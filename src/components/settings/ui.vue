<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';
import { MAX_INTERVAL, MIN_INTERVAL } from '@/utils/config';

const { t } = useI18n();

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
    <NFormItem :label="t('settings.ui.interval')">
      <NSlider
        v-model:value="inputInterval"
        :format-tooltip="ms => `${ms / 1000}${t('settings.ui.second')}`"
        :max="MAX_INTERVAL"
        :min="MIN_INTERVAL"
        :step="10"
        @dragend="handleInputIntervalDone"
      />
    </NFormItem>

    <NFormItem :label="t('settings.ui.confetti')">
      <NSwitch v-model:value="config.confetti" />
    </NFormItem>
  </NForm>
</template>

