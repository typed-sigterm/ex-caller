<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme';
import { __APP__ } from '@/utils/app';
import { preload } from '@/utils/ui';
import { createReusableTemplate, watchImmediate } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

export type Status = 'normal' | 'ready-rolling' | 'rolling' | 'pausing';

/** 当前状态（决定显示的背景） */
const status = defineModel<Status>('status');

const theme = useThemeStore();

// 预加载背景视频
if (__APP__) {
  watchImmediate(() => theme.backgroundRolling?.url, (url) => {
    if (url)
      preload(url, 'video');
  });
}

const videoElement = ref<HTMLVideoElement | null>(null);
const rollingUsingVideo = computed(() => { // backgroundRolling 使用视频
  return theme.backgroundRolling && theme.backgroundRolling.url
    && theme.properties.backgroundRolling.mimeType.startsWith('video/');
});

watch(status, (value) => {
  if (value === 'pausing')
    videoElement.value?.pause();

  // ready-rolling 时，如果无需加载视频，则直接切换到 rolling
  // 如果需要加载视频，则在 <video> 事件里处理了
  if (value === 'ready-rolling' && !rollingUsingVideo.value)
    status.value = 'rolling';
});

const [DefineDefaultBackground, DefaultBackground] = createReusableTemplate();
</script>

<template>
  <DefineDefaultBackground>
    <img v-if="theme.background" class="bg" :src="theme.background.url">
  </DefineDefaultBackground>

  <DefaultBackground v-if="status === 'normal'" />

  <template v-else>
    <!-- 使用 v-show 避免多次加载视频资源 -->
    <video
      v-show="rollingUsingVideo"
      ref="videoElement"
      class="bg"
      autoplay
      @play="status = 'rolling'"
    >
      <source
        :src="theme.backgroundRolling?.url"
        :type="theme.properties.backgroundRolling.mimeType"
      >
      <DefaultBackground />
    </video>

    <DefaultBackground v-show="!rollingUsingVideo" disablepictureinpicture />
  </template>
</template>

<style scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}
</style>
