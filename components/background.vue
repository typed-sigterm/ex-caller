<script lang="ts" setup>
export type Status = 'normal' | 'ready-rolling' | 'rolling' | 'pausing'

/** 当前状态（决定显示的背景） */
const status = defineModel<Status>('status')

const theme = useThemeStore()

// 预加载背景视频
watchImmediate(() => theme.backgroundRolling?.url, (url) => {
  if (!url)
    return
  useHead({
    link: [{
      rel: 'prefetch',
      href: url,
    }],
  })
})

const videoElement = ref<HTMLVideoElement | null>(null)
const rollingUsingVideo = computed(() => { // backgroundRolling 使用视频
  return theme.backgroundRolling && theme.backgroundRolling.url
})

whenever(() => status.value === 'pausing', () => {
  videoElement.value?.pause()
})

const [DefineDefaultBackground, DefaultBackground] = createReusableTemplate()
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
