<script lang="ts" setup>
import { invoke } from '@tauri-apps/api/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';
import { __APP__ } from '@/utils/app';
import { MAX_INTERVAL, MAX_ZOOM, MIN_INTERVAL, MIN_ZOOM, ZOOM_STEP } from '@/utils/config';

const { t } = useI18n();

const config = useConfigStore();

const inputInterval = ref(config.interval);
config.$subscribe(() => {
  inputInterval.value = config.interval;
});
function handleInputIntervalDone() {
  config.interval = inputInterval.value;
}

const inputZoom = ref(config.zoom);
config.$subscribe(() => {
  inputZoom.value = config.zoom;
});

async function handleZoomChange(value: number | null) {
  if (value === null || !__APP__)
    return;
  config.zoom = value;
  try {
    await invoke('set_zoom', { zoomLevel: value });
  } catch (e) {
    console.error('Failed to set zoom:', e);
  }
}

// Apply zoom on mount
if (__APP__) {
  invoke('set_zoom', { zoomLevel: config.zoom }).catch((e) => {
    console.error('Failed to apply initial zoom:', e);
  });
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

    <NFormItem v-if="__APP__" :label="t('settings.ui.zoom')">
      <NInputNumber
        v-model:value="inputZoom"
        :format="value => `${Math.round((value ?? 1) * 100)}%`"
        :max="MAX_ZOOM"
        :min="MIN_ZOOM"
        :step="ZOOM_STEP"
        @update:value="handleZoomChange"
      />
    </NFormItem>
  </NForm>
</template>
